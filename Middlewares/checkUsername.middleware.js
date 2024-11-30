const { BloomFilter } = require("../Utils/bloom-filter");
require('dotenv').config()


const checkUsername = async (req, res, next) => {
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
    next();
   }
   catch(err){
    return res.status(500).json({ message: "Error checking username", error:err });

   }
    
}

module.exports = { checkUsername };