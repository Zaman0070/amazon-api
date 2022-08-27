const mongoose = require("mongoose");
const ratinSchema = require("./rating");

const productSchema = mongoose.Schema({
    productName:{
        type: String,
        required :true,
        trim:true,
    },
    description:{
        type: String,
        required :true,
        trim:true,
    },
    images:[
        {
            type: String,
            required :true,
        },
    ],
    price:{
        type: Number,
        required :true,
    },
    quantity:{
        type: Number,
        required :true,
    },
    category:{
        type: String,
        required :true,
        trim:true,
    },
    ratings: [
        ratinSchema
    ]

});

const Product = mongoose.model('Product',productSchema);
module.exports = {Product , productSchema};