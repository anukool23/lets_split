var jwt = require('jsonwebtoken');
const mongoose = require('mongoose')
const UserModel = require('../Models/user.model')

const authMiddleware =async (req,res,next)=>{
    
  const token = req.headers?.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).send("Access denied. No token provided!")
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        // console.log("The decoded is",decoded)
        req.user = await UserModel.findById(decoded._id);
        // console.log("req.user is",req.user)
        next()
    } catch (err) {
        res.status(400).json({message:"Invalid token",error:err})
    }
  }
module.exports = authMiddleware