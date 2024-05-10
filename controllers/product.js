const models = require('../models/user.js');
const Product = models.Product;
const express = require('express');
const router = express.Router();

// index route
router.get('/', async (req,res)=>{
    const allProducts = await Product.find()
    res.render('products/index',{products:allProducts});
})

// get create form for product
router.get('/new', async (req,res)=>{
    res.render('products/new');
})

// create a new product
router.post('/', async (req,res)=>{
    req.body.owner = req.session.user._id
    await Product.create(req.body)
    res.redirect('/products')
})



module.exports = router;