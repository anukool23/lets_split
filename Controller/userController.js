const UserModel = require('../Models/user.model');
const mongoose = require('mongoose');
const dateGenerator = require('../Utils/commonUtils');
const encryptPassword = require('../Utils/utils');
const comparePassword = require('../Utils/utils');
const tokenGeneration = require('../Utils/utils');
const { BloomFilter } = require("../Utils/bloom-filter");
require('dotenv').config()

async function createUser(req, res) {
    const payload = req.body
    payload.joining_DatenTime= dateGenerator()
    payload.password =await encryptPassword(payload.password)
  try {
    if(payload.mobile.length !== 10){
      logger.info("Mobile number should be of 10 digits")
      res.status(404).json({message:"Mobile number should be of 10 digits",status:0})
    }
    const newUser = new UserModel(payload);
    const savedUser = await newUser.save();
    console.log(`User saved to DB ${savedUser}`);
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function checkUserName(req, res) {
  const value = req.body.username;
    if (!value) {
        return res.status(400).json({ message: "Username is required" });
    }
    const bloom = new BloomFilter(process.env.BLOOM_BIT_SIZE, process.env.BLOOM_HASHCOUNT);
   try{
    const exist = await bloom.alreadyExist(value); 
    if(exist){
        return res.status(403).json({ message: "Username already exists" });
    }   
    return res.status(200).json({ message: "Username is available" });
   }
   catch(err){
    return res.status(500).json({ message: "Error checking username", error:err });

   }
}

module.exports = {
    createUser,checkUserName
}