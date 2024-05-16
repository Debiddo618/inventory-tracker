const models = require('../models/user.js');
const Inventory = models.Inventory;
const Product = models.Product;
const User = models.User;
const express = require('express');
const router = express.Router();

// Function to generate a random color
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// index route
router.get('/', async (req,res)=>{
    try {
        const allInventories = await Inventory.find({owner:req.session.user._id});
        res.render('inventories/index',{inventories:allInventories});
    } catch (error) {
        res.redirect('/');
    }
})

// get create form for inventory
router.get('/new', async (req,res)=>{
    res.render('inventories/new');
})

// create a new inventory
router.post('/', async (req,res)=>{
    try {
        req.body.owner = req.session.user._id;

        if(req.body.color === "#000000"){
            req.body.color = getRandomColor();
        }
    
        const newInventory = await Inventory.create(req.body);
    
        // adding the inventory to the user
        const foundUser = await User.findById(req.session.user._id);
        foundUser.inventories.push(newInventory._id);
    
        foundUser.save();
    
        res.redirect('/inventories');
    } catch (error) {
        res.redirect('/');
    }
})

// show inventory by ID
router.get('/:inventoryId',async (req,res)=>{
    try {
        const allInventories = await Inventory.find({owner:req.session.user._id});
        const foundInventory = await Inventory.findById(req.params.inventoryId).populate('owner').populate('products');
        res.render("inventories/show",{inventory:foundInventory,inventories:allInventories});
    } catch (error) {
        res.redirect('/');
    }
})

// get edit form
router.get('/:inventoryId/edit', async (req,res)=>{
    try {
        const foundInventory = await Inventory.findById(req.params.inventoryId).populate('owner');
        res.render("inventories/edit",{inventory:foundInventory});
    } catch (error) {
        res.redirect('/');
    }
})

// update inventory
router.put('/:inventoryId', async (req,res)=>{
    try {
        const newInventory = await Inventory.findByIdAndUpdate(
            req.params.inventoryId,
            req.body,
            {new:true}
        ).populate('owner').populate('products');
        const allInventories = await Inventory.find({owner:req.session.user._id});
        res.render('inventories/show',{inventory:newInventory, inventories:allInventories});
    } catch (error) {
        res.redirect('/');
    }
})

// Delete route
router.delete('/:inventoryId', async (req, res) => {
    try {
        // delete all products
        const inventoryToDelete = await Inventory.findById(req.params.inventoryId);
        for (const product of inventoryToDelete.products) {
            await Product.findByIdAndDelete(product);
        }

        // delete the inventory from User
        const currentUser = await User.findById(req.session.user._id);
        currentUser.inventories = currentUser.inventories.filter(inventory => inventory != req.params.inventoryId);
        await currentUser.save();

        // delete inventory
        await Inventory.findByIdAndDelete(req.params.inventoryId)
        res.redirect('/inventories');
    } catch (error) {
        res.redirect('/');
    }
})

module.exports = router;