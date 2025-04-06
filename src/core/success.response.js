'use strict'

const STATUS_CODE = {
    OK: 200,
    CREATED: 201,
}

const ReasonStatusCode = {
    OK: 'Success',
    CREATED: 'Created',
}

class SuccessResponse {
    constructor({message, statusCode = STATUS_CODE.OK, reason = ReasonStatusCode.OK, metadata = {} }) {
        this.message = !message ? reason : message
        this.statusCode = statusCode
        this.reason = reason
        this.metadata = metadata
    }

    send(res, headers = {}) {
        return res.status(this.statusCode).json(this)
    }
}

class OK extends SuccessResponse {
    constructor({message, metadata}) {
        super({message, metadata})
    }
}

class CREATED extends SuccessResponse {
    constructor({message, statusCode = STATUS_CODE.CREATED, reason = ReasonStatusCode.CREATED, metadata}) {
        super({message, statusCode, reason, metadata})
    }
}

module.exports = {
    OK,
    CREATED
}





