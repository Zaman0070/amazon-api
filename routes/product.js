const express = require('express');
const productRouter = express.Router();
const auth = require('../middlewares/auth');
const { Product } = require('../models/product');

// Get product by category

// if we want /api/products?category=Mobile => req.query.category
// if we want /api/products:category=Mobile => req.params.category

productRouter.get('/api/products',auth,async(req ,res)=>{
    try{
        const product = await Product.find({category : req.query.category});
        res.json(product);
    }catch(e){
        res.status(500).json({error:e.message});
    }
});

// Create get request to search product

productRouter.get('/api/products/search/:name',auth,async(req ,res)=>{
    try{
        const product = await Product.find({
            name:{$regex: req.params.name , $option:'i'},
        });
        res.json(product);
    }catch(e){
        res.status(500).json({error:e.message});
    }
});


module.exports = productRouter;