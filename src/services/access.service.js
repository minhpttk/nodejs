'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.service')
const { createTokenPair } = require("../auth/authUtils")

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
}
class AccessService {
    static signUp = async({name, email, password}) => {
        try {
            // check email exist
            const holderShop = await shopModel.findOne({email}).lean()
            if (holderShop) {
                return {
                    code: '400',
                    message: 'Email already exists',
                    status: 'error'
                }
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
                const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096,
                    publicKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem'
                    },
                    privateKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem'
                    }
                })

                //create token
                const publicKeyString = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                })
                console.log("check publicKeyString",publicKeyString)
                if (!publicKeyString) {
                    return {
                        code: '400',
                        message: 'Error when create token',
                        status: 'error'
                    }
                }

                const payload = {
                    userId: newShop.id,
                    email
                }
                const tokens = await createTokenPair(payload, publicKeyString, privateKey)
                console.log(tokens)

                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({fields: ['_id', 'name', 'email'], object: newShop}),
                        tokens
                    }
                }
            }
            return {
                code: 200,
                metadata: null,
            }
        } catch (error) {
            return {
                code: '400',
                message: error.message,
                status: 'error'
            }
        }
    }
}

module.exports = AccessService