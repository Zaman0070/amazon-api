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

// create a post request to rating a product

productRouter.post('/api/rating-product',auth, async(req , res)=>{
   try{
    const {id , rating} = req.body;
    let product = await Product.findById(id);
    for(let i=0; i<product.ratings.length;i++){
        if(product.ratings[i].userId == req.user){
            // i = start && 1 = how many number is deleted
            product.ratings.splice(i , 1);
            break;
        }
    }
    const ratinSchema = {
        userId:req.user,
        rating,
    };
    product.ratings.push(ratinSchema);
    product = await product.save();
    res.json(product);
   }catch(e)
   {
    res.status(500).json({error:e.message});
   }
});

// deal-of-day api
// product A => total rating 10
// product B => total rating 30
// product C => total rating 50
productRouter.get('/api/deal-of-day',auth ,async (req , res)=>{
    try{
        let product = await Product.find({});
       product =  product.sort((a ,b)=>{
            let aSum =0;
            let bSum =0;

        for(let i =0; i<a.ratings.length; i++){
            aSum += a.ratings[i].rating;
        }
        for(let i =0; i<b.ratings.length; i++){
            bSum += b.ratings[i].rating;
        }
        return aSum < bSum ? 1 : -1; 
        });

        res.json(product[0]);
    }catch(e){
        res.status(500).json({error : e.message});
    }
});


module.exports = productRouter;