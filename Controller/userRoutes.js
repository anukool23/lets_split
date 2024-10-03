const express = require("express");
const userRoutes = express.Router();
const connectToDb = require("../Config/db");
const mongoose = require("mongoose");
const UserModel = require("../Models/user.model");
const dateGenerator = require("../Utils/commonUtils");
const checkNewUserMobile =  require("../Middlewares/profileCheckMobile.middleware")
const checkNewUserEmail =  require("../Middlewares/profileCheckEmail.middleware");
const encryptPassword = require("../Utils/utils");
const comparePassword = require("../Utils/utils");
const tokenGeneration = require("../Utils/utils");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const authMiddleware = require('../Middlewares/auth.middleware')

userRoutes.get("/profile", async (req, res) => {
  try {
    let userDetail = null;

    if (req.query.email) {
      userDetail = await UserModel.findOne({ email: req.query.email });
      if (userDetail) {
        return res
          .status(200)
          .json({
            message: "detail with email found",
            status: 1,
            data: userDetail,
          });
      } else {
        return res.status(404).json({ message: "User not found", status: 0 });
      }
    } else if (req.query.mobile) {
      userDetail = await UserModel.findOne({ mobile: req.query.mobile });
      if (userDetail) {
        return res
          .status(200)
          .json({
            message: "detail with mobile found",
            status: 1,
            data: userDetail,
          });
      } else {
        return res.status(404).json({ message: "User not found", status: 0 });
      }
    } else {
      return res
        .status(404)
        .json({
          message: "Please provide either Email or mobile in Query Param",
          status: 0,
        });
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", status: 0 });
  }
});

//2. API to create new user
userRoutes.post("/profile",[checkNewUserMobile,checkNewUserEmail], async (req, res) => {
    const payload = req.body
    payload.joining_DatenTime= dateGenerator()
    payload.password =await encryptPassword(payload.password)
  try {
    const newUser = new UserModel(payload);
    const savedUser = await newUser.save();
    console.log(`User saved to DB ${savedUser}`);
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Login API
userRoutes.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email,password)
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      console.log("User not found",user)
      return res
        .status(404)
        .json({ message: "User not found, Please register first", status: 0 });
    }
    console.log("user password is ",user.password)
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log("This is isvalid",isValidPassword)
    if(!isValidPassword){
      return res
        .status(400)
        .json({ message: "Password is wrong", status: 0 });
    }
    const token = jwt.sign({ _id: user._id, email: user.email, mobile:user.mobile, role:user.role }, process.env.SECRET_KEY, { expiresIn: process.env.TOKEN_EXPIRY_IN })
    res.json({ token, message: "Logged in successfully!", data:{
      _id: user._id, email: user.email, mobile:user.mobile, role:user.role
    }  })
    
  } catch (err) {
    console.log("error")
    res.status(500).send(err);
  }
});

userRoutes.get('/verify-token',authMiddleware, async (req,res)=>{
  const token = req.headers.authorization;
  // console.log(token)
  res.status(200).json({token:token,data:req.user})
})

userRoutes.get('/users/:payload', authMiddleware, async (req, res) => {
  const load = req.params.payload;
  console.log(load);

  // Regular expression to check if it's an email
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(load);
  
  // Regular expression to check if it's a mobile number (adjust based on expected format)
  const isMobile = /^\d{10}$/.test(load); // assuming mobile number is 10 digits

  let query = {};

  if (isEmail) {
    query = { email: load }; // search by email
  } else if (isMobile) {
    query = { mobile: load }; // search by mobile
  } else {
    return res.status(400).json({ message: "Invalid payload format. Expected email or mobile number." });
  }

  try {
    const user = await UserModel.findOne(query);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(user);
    res.status(200).json({ message: "User found", "user" :{
      userId:user._id,
      email : user.email,
      mobile: user.mobile
    } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = userRoutes;
