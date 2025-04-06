'use strict'

const {Schema, model, Types} = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'

var keytokenSchema = new Schema({
    
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Shop',
    },
    publicKey: {
        type: String,
        required: true,
        trim: true,
    },
    privateKey: {
        type: String,
        required: true,
        trim: true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
    refreshTokenUsed: {
        type: Array,
        default: [],
    },
}, {
    collection: COLLECTION_NAME,
    timestamps: true,
});

//Export the model
module.exports = model(DOCUMENT_NAME, keytokenSchema, COLLECTION_NAME);
