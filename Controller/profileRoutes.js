const express = require("express");
const profileRoutes = express.Router();
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

profileRoutes.get("/profile", async (req, res) => {
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
profileRoutes.post("/profile",[checkNewUserMobile,checkNewUserEmail], async (req, res) => {
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
profileRoutes.post("/login", async (req, res) => {
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

profileRoutes.get('/verify-token',authMiddleware, async (req,res)=>{
  const token = req.headers.authorization;
  console.log(token)
  res.send("OK")
})

module.exports = profileRoutes;
