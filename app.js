const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

var items = ["Buy The Food", "Cook The Food", "Eat The Food"];

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
  res.render("weekdays", {dayName1:day,newListItem: items});

});

app.post("/", function(req, res) {
  console.log(req.body);
  item = req.body.item;
  items.push(item);
  res.redirect("/")

});



app.listen(3000, function() {
  console.log("Server started at port 3000");
})
