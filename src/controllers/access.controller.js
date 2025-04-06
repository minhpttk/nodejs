'use strict'

const accessService = require('../services/access.service')
const {CREATED} = require('../core/success.response')

class AccessController {

    signUp = async (req, res, next) => {
        const {email, password, name} = req.body
        const dataResponse = await accessService.signUp({email, password, name})
        return new CREATED({
            message: 'Shop created successfully',
            metadata: dataResponse
        }).send(res)
    }
}

module.exports = new AccessController()