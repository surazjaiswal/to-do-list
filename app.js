const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

var items = ["Buy The Food", "Cook The Food", "Eat The Food"];

mongoose.connect("mongodb://localhost:27017/todoListDB",{useNewUrlParser:true,useUnifiedTopology: true});

const itemsSchema = new mongoose.Schema({
  itemName:String
});

const Item =  mongoose.model("Item",itemsSchema);

const item1 = new Item({
  itemName:"Welcome to your to-do-list"
});
const item2 = new Item({
  itemName:"Hit enter/+ to add new item"
});
const item3 = new Item({
  itemName:" <-- Check to delete"
});


app.get("/", function(req, res) {

  //let day = date.getDate();
  let today = new Date();
  // var dayNum =today.getDay();
  // var days = ['Sunday','Monday','Tuseday','Wednesday','Thursday','Friday','Saturday'];
  var options = {
    weekday:"long",
    day:"numeric",
    month:"long"
  };
  let day = today.toLocaleDateString("en-US",options);

  Item.find({},function(err,result){
    if(result.length==0){
      if(err){
        console.log(err);
      }else{
        Item.insertMany([item1, item2,item3],function(err){
          if(err){
            console.log(err);
          }else{
            console.log("items added");
          }
        });
        console.log("default items added succesfully");
      }
    res.render("/");
    }
    else{
      res.render("weekdays", {dayName1:day,newListItem: result});
    }
  });
  // res.render("weekdays", {dayName1:day,newListItem: result});
});

app.post("/", function(req, res) {
  console.log(req.body);
  item = req.body.item;
  const dbItem = Item({
    itemName: item
  });
  dbItem.save();
  items.push(item);
  res.redirect("/")
});

app.post("/delete", function(req, res) {
  const itemId = req.body.chk_bx;
  // console.log(itemId);
  Item.findByIdAndRemove(itemId, function(err,result){
    if (err){
      console.log(err);
    }else{
      console.log("item deleted ",result);
      res.redirect("/");
    }
  });
});

app.listen(3000, function() {
  console.log("Server started at port 3000");
})
