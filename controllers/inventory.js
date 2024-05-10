const models = require('../models/user.js');
const Inventory = models.Inventory;
const express = require('express');
const router = express.Router();

// index route
router.get('/', async (req,res)=>{
    const allInventories = await Inventory.find()
    res.render('inventories/index',{inventories:allInventories});
})

// get create form for inventory
router.get('/new', async (req,res)=>{
    res.render('inventories/new');
})

// create a new inventory
router.post('/', async (req,res)=>{
    req.body.owner = req.session.user._id
    await Inventory.create(req.body)
    res.redirect('/inventories')
})

// show inventory by ID
router.get('/:inventoryId',async (req,res)=>{
    const foundInventory = await Inventory.findById(req.params.inventoryId).populate('owner').populate('products');
    res.render("inventories/show",{inventory:foundInventory});
})

// get edit form
router.get('/:inventoryId/edit', async (req,res)=>{
    const foundInventory = await Inventory.findById(req.params.inventoryId).populate('owner');
    res.render("inventories/edit",{inventory:foundInventory});
})

// update inventory
router.put('/:inventoryId', async (req,res)=>{
    const newInventory = await Inventory.findByIdAndUpdate(
        req.params.inventoryId,
        req.body,
        {new:true}
    ).populate('owner');
    res.render('inventories/show',{inventory:newInventory});
})

// Delete route
router.delete('/:inventoryId', async (req, res) => {
    // need to write the logic to delete all products
    await Inventory.findByIdAndDelete(req.params.inventoryId)
    res.redirect('/inventories');
})

module.exports = router;