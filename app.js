const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

var items = ["Buy The Food", "Cook The Food", "Eat The Food"];

mongoose.connect("mongodb://localhost:27017/todoListDB",{useNewUrlParser:true,useUnifiedTopology: true});


let today = new Date();
var options = {
  weekday:"long",
  day:"numeric",
  month:"long"
};
const day = today.toLocaleDateString("en-US",options);

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

const itemsArray = [item1, item2,item3]

const listSchema = new mongoose.Schema({
  name:String,
  items:[itemsSchema]
});

const List =  mongoose.model("List",listSchema);


app.get("/", function(req, res) {

  Item.find({},function(err,result){
    if(result.length==0){
      if(err){
        console.log(err);
      }else{
        Item.insertMany(itemsArray,function(err){
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
  const item = req.body.item;
  const listName = req.body.submit;
  const dbItem = Item({
    itemName: item
  });

  if(listName == day){
    dbItem.save();
    res.redirect("/")
  }else{
    List.findOne({name: listName},function(err,foundList){
      foundList.items.push(dbItem);
      foundList.save();
      res.redirect("/"+listName);
    });
  }

});

app.get("/:newListName",function(req, res){
  // console.log(req.params.newListName);
  const newListName = _.capitalize(req.params.newListName);
  List.findOne({name: newListName},function(err,found){
    if(!err){
      if(!found){
        // create a new listen
        const list = new List({
          name: newListName,
          items: itemsArray
        })
        list.save();
        res.redirect("/"+ newListName);
      }else{
        res.render("weekdays",{dayName1: found.name, newListItem: found.items})
      }
    }
  });
});

app.post("/delete", function(req, res) {
  const itemId = req.body.chk_bx;
  const thisList = req.body.thisList;

  if(thisList == day){
    Item.findByIdAndRemove(itemId, function(err,result){
      if (err){
        console.log(err);
      }else{
        console.log("item deleted ",result);
        res.redirect("/");
      }
    });
  }else{
    List.findOneAndUpdate({name: thisList},{$pull: {items: {_id:itemId}}},function(err,foundList){
      if (!err){
        res.redirect("/" + thisList);
      }
    });
  }

});

app.listen(3000, function() {
  console.log("Server started at port 3000");
})
