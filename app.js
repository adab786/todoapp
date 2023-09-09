const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
// const BASE_URL=process.env.BASE_URL;
const app = express();
// const date = require(__dirname + "/date.js");
// var items = ["buy food", "cook food", "eat food"];
mongoose.connect("mongodb://localhost:27017/todolistdb");
const itemSchema = {
  name: "string",
};

const Item = mongoose.model("Item", itemSchema);
const item1 = new Item({
  name: "welcome to our todo app",
});
const item2 = new Item({
  name: "hit + add new item",
});
const item3 = new Item({
  name: "<-- hit this to delete an item ",
});

const defaultitems = [item1, item2, item3];

app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/", function (req, res) {
  // let day = date.getDay();
  // let currenttime = date.gettime();

  Item.find({}, function (err, founditem) {
    if (founditem.length === 0) {
      Item.insertMany(defaultitems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("successful");
        }
      });
      res.redirect("/");
    } else {
      res.render("template", {
        kindofday: "Today",
        newlistofitems: founditem,
        // time: currenttime,
      });
    }
  });
});
app.post("/", function (request, response) {
  const itemName = request.body.newitem;
  const item = new Item({
    name: itemName,
  });
  item.save();
  response.redirect("/");
});
app.post("/delete", function (req, res) {
  const indicator = req.body.checkbox;
  Item.findByIdAndRemove(indicator, function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.listen(3000, function () {
  console.log("server has started at 3000");
});
