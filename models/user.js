const mongoose = require("mongoose");
const {itemSchema} = require('./Item');

const messageSchema = 
new mongoose.Schema({
  from: {
    type: String,
    trim:true
  },
  to: {
    type: String,
    trim:true
  },
  comment: {
    type: String,
    trim:true,
    default:""
  }});
  

const userSchema = 
  new mongoose.Schema({
    username: {
      type: String,
      trim:true
    },
    password: {
      type: String
    },
    steps: {
      type: Number,
      default:0
    },
    sales: {
      type:[itemSchema],
      default:[]
    },
    messages: {
      type: [messageSchema],
      default: []
    }
  });

const User = mongoose.model('User', userSchema);
exports.User = User;
exports.userSchema = userSchema;
