'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.service')
const { createTokenPair } = require("../auth/authUtils")
const { getInfoData } = require("../utils")
const { BadRequestError, AuthFailureError } = require('../core/error.response')
const { findByEmail } = require('./shop.service')

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
        console.log(delkey)
        return delkey
    }
}

module.exports = AccessService