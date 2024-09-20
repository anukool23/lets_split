const mongoose = require("mongoose");
require('dotenv').config(); 

const atlasUri = process.env.MongoUri;

const connectToDb = () => {
   try{
      return mongoose.connect(atlasUri)
   }
   catch(e){
      console.log(`Error while connecting to Mongo Database ${e}`)
   }
};

module.exports = connectToDb;
