const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : { 
        type : String, 
        required : true
    },
    email : { 
        type : String, 
        required : true, 
        unique : true,
         match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+/,
            "Please fill a valid email address"
        ]
    },
    mobile : { 
        type : String, 
        required : true,
        validate: {
            validator: function(v) {
                return v.length === 10;
            },
            message: props => `${props.value} is not a valid 10-digit mobile number!`
        }
    },
    gender : { 
        type : String, 
        enum : ["male","female","others"]
    },
    dob : { 
        type : Date
    },
    age : { 
        type : Number , 
        min: [0, "Cannot be -ve"]
    },
    address : { 
        type : String
    },
    country : String,
    joining_code : { 
        type : String, 
        required : true
    },
    password : { 
        type : String, 
        required : true
    },
    userId : { 
        type : String, 
        required : true
    },
    joining_DatenTime : { 
        type : Date, 
        required : true
    },
    role:{
        type:String,
        enum:["admin","user"],
        default:"user"
    }

})

module.exports = mongoose.model('user',userSchema)

