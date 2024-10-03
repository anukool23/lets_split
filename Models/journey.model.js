const mongoose = require('mongoose');

const journeySchema = new mongoose.Schema({
    journey_name : { 
        type : String, 
        required : true
    },
    creator : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        immutable: true
      },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      }],
    
    start_date : { 
        type : String
    },
    end_date : { 
        type : String
    },
    createdAt:{
        type: Date,
        required: true,
        immutable: true
    },
    updatedAt:{
        type: Date,
        required:true
    },
    last_updatedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      }

})

module.exports = mongoose.model('journey',journeySchema)

