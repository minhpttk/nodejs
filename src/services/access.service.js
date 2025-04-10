'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.service')
const { createTokenPair } = require("../auth/authUtils")
const { getInfoData } = require("../utils")
const { BadRequestError, AuthFailureError } = require('../core/error.response')
const { findByEmail } = require('./shop.service')
const { ForbiddenError } = require('../core/error.response')
const { verifyJWT } = require('../auth/authUtils')
const keyTokenModel = require("../models/keytoken.model")

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
}
class AccessService {
    static signUp = async({name, email, password}) => {
            // check email exist
            const holderShop = await shopModel.findOne({email}).lean()
            if (holderShop) {
                throw new BadRequestError('Shop already exists')
            }
            const hashedPassword = await bcrypt.hash(password, 10)
            const newShop = await shopModel.create({
                name,
                email,
                password: hashedPassword,
                roles: [RoleShop.SHOP],
            })
            if (newShop) {
                //create private key and public key
                // const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
                //     modulusLength: 4096,
                //     publicKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem'
                //     },
                //     privateKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem'
                //     }
                // })
                //use basic algorithm
                const publicKey = crypto.randomBytes(64).toString('hex')
                const privateKey = crypto.randomBytes(64).toString('hex')
                
                
                const payload = {
                    userId: newShop.id,
                    email
                }
                const tokens = await createTokenPair(payload, publicKey, privateKey)
                
                //create token
                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey,
                    refreshToken: tokens.refreshToken
                })
                if (!keyStore) {
                    throw new BadRequestError('Error when create token')
                }
                return {
                    shop: getInfoData({fields: ['_id', 'name', 'email'], object: newShop}),
                    tokens
                }
            }
            return {
                code: 200,
                metadata: null,
            }
    }

    static signIn = async({email, password}) => {
        //Check exist
        const holderShop = await findByEmail({email})
        if (!holderShop) {
            throw new AuthFailureError('Shop not found')
        }
        //Verify password
        const match = bcrypt.compare(password, holderShop.password)
        if (!match) {
            throw new AuthFailureError('Authentication error')
        }
        //Generate public, private key
        const publicKey = crypto.randomBytes(64).toString('hex')
        const privateKey = crypto.randomBytes(64).toString('hex')
        // Generate token
        const tokens = await createTokenPair({userId: holderShop._id, email}, publicKey, privateKey)
        
        await KeyTokenService.createKeyToken({
            userId: holderShop._id,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken
        })
        return {
            shop: getInfoData({fields: ['_id', 'name', 'email'], object: holderShop}),
            tokens
        }
        
    }
    static logout = async({ keyStore}) => {
        const delkey = await KeyTokenService.removeKeyById(keyStore._id)
        return delkey
    }

    static handleRefreshToken = async(refreshToken) => {
        // 1 Kiểm tra refresh token đã được sử dụng chưa
        const checkRefreshTokenUsed = await KeyTokenService.checkRefreshTokenUsed(refreshToken)
        if (checkRefreshTokenUsed) {
            // decode xem user có trong hệ thống không
            const {userId, email} = await verifyJWT(refreshToken, checkRefreshTokenUsed.privateKey)
            // xóa record key store
            await KeyTokenService.deleteKeyByUserId(userId)
            throw new ForbiddenError('Something wrong happend!! Please relogin')
        }

        // 2 Kiểm tra refresh token có hợp lệ không
        const holdToken = await KeyTokenService.findByRefreshToken(refreshToken)
        if (!holdToken) throw new AuthFailureError('Shop not registered')
        // 3 Verify token
        const {userId, email} = await verifyJWT(refreshToken, holdToken.privateKey)
        // 4 check user có tồn tại không
        const holderShop = await findByEmail({email})
        if (!holderShop) throw new AuthFailureError('Shop not found')
        // 5 tạo token mới
        const tokens = await createTokenPair({userId, email}, holdToken.publicKey, holdToken.privateKey)
        // 6 update key store
        await keyTokenModel.findOneAndUpdate(
            { _id: holdToken._id },
            {
                $set: {
                    refreshToken: tokens.refreshToken
                },
                $addToSet: {
                    refreshTokenUsed: refreshToken
                }
            },
            { new: true } // Trả về document sau khi update
        );
        
        return {
            user: {userId, email},
            tokens
        }
    }
}

module.exports = AccessService