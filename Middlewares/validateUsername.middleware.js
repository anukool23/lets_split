const { BloomFilter } = require("../Utils/bloom-filter");


const validateUsername = async (req, res, next) => {
    const value = req.body.userId;
    if (!value) {
        return res.status(400).json({ message: "Username is required" });
    }
    const bloom = new BloomFilter(process.envBLOOM_BIT_SIZE, process.env.BLOOM_HASHCOUNT);
   try{
    const exist = await bloom.alreadyExist(value); 
    if(exist){
        return res.status(403).json({ message: "Username already exists" });
    }   
    await bloom.add(value);
    next()
   }
   catch(err){
    return res.status(500).json({ message: "Error checking username", error:err });

   }
    
}

module.exports = { validateUsername };