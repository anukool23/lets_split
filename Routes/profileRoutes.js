const express = require('express');
const router = express.Router();
const connectToDb = require("../Config/db")
const mongoose = require('mongoose')
const UserModel = require('../Models/user.model');
const dateGenerator = require('../Utils/commonUtils');

router.get('/getprofiledetail',async(req,res)=>{

    try {
        let userDetail = null;
        
        if (req.query.email) {
            userDetail = await UserModel.findOne({ email: req.query.email });
            if(userDetail){
                return res.status(200).json({"message" : "detail with email found","status":1,"data": userDetail})
            }
            else{
                return res.status(404).json({ message: 'User not found', "status":0 });
            }
        } else if (req.query.mobile) {
            userDetail = await UserModel.findOne({ mobile: req.query.mobile });
            if(userDetail){
                return res.status(200).json({"message" : "detail with mobile found","status":1,"data": userDetail})
            }
            else{
                return res.status(404).json({ message: 'User not found',"status":0 });
            }
        }
         else {
            return res.status(404).json({ message: 'Please provide either Email or mobile in Query Param',"status":0 });
        }
    } catch (error) {
        console.error('Error fetching user details:', error);
        return res.status(500).json({ message: 'Internal server error',"status":0 });
    }
})

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
        const existingUserEmail = await checkNewUserEmail(payload.email);
        const existingUserMobile = await checkNewUserMobile(payload.mobile);
        if (existingUserEmail &&  existingUserMobile) {
            return res.status(400).json({ message: 'Email and mobile already exists' });
        }
        if (existingUserEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        if (existingUserMobile) {
            return res.status(400).json({ message: 'Mobile already exists' });
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
async function checkNewUserEmail(email) {
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

async function checkNewUserMobile(mobile) {
    try {
        const user = await UserModel.findOne({ mobile: mobile });
        if (user) {
            console.log('Mobile exists in the database');
            return user;
        } else {
            console.log('Mobile does not exist');
            return null;
        }
    } catch (error) {
        console.error('Error while checking mobile:', error);
        throw error;
    }
}