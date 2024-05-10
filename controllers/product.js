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

// show inventory by ID
router.get('/:productId',async (req,res)=>{
    const foundProduct = await Product.findById(req.params.productId);
    res.render("products/show",{product:foundProduct});
})

module.exports = router;