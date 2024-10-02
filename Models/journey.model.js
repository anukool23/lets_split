const mongoose = require('mongoose');

const journeySchema = new mongoose.Schema({
    journey_name : { 
        type : String, 
        required : true
    },
    creator : { 
        type : String, 
        required : true, 
    },
    users: {
        type: Array,
    },
    
    start_date : { 
        type : String
    },
    end_date : { 
        type : String
    },
    createdAt:{
        type: Date,
    },
    updatedAt:{
        type: Date,
        required:true
    },
    last_updatedBy:{
        type:String,
        required:true
    }

})

module.exports = mongoose.model('journey',journeySchema)

