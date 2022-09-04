const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("config");
var bodyParser = require('body-parser');
const app = express();
const auth = require("./middleware/auth")
const {Message} = require("./models/message");
const {User} = require("./models/user");
var jsonParser = bodyParser.json();
require("./setup/cors")(app);
require("./setup/db")();
const {Item} = require("./models/Item")

app.get("/Market", jsonParser, async (req, res) => {
  const items = await Item.find();
  res.send(items);
});

app.post("/Register", jsonParser, async (req, res) => {
  let user = await User.findOne({username:req.body.username});
  if (user) return res.status(400).send("Username already exists")
  user = new User({
    username : req.body.username,
    password : req.body.password,
    steps: 0,
    sales: req.body.sales,
    messages:[]
  });
  await user.save();
  const token = jwt.sign({_id:user._id, username:user.username, steps: user.steps, sales:user.sales, messages:user.messages}, "jwtPrivateKey");
  res
  .header('x-token', token)
  .header("access-control-expose-headers", "x-token")
  .send(user);
})

app.post("/Login", jsonParser, async (req, res) => {
  let user = await User.findOne({username:req.body.username});
  if (!user) return res.status(400).send("Invalid username or password.")
  if (user.password !== req.body.password) return res.status(400).send("Invalid username or password.")
  
  const token = jwt.sign({_id:user._id, username:user.username, steps:user.steps, sales:user.sales, messages:user.messages}, "jwtPrivateKey");
  res.send(token);
})


app.post("/Sell", jsonParser, async (req, res) => {
  const item = new Item({
    owner:req.body.owner,
    name: req.body.name,
    description: req.body.description,
    pic: req.body.pic,
    interested: 0,
    gm: 5,
    bought: false,
    prices:[],
  });
  const itemback = await item.save();
  res.send(itemback);
});

function getGm(item) {
  let sum = 0;
   for (var i = 0; i < item.prices.length; i++) {
      sum += item.prices[i].price;
   }
   const avgPrice = sum / item.prices.length;
   let gm = Math.round(10 - item.prices.length * (2) + avgPrice * 5)
   if (gm < 0 || item.prices.length == 0) {
      gm = 5;
   }
   return gm;
}

app.put("/Buy/:id", jsonParser, async (req, res) => {
  let item = await Item.findByIdAndUpdate(
    req.params['id'],
    { 
      owner:req.body.owner,
      name: req.body.name,
      description: req.body.description,
      pic: req.body.pic,
      gm: getGm(req.body),
      reported: req.body.reported,
      bought: req.body.bought,
      prices:req.body.prices
      })
  res.send(item);
});


app.get("/Buy/:id",  jsonParser, async (req, res) => {
  const id = req.params['id'];
  const item = await Item.findById(id);
  res.send(item);
});

app.delete("/Delete/:id", jsonParser, async (req, res) => {
  const id = req.params['id'];
  const item = await Item.findByIdAndRemove(id);
  if (!item)
    return res.status(404).send("The message with the given ID was not found.");
  res.send(item);
});


app.put("/UpdateUser", jsonParser, async (req, res) => {
  let user = await User.findByIdAndUpdate(
    req.body._id,
    { 
      username: req.body.username,
      password: req.body.password,
      steps: req.body.steps,
      sales: req.body.sales,
      messages: req.body.messages
      })
  res.send(user);
});

app.put("/UpdateMessage", jsonParser, async (req, res) => {
  const id = req.body.to;
  let user = await User.findById(id);
  user = await User.findByIdAndUpdate(id,
    { 
      username: req.body.username,
      password: req.body.password,
      steps: req.body.steps,
      sales: req.body.sales,
      messages: [...user.messages, req.body]
      })
  res.send(user);
});

const port = process.env.PORT || config.get("port");
const server = app.listen(port, () =>
  console.log(`Listening on port ${port}...`)
);

module.exports = server;
