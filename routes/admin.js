const express = require('express');
const adminRouter = express.Router();
const admin = require('../middlewares/admin');
const { Product } = require('../models/product');

// Add Product

adminRouter.post('/admin/add-products',admin,async(req , res)=>{
    try{
        const {productName , description , price , quantity , images , category} = req.body;

        let product = new Product(
            {
            productName,
            description,
            price,
            quantity,
            images,
            category,
            }
        );
         product =await product.save();
         res.json(product);

    }catch(e){
        res.status(500).json({error: e.message});
    }
}); 

module.exports = adminRouter;