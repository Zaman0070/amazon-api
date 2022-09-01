const express = require('express');
const adminRouter = express.Router();
const admin = require('../middlewares/admin');
const { Product } = require('../models/product');
const Order = require('../models/order');

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

// Get All your products

adminRouter.get('/admin/get-products',admin,async(req ,res)=>{
    try{
        const product = await Product.find({});
        res.json(product);
    }catch(e){
        res.status(500).json({error:e.message});
    }
});

// Delete products

adminRouter.post('/admin/delete-products',admin,async(req , res)=>{
    try{
        const { id } = req.body;
        let product = await Product.findByIdAndDelete(id);
        res.json(product);
    }catch(e){
        res.status(500).json({error:e.message});
    }
});

// Get all Order

adminRouter.get('/admin/get-orders',admin,async(req , res)=>{
    try{
        const order = await Order.find()
        res.json(order);
    }catch(e){
        res.status(500).json({error:e.message});
    }
});

// change order status   /admin/change-order-status

adminRouter.get('/admin/change-order-status',admin,async(req , res)=>{
    try{
        const { id , status} = req.body;
        let order = await Order.findById(id);
        order.status = status;
        order = await order.save();
        res.json(order);
       
    }catch(e){
        res.status(500).json({error:e.message});
    }
});

// Analytices 

adminRouter.get('/admin/analytice',admin,async(req , res)=>{
    try{
       const order = await Order.find({});
       let totalEarning = 0;
       for(let i =0; i<order.length; i++){
        for(let j =0; j<order[i].product.length; j++){
            totalEarning += order[i].product[j].quantity * order[i].product[j].product.price;
        }
       }
       // Fetch category wise product 
       let mobileEarning = await fetchCategoryWiseProduct('Mobiles');
       let essentialsEarning = await fetchCategoryWiseProduct('Essentials');
       let appliancesEarning = await fetchCategoryWiseProduct('Appliances');
       let bookEarning = await fetchCategoryWiseProduct('Books');
       let fashionEarning = await fetchCategoryWiseProduct('Fashion');

       let earning = {
        totalEarning,
        mobileEarning,
        essentialsEarning,
        appliancesEarning,
        bookEarning,
        fashionEarning
       };
       res.json(earning);
       
    }catch(e){
        res.status(500).json({error:e.message});
    }
});

async function fetchCategoryWiseProduct(category){
   let earning = 0;
let categoryOrder = await Order.find({
    'products.product.category' : category,
});
for(let i =0; i<categoryOrder.length; i++){
    for(let j =0; j<categoryOrder[i].product.length; j++){
        earning += categoryOrder[i].product[j].quantity * categoryOrder[i].product[j].product.price;
    }
   }
   return earning;
}

module.exports = adminRouter;