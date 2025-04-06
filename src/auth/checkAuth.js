'use strict';

const apikey = require('../services/apikey.service');

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}
const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString();
        if (!key) {
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }
        //check objKey
        const objKey = await apikey.findById(key);
        if (!objKey) {
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }
        req.objKey = objKey;
        return next();
        
    } catch (error) {
        
    }
}

const checkPermission = (permission) => {
    return (req, res, next) => {
        if (!req.objKey.permissions.includes(permission)) {
            return res.status(403).json({message: 'Permission Denied'})
        }
        return next();
    }
}

const asyncHandler = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch(next)
    }
}

module.exports = {
    apiKey,
    checkPermission,
    asyncHandler
}
