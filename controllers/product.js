const models = require('../models/user.js');
const Product = models.Product;
const Inventory = models.Inventory;
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
    req.body.owner = req.session.user._id;
    const newProduct = await Product.create(req.body);

    // logic to add product into the inventory

    // find the inventory
    const foundInventory = await Inventory.findById(req.body.inventory);
    // console.log("The found Inventory is");
    // console.log(foundInventory);
    foundInventory.products.push(newProduct._id);

    foundInventory.save();

    res.redirect(`/inventories/${foundInventory._id}`);
})

// show inventory by ID
router.get('/:productId',async (req,res)=>{
    const foundProduct = await Product.findById(req.params.productId);
    res.render("products/show",{product:foundProduct});
})

// get edit form
router.get('/:productId/edit', async (req,res)=>{
    const foundProduct = await Product.findById(req.params.productId);
    res.render("products/edit",{product:foundProduct});
})

// update product
router.put('/:productId', async (req,res)=>{
    const newProduct = await Product.findByIdAndUpdate(
        req.params.productId,
        req.body,
        {new:true}
    );
    res.render('products/show',{product:newProduct});
})

// Delete route
router.delete('/:productId', async (req, res) => {
    await Product.findByIdAndDelete(req.params.productId)
    res.redirect('/products');
})

module.exports = router;