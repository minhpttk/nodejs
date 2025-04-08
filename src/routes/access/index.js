'use strict'

const express = require('express')
const router = express.Router()
const accessController = require('../../controllers/access.controller')
const asyncHandler = require('../../helper/asyncHandler')
const {authenication} = require('../../auth/authUtils')
//signup
router.post('/shop/signup',asyncHandler(accessController.signUp))
router.post('/shop/signin',asyncHandler(accessController.signIn))
//authenication
router.use(authenication)
router.post('/shop/logout',asyncHandler(accessController.logout))
router.post('/shop/refresh-token',asyncHandler(accessController.handleRefreshToken))
module.exports = router