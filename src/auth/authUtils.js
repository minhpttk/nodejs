'use strict'

const JWT = require('jsonwebtoken')
const asyncHandler = require('../helper/asyncHandler')
const KeyTokenService = require('../services/keyToken.service')

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
    CLIENT_ID: 'x-client-id',
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        //access token
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2 days',
        })
        //refresh token
        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '7 days',
        })
        JWT.verify(accessToken, publicKey, (err, decode ) => {
            if (err) {
                console.error('error verify::', err)
            } else {
                console.log('decode verify::', decode)
            }
        })
        return {accessToken, refreshToken}
        
        
    } catch (error) {
        
    }
}

const authenication = asyncHandler(async (req, res, next) => {
    //1 Check userId missing
    const userId = req.headers[HEADER.CLIENT_ID]?.toString()
    if (!userId) {
        throw new AuthFailureError('Invalid Request')
    }
    //2 Get access token
    const keyStore = await KeyTokenService.findByUserId(userId)
    if (!keyStore) throw new AuthFailureError('Shop not registered')
    //3 Verify token is not expired
    const accessToken = req.headers[HEADER.AUTHORIZATION]?.toString()
    if (!accessToken) throw new AuthFailureError('Invalid Request')
    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid User')
        req.keyStore = keyStore
        return next()
    } catch (error) {
        throw error
    }
})

module.exports = {createTokenPair, authenication}
