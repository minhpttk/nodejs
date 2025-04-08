'use strict'

const {model, Schema, Types} = require('mongoose')

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const productSchema = new Schema({
    product_name: {
        type: String,
        required: true,
    },
    product_thumb: {
        type: String,
        required: true,
    },
    product_description:{
        type: String
    },
    product_price: {
        type: Number,
        required: true,
    },
    product_quantity: {
        type: Number,
        required: true,
    },
    product_type: {
        type: String,
        required: true,
        enum: ['Electronics', 'Clothes', 'Furniture'],
    },
    product_shop: {
        type: Types.ObjectId,
        ref: 'Shop',
    },
    product_attributes: {
        type: Schema.Types.Mixed,
        required: true,
    },
},
{
    collection: COLLECTION_NAME,
    timestamps: true,
})

//defince the product type clothing
const clothingSchema = new Schema({
    brand: {
        type: String,
        required: true,
    },
    size: String,
    material: String,
},{
    collation: 'clothes',
    timestamps: true,
}
)

//defince the product type electronics
const electronicsSchema = new Schema({
    manufacturer: {
        type: String,
        required: true,
    },
    model: String,
    color: String,
},{
    collation: 'electronics',
    timestamps: true,
}
)

module.exports = {
    product: model(DOCUMENT_NAME, productSchema, COLLECTION_NAME),
    clothing: model('Clothing', clothingSchema, 'Clothes'),
    electronic: model('Electronic', electronicsSchema, 'Electronics'),
}