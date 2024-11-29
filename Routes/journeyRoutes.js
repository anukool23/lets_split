const express = require('express');
const connectToDb = require("../Config/db");
const mongoose = require("mongoose");
const journeyModel = require("../Models/journey.model");
const dateGenerator = require('../Utils/commonUtils');
const authMiddleware = require('../Middlewares/auth.middleware');
const journeyRoutes = express.Router();

journeyRoutes.post("/create-journey",authMiddleware, async (req,res)=>{
    
    try{
        const newJourney = journeyModel(req.body);
        newJourney.createdAt = dateGenerator()
        newJourney.updatedAt = dateGenerator()
        newJourney.last_updatedBy = req.user._id
        newJourney.creator = req.user._id
        console.log("New journey is",newJourney)
        const savedJourney = await newJourney.save();
        console.log("Saved journey is",savedJourney);
        res.status(201).json({"message":"Saved successfully","status":1,"data":savedJourney})
    }
    catch(err){
        res.status(404).json({"message":"Something went wrong","status":0,"error message":err})
    }

})

journeyRoutes.get("/journey",authMiddleware, async (req,res)=>{
    const userId = req.user._id
    req.body.creator = userId
    console.log(`User id is ${userId}`)
    try{
        const response =await journeyModel.find({ users: userId })
        if(response.length >0){
            res.status(200).json({"message":"Data fetched successfully","status":1,data:response})
        }
        else{
            res.status(200).json({"message":"No entry found","status":1})
        }
    }
    catch(err){

    }
  
})

journeyRoutes.delete("/delete-journey/:id",authMiddleware,async (req,res)=>{
    const journeyId = req.params.id;
    try{
        const deletedJourney = await journeyModel.deleteOne({_id:journeyId})
        if(deletedJourney.deletedCount == 1){
            res.status(200).json({message:"Journey deleted successfully"})
        }  
        else if(deletedJourney.deletedCount == 0){
            res.status(404).json({message:"Journey Not found"})
        }
        else{
            res.status(404).json({message:"Something went wrong, Please try after some time"})
        }
    }
    catch(err){
        res.status(500).json({message:"Internal server error, Try after sometime",error:err})
    }
})

module.exports = journeyRoutes