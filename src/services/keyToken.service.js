'use strict'

const keytokenModel = require("../models/keytoken.model")
const {Types} = require('mongoose')

class KeyTokenService {
    static createKeyToken = async({userId, publicKey, privateKey, refreshToken}) => {
        try {
            //level 0
            // const tokens = await keytokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey
            // })
            // return tokens ? tokens.publicKey : null

            //level 1
            const filter = {user: userId}, update = {
                publicKey,privateKey, refreshTokenUsed: [], refreshToken
            }, options = {upsert: true, new: true}
            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)
            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }

    static findByUserId = async (userId) => {
        return await keytokenModel.findOne({user: new Types.ObjectId(userId)}).lean()
    }

    static removeKeyById = async (id) => {
        return await keytokenModel.findByIdAndDelete(id)
    }

    static checkRefreshTokenUsed = async(refreshToken) => {
        return await keytokenModel.findOne({
            refreshTokenUsed: refreshToken,
        })
    }

    static deleteKeyByUserId = async(userId) => {
        return await keytokenModel.findOneAndDelete({user: Types.ObjectId(userId)})
    }

    static findByRefreshToken = async(refreshToken) => {
        return await keytokenModel.findOne({
            refreshToken
        }).lean()
    }

}

module.exports = KeyTokenService