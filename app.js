//jshint esversion:6
require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const { setEngine } = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 12;


const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://0.0.0.0:27017/userDB");

const userSchema = new mongoose.Schema({
    email : String,
    password : String
});

const User = mongoose.model("User", userSchema);



app.get("/", (req, res)=>{
    res.render("home");
});

app.route("/login")
    .get((req, res)=>{
    res.render("login");
    })
    .post((req, res)=>{
        const username = req.body.username;
        const password = req.body.password;

       User.findOne({email : username})
        .then((founduser)=>{

            bcrypt.compare(password, founduser.password).then((result)=> {
                // result == true
                if(result === true){
                    res.render("secrets");
                }else{
                    res.send("Invalid Password");
                }
            });
            
          
        })
        .catch((error)=>{
            res.send("User not found");
        })
    })

app.route("/register")
    .get((req, res)=>{
    res.render("register");
    })
    .post((req, res)=>{
        const email = req.body.username;
        const password = req.body.password;
        bcrypt.hash(password, saltRounds).then((hash)=>{
            // Store hash in your password DB.
            const newUser = new User({
                email : email,
                password : hash
            });
            newUser.save()
                .then(()=>{
                    res.render("secrets");
                })
                .catch((error)=>{
                    res.send(error);
                })
        });
    });

app.listen(3000, (req, res)=>{
    console.log("Server Started on port 3000");
})
