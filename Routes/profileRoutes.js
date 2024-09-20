const express = require('express');
const router = express.Router();
const connectToDb = require("../Config/db")
const mongoose = require('mongoose')
const UserModel = require('../Models/user.model');
const dateGenerator = require('../Utils/commonUtils');

//API to create new user
router.post('/profile',async (req,res)=>{
    const payload = {
        name:req.body.name,
        email:req.body.email,
        mobile:req.body.mobile,
        gender:req.body.gender,
        dob:req.body.dob,
        address:req.body.address,
        country:req.body.country,
        joining_code:req.body.joining_code,
        password:req.body.password,
        userId:req.body.email,
        joining_DatenTime:dateGenerator(),
        age: req.body.age,
    }
    
    try {
        const existingUser = await checkNewUser(payload.email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const newUser = new UserModel(payload);
        const savedUser = await newUser.save();
        console.log(`User saved to DB ${savedUser}`);
        res.json(savedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

})
module.exports = router;


//function to check if the user already exisit or not
async function checkNewUser(email) {
    try {
        const user = await UserModel.findOne({ email: email });
        if (user) {
            console.log('Email exists in the database');
            return user;
        } else {
            console.log('Email does not exist');
            return null;
        }
    } catch (error) {
        console.error('Error while checking email:', error);
        throw error;
    }
}