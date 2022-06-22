require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const mongooseEncryption = require("mongoose-encryption");
const app = express();
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

console.log(process.env.SECRET);
// MongoDB start
mongoose.connect("mongodb://localhost:27017/userDB");
userSchema = new mongoose.Schema({
  email: String,
  password: String
});
const secret = "This is our little secret";
userSchema.plugin(mongooseEncryption,{secret:process.env.SECRET,encryptedFields:["password"]});

const User = new mongoose.model("User",userSchema);

// GET Method
// Get Home Page
app.get("/",function(req,res){
  res.render("home");
});
// Get register Page
app.get("/register",function(req,res){
  res.render("register");
});

// Get login Page
app.get("/login",function(req,res){
  res.render("login");
});

// POST Method
//post register Page
app.post("/register",function(req,res){
  const email = req.body.username;
  const password = req.body.password;
  const registeringUser = new User({
    email:email,
    password:password
  });
  registeringUser.save(function(err){
    if(err){
      console.log(err);
    }
    else{
      res.render("secrets");
    }
  });
});

//post login Page
app.post("/login",function(req,res){
  const email = req.body.username;
  const password = req.body.password;
  User.findOne({email:email},function(err,foundUser){
    if(err){
      console.log(err);
    }
    else{
      if(foundUser){
        if(foundUser.password == password){
          res.render("secrets");
        }
      }
    }
  });
});

// Listen to port
app.listen(3000,function(){
  console.log("You are on port 3000...");
});
