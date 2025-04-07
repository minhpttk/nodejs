'use strict'

const accessService = require('../services/access.service')
const {CREATED, OK} = require('../core/success.response')

class AccessController {

    signUp = async (req, res, next) => {
        const {email, password, name} = req.body
        const dataResponse = await accessService.signUp({email, password, name})
        return new CREATED({
            message: 'Shop created successfully',
            metadata: dataResponse
        }).send(res)
    }

    signIn = async (req, res, next) => {
        const {email, password} = req.body
        const dataResponse = await accessService.signIn({email, password})
        return new OK({
            message: 'Shop signed in successfully',
            metadata: dataResponse,
            options: {
                limit: 10,
            }
        }).send(res)
    }

    logout = async (req, res, next) => {
        const {keyStore} = req
        const dataResponse = await accessService.logout({keyStore})
        return new OK({
            message: 'Shop logged out successfully',
            metadata: dataResponse
        }).send(res)
    }
}

module.exports = new AccessController()