'use strict'

const { Schema, model, Types } = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const DOCUMENT_NAME = 'Shop'
const COLLECTION_NAME = 'Shops'

var userSchema = new Schema({
    name:{
        type:String,
        required:true,
        index:true,
        trim: true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum:['active', 'inactive'],
        default:'inactive',
    },
    verify:{
        type:Schema.Types.Boolean,
        default:false,
    },
    roles:{
        type:Array,
        default:[]
    },
}, {
    collection: COLLECTION_NAME,
    timestamps: true,
});

//Export the model
module.exports = model(DOCUMENT_NAME, userSchema, COLLECTION_NAME);

