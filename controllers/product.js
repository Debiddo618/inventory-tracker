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
    // create product
    const newProduct = await Product.create(req.body);

    // save product into invenotry
    const foundInventory = await Inventory.findById(req.body.inventory);
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
    const allInventories = await Inventory.find({owner:req.session.user._id});
    const newProduct = await Product.findByIdAndUpdate(
        req.params.productId,
        req.body,
        {new:true}
    );
    const foundInventory = await Inventory.find({products:req.params.productId}).populate('owner').populate('products');
    res.render("inventories/show",{inventory:foundInventory[0],inventories:allInventories});
})

// Delete route
router.delete('/:productId/:inventoryId', async (req, res) => {
    // remove product from inventory
    const foundInventory = await Inventory.findById(req.params.inventoryId);
    foundInventory.products = foundInventory.products.filter(product => product != req.params.productId);

    await foundInventory.save();

    // delete the product
    await Product.findByIdAndDelete(req.params.productId)
    res.redirect(`/inventories/${req.params.inventoryId}`);
})

module.exports = router;