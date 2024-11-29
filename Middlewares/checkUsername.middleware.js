const crypto = require("crypto");  
const redisClient = require("../Config/redis");

const size = 1000; // Bloom filter size
const hashCount = 3; // Number of hash functions

const checkUsername = async (req, res, next) => {
    const value = req.body.userId;
    if (!value) {
        return res.status(400).json({ message: "Username is required" });
    }
    try{
        for(let i=0;i<hashCount;i++){
            const hash = crypto.createHash("md5");
            hash.update(value + i.toString());
            const index = parseInt(hash.digest("hex"), 16) % size;
            const bit = await redisClient.getBit("checkUserNameWithBloom", index);
            if (bit === 0) {
                console.log("redis done")
                return next(); // Early return if the username doesn't exist in bloom filter
            } 
        }
        return res.status(403).json({ message: "Username already exists" });

    }
    catch(err){
        return res.status(500).json({ message: "Error checking username", error:err });
    }
}

module.exports = { checkUsername };