'use strict'

const {product, electronic, clothing} = require('../models/product.model')
const { BadRequestError } = require('../core/error.response')
// defince factory class
export class FactoryProduct {
    static createProduct(product_type, product_attributes){
        switch (product_type) {
            case 'Clothes':
                return new Clothing(product_attributes).createProduct()
            case 'Electronics':
                return new Electronic(product_attributes).createProduct()
            default:
                throw new BadRequestError('Invalid product type')
        }
    }
}
// define the base product class
class Product{
    constructor(
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes
    ){
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }
    
    async createProduct(){
        return await product.create(this)
    }
}

class Clothing extends Product {

    async createProduct(){
        const newClothing = await clothing.create(this.product_attributes)
        if(!newClothing) return BadRequestError('Create clothing failed')

        const newProduct = await super.createProduct()
        if(!newProduct) return BadRequestError('Create product failed')
        return newProduct
    }
}

class Electronic extends Product {

    async createProduct(){
        const newElectronic = await electronic.create(this.product_attributes)
        if(!newElectronic) return BadRequestError('Create electronic failed')

        const newProduct = await super.createProduct()
        if(!newProduct) return BadRequestError('Create product failed')
        return newProduct
    }
}

module.exports = {Product, Clothing, Electronic}

