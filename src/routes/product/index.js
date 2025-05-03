'use strict'

const express = require('express')
const router = express.Router()
const productController = require('../../controllers/product.controller')
const asyncHandler = require('../../helper/asyncHandler')
const {authenication} = require('../../auth/authUtils')

//authenication
router.use(authenication)
//create product
router.post('/create', asyncHandler(productController.createProduct))

module.exports = router