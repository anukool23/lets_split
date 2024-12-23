const { BloomFilter } = require("../Utils/bloom-filter");
require('dotenv').config()


const validateUsername = async (req, res, next) => {
    const value = req.body.userId;
    if (!value) {
        return res.status(400).json({ message: "Username is required" });
    }
   const bloom = new BloomFilter(process.env.BLOOM_BIT_SIZE, process.env.BLOOM_HASHCOUNT);
    //const bloom = new BloomFilter(1000, 10);
   try{
    const exist = await bloom.alreadyExist(value); 
    if(exist){
        return res.status(403).json({ message: "Username already exists" });
    }   
    await bloom.add(value);
    next()
   }
   catch(err){
    console.log(err)
    return res.status(500).json({ message: "Error checking username", error:err });

   }
    
}

module.exports = { validateUsername };