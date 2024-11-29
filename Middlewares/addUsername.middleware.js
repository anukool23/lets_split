// const crypto = require("crypto");  
// const redisClient = require("../Config/redis");

// const size = 1000; // Bloom filter size
// const hashCount = 3; // Number of hash functions

// const addUsername = async (req, res, next) => {
//     const value = req.body.userId;
//     if (!value) {
//         return res.status(400).json({ message: "Username is required" });
//     }
//     try{
//       console.log(1)
//         for(let i=0;i<hashCount;i++){
//           console.log(2)
//             const hash = crypto.createHash("md5");
//             hash.update(value + i.toString());
//             const index = parseInt(hash.digest("hex"), 16) % size;
//             await redisClient.setBit("checkUserNameWithBloom", index, 1);  
//             console.log(3)
//             return next(); 
//         }
//         return res.status(403).json({ message: "Username already exists" });

//     }
//     catch(err){
//         return res.status(500).json({ message: "Error checking username", error:err });
//     }
// }

// module.exports = { addUsername };



// const crypto = require("crypto");  
// const redisClient = require("../Config/redis");

// const size = 1000; // Bloom filter size
// const hashCount = 3; // Number of hash functions

// const addUsername = async (req, res, next) => {
//     const value = req.body.userId;
//     if (!value) {
//         return res.status(400).json({ message: "Username is required" });
//     }

//     try {
//         let exists = true; // Flag to track if username already exists
//         for (let i = 0; i < hashCount; i++) {
//             const hash = crypto.createHash("md5");
//             hash.update(value + i.toString());
//             const index = parseInt(hash.digest("hex"), 16) % size;
            
//             // Check if bit is already set (i.e., username might already exist)
//             // const bit = await redisClient.getBit("checkUserNameWithBloom", index);
//             // if (bit === 0) {
//             //     exists = false;  // This bit has not been set, so username might not exist
//             // }

//             // Set the bit for this hash
//             await redisClient.setBit("checkUserNameWithBloom", index, 1);
//         }

//         if (exists) {
//             return res.status(403).json({ message: "Username already exists" });
//         }

//         return next();  // Proceed with the next middleware if username doesn't exist
//     } catch (err) {
//         return res.status(500).json({ message: "Error checking username", error: err });
//     }
// }

// module.exports = { addUsername };



const crypto = require("crypto");  
const redisClient = require("../Config/redis");

const size = 1000; // Bloom filter size
const hashCount = 3; // Number of hash functions

const addUsername = async (req, res, next) => {
    const value = req.body.userId;
    if (!value) {
        return res.status(400).json({ message: "Username is required" });
    }

    try {
        let exists = true; // Flag to track if username already exists
        const checks = []; // To store promises

        // Loop to calculate hashes and set/get bits
        for (let i = 0; i < hashCount; i++) {
            const hash = crypto.createHash("md5");
            hash.update(value + i.toString());
            const index = parseInt(hash.digest("hex"), 16) % size;
            
            // Store the promise for checking the bit in Redis
            checks.push(redisClient.getBit("checkUserNameWithBloom", index));
            // Set the bit for this hash (asynchronously)
            redisClient.setBit("checkUserNameWithBloom", index, 1);
        }

        // Wait for all bit checks to finish
        const results = await Promise.all(checks);

        // Check if any bit was 0 (username may not exist)
        if (results.some(result => result === 0)) {
            exists = false;
        }

        // If all bits were set, the username exists
        if (exists) {
            return res.status(403).json({ message: "Username already exists" });
        }

        // Proceed to next middleware
        return next();  
    } catch (err) {
      console.log(err)
        return res.status(500).json({ message: "Error checking username", error: err });
    }
}

module.exports = { addUsername };
