const express = require('express');
const connectToDb = require("../Config/db");
const mongoose = require("mongoose");
const journeyModel = require("../Models/journey.model");
const dateGenerator = require('../Utils/commonUtils');
const journeyRoutes = express.Router();

journeyRoutes.post("/create-journey", async (req,res)=>{
    
    try{
        const newJourney = journeyModel(req.body);
        newJourney.createdAt = dateGenerator()
        newJourney.updatedAt = dateGenerator()
        console.log(newJourney)
        const savedJourney = await newJourney.save();
        console.log(savedJourney);
        res.status(201).json({"message":"Saved successfully","status":1,"data":savedJourney})
    }
    catch(err){
        res.status(404).json({"message":"Something went wrong","status":0,"error message":err})
    }

})

journeyRoutes.get("/journey", async (req,res)=>{
    const userId = 123
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

//journeyRoutes.delete("/delete-journey",async)

module.exports = journeyRoutes