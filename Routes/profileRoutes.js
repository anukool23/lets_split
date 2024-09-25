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

profileRoutes.get("/getprofiledetail", async (req, res) => {
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
    payload.password = encryptPassword(payload.password)
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
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found, Please register first", status: 0 });
    }
    if(comparePassword(user.password, password)){
        console.log("1")
        //let authToken = tokenGeneration(user.email)
        let authToken = jwt.sign({ userId: user.email}, 'cool',{ expiresIn: 60 * 2});
        return res.json({ "message": "Login successful", "Status": 1,"token":authToken, "data": user });
    }
    else if (!comparePassword(user.password, password)) {
      return res
        .status(404)
        .json({ message: "Wrong Password, Please try again", status: 0 });
    }
    else{
        return res.status(500).json({message:"Something went wrong"})
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = profileRoutes;
