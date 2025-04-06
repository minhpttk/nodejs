'use strict'

const express = require('express')
const router = express.Router()
const {apiKey, checkPermission} = require('../auth/checkAuth');

//check apikey
router.use(apiKey);
//check permission
router.use(checkPermission('0000'));

router.use('/api/v1', require('./access'))

module.exports = router