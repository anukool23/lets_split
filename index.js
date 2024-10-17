const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const helmet = require('helmet')
const cors = require('cors')
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
const responseTime = require('response-time')
app.use(responseTime())
app.use(helmet())
require('dotenv').config()
const port =process.env.PORT || 3093
const serverIP = process.env.yourIP === null ? undefined : process.env.yourIP;
const connectToDb = require("./Config/db")
const userRoutes = require("./Controller/userRoutes")
const journeyRoutes = require("./Controller/journeyRoutes")
const dateGenerator = require('./Utils/commonUtils')
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

//----------------------------

const mongoose = require('mongoose');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Below all the app.use methods
app.use(session({
    secret: "anukooliscool",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());

// Starting the session
app.use(passport.session());

// Creating user schema and adding a plugin to it

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});
userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);
passport.use(User.createStrategy());

// Serializing and deserializing
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Handling get request on the home and login route
app.get("/", function (req, res) {

    if (req.isAuthenticated()) {
        res.send("You have already logged in. No need to login again");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

// Handling get request on login route
app.get("/login", function (req, res) {
    if (req.isAuthenticated()) {
        res.send("You have already logged in. No need to login again");
    } else {
        res.sendFile(__dirname + "/login.html");
    }
});

app.post("/register", function (req, res) {
    console.log(req.body);

    var email = req.body.username;
    var password = req.body.password;

    User.register({ username: email }, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function () {
                res.send("successfully saved!");
            });
        }
    });
});

// All handling related to login is done below.
app.post("/login", async function (req, res) {
    console.log(req.body);

    const userToBeChecked = new User({
        username: req.body.username,
        password: req.body.password,
    });

    req.login(userToBeChecked, async function (err) {
        if (err) {
            console.log(err);
            res.redirect("/login");
        } else {
            passport.authenticate("local")(req, res, async function () {
                try {
                    const docs = await User.find({ email: req.user.username });
                    if (docs.length > 0) {
                        console.log("credentials are correct");
                        res.send("login successful");
                    } else {
                        console.log("User not found");
                        res.redirect("/login");
                    }
                } catch (err) {
                    console.log(err);
                    res.redirect("/login");
                }
            });
        }
    });
});

//-----------------------------------------------

app.use("/user",userRoutes)
app.use("/journey",journeyRoutes);


app.all('*',(req,res)=>{
    res.send("This API is not valid, please check your API")
})

app.get("/", (req, res) => {
    res.status(200).send("Connected")
})


app.listen(port, serverIP, async () => {
    await connectToDb();
    console.log(`Server is running at Port ${port} , ${serverIP} and connected to DB`);
});

