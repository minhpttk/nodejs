'use strict'

const accessService = require('../services/access.service')

class AccessController {

    signUp = async (req, res, next) => {
        try {
            const {email, password, name} = req.body
            const dataResponse = await accessService.signUp({email, password, name})
            return res.status(201).json({
                code: dataResponse.code,
                message: dataResponse.message,
                status: dataResponse.status,
                metadata: dataResponse.metadata
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new AccessController()