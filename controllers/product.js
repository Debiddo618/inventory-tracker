const models = require('../models/user.js');
const Product = models.Product;
const Inventory = models.Inventory;
const express = require('express');
const router = express.Router();
const multer  = require('multer');
const fs = require('fs');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.png';
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
})
  
const upload = multer({ storage: storage })

// index route
router.get('/', async (req,res)=>{
    try {
        const allInventories = await Inventory.find({owner:req.session.user._id}).populate('products');
        const allProducts = await Product.find({owner:req.session.user._id})
        res.render('products/index',{products:allProducts, inventories:allInventories});
    } catch (error) {
        res.redirect('/');
    }
})

// get create form for product
router.get('/new', async (req,res)=>{
    res.render('products/new');
})

// create a new product
router.post('/',upload.single('image'), async (req,res)=>{
    try {
        // create product
        req.body.image = req.file.filename;
        req.body.owner = req.session.user._id;
        const newProduct = await Product.create(req.body);

        // save product into invenotry
        const foundInventory = await Inventory.findById(req.body.inventory);
        foundInventory.products.push(newProduct._id);
        foundInventory.save();

    res.redirect(`/inventories/${foundInventory._id}`);
    } catch (error) {
        res.redirect('/');
    }
})

// create a new product and redirect to product index
router.post('/allProducts',upload.single('image'), async (req,res)=>{
    try {
        // create product
        req.body.image = req.file.filename;
        req.body.owner = req.session.user._id;
        const newProduct = await Product.create(req.body);

        // save product into inventory
        const foundInventory = await Inventory.findById(req.body.inventory);
        foundInventory.products.push(newProduct._id);
        await foundInventory.save();

        const allInventories = await Inventory.find({owner:req.session.user._id}).populate('products');
        const allProducts = await Product.find({owner:req.session.user._id});


        res.render('products/index',{products:allProducts, inventories:allInventories});
    } catch (error) {
        res.redirect('/');
    }
})

// show product by ID
router.get('/:productId',async (req,res)=>{
    try {
        const allInventories = await Inventory.find({owner:req.session.user._id});
        const foundProduct = await Product.findById(req.params.productId);
        const foundInventory = await Inventory.find({products:foundProduct._id});
        res.render("products/show",{product:foundProduct, inventory:foundInventory[0], inventories:allInventories});
    } catch (error) {
        res.redirect('/');
    }
})

// get edit form
router.get('/:productId/edit', async (req,res)=>{
    try {
        const foundProduct = await Product.findById(req.params.productId);
        res.render("products/edit",{product:foundProduct});
    } catch (error) {
        res.redirect('/');
    }
})

// update product
router.put('/:productId',upload.single('image'), async (req,res)=>{
    try {
        const allInventories = await Inventory.find({owner:req.session.user._id});
        req.body.image = req.file.filename;
        const newProduct = await Product.findByIdAndUpdate(
            req.params.productId,
            req.body,
            {new:true}
        );
        const foundInventory = await Inventory.find({products:req.params.productId}).populate('owner').populate('products');
        res.render("inventories/show",{inventory:foundInventory[0],inventories:allInventories});
    } catch (error) {
        res.redirect('/');
    }
})

// Delete route
router.delete('/:productId/:inventoryId', async (req, res) => {
    try {
        // remove product from inventory
        const foundInventory = await Inventory.findById(req.params.inventoryId);
        foundInventory.products = foundInventory.products.filter(product => product != req.params.productId);

        await foundInventory.save();

        // delete the product
        await Product.findByIdAndDelete(req.params.productId)
        res.redirect(`/inventories/${req.params.inventoryId}`);
    } catch (error) {
        res.redirect('/');
    }
})

// Delete route and rediect to product index
router.delete('/:productId/:inventoryId/allproducts', async (req, res) => {
    try {
        // remove product from inventory
        const foundInventory = await Inventory.findById(req.params.inventoryId);
        foundInventory.products = foundInventory.products.filter(product => product != req.params.productId);

        await foundInventory.save();

        // delete the product
        await Product.findByIdAndDelete(req.params.productId)

        const allInventories = await Inventory.find({owner:req.session.user._id}).populate('products');
        const allProducts = await Product.find({owner:req.session.user._id});


        res.render('products/index',{products:allProducts, inventories:allInventories});
    } catch (error) {
        res.redirect('/');
    }
})

module.exports = router;