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










module.exports = router;