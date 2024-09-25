const mongoose = require('mongoose')
const UserModel = require("../Models/user.model");

//function to check if the user already exisit or not with email
const checkNewUserEmail = async (req,res,next)=>{
  const email = req.body.email
    try {
      const user = await UserModel.findOne({ email: email });
      if (user) {
        console.log("Email exists in the database");
        res.status(404).json({message:"User with this email already exisit, Either login or create account with new email"
          , status:0
        })
      } else {
        console.log("Email does not exist");
        next()
      }
    } catch (err) {
      console.error("Error while checking email:", err);
      res.status(500).json({message:"Something went wrong, Please try againa fter sometime",
        error:err})
    }
  }

  module.exports = checkNewUserEmail