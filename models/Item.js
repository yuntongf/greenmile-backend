const mongoose = require("mongoose");
const { userSchema } = require("./user");

const priceSchema = 
  new mongoose.Schema({
    buyer:{
      type: String
    },
    price:{
      type: Number
    }, 
    comment: {
      type: String
    }
  });

const itemSchema = 
   new mongoose.Schema({
    owner: {
      type: String,
      trim:true
    },
    name: {
       type: String,
       trim:true
     },
     description: {
       type: String,
       trim: true
     },
     pic : {
      type: String
     },
     interested : {
       type: Number,
       default:0
     },
     bought : {
       type : Boolean,
       default : false
     },
     reported : {
       type : Number,
       default : 0
     },
     gm : {
      type: Number,
      default: 10
     },
     date : {
       type:String
     },
     prices: {
      type: [priceSchema],
      default:[]
     }
   });
 
const Item = mongoose.model("Item", itemSchema);
exports.Item = Item;
exports.itemSchema = itemSchema;
 
 
 