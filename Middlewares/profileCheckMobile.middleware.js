const mongoose = require('mongoose')
const UserModel = require("../Models/user.model");

//function to check if the user already exisit or not with mobile
const checkNewUserMobile = async (req,res,next)=>{
  const mobile = req.body.mobile
  if(mobile.length !== 10){
    res.status(404).json({message:"Mobile number should be of 10 digits",status:0})
  }
  else{
    try {
      
        const user = await UserModel.findOne({ mobile: mobile });
        if (user) {
          console.log("Mobile exists in the database");
          res.status(404).json({message:"User with this mobile already exisit, Either login or create account with new mobile"
            , status:0
          })
        } else {
          console.log("Mobile does not exist");
          next()
        }
      } catch (err) {
        console.error("Error while checking mobile:", err);
        res.status(500).json({message:"Something went wrong, Please try againa fter sometime",
          error:err
        })
      }
    }
}




  module.exports = checkNewUserMobile