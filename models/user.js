const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  inventories:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory'
  }]
});

const inventorySchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
  },
  description:String,
  color:{
    type:String,
    default:"#cccccc"
  },
  owner:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  products:[{
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Product"
  }]
})

const productSchema = new mongoose.Schema({
  name:{
    type: String,
    required:true
  },
  description:{
    type:String
  },
  amount:{
    type: Number,
    required:true
  },
  status:{
    type:String,
    required:true,
    enum:["Active", "Inactive", "In Stock","Out of Stock", "On Hold", "Discontinued","Pre-Order","Backordered","Pending Approval"]
  },
  price:{
    type:Number,
    required:true
  },
  owner:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  image: String
})

module.exports = {
  User:mongoose.model('User', userSchema),
  Inventory:mongoose.model('Inventory', inventorySchema),
  Product:mongoose.model('Product', productSchema)
}
