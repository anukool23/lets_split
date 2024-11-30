const crypto = require("crypto");
const { redisClient } = require("../Config/redis");
require('dotenv').config()


class BloomFilter {
  constructor(size, hashCount) {
    this.size = size;
    this.hashCount = hashCount;
  }

  hash(value, seed) {
    const hash = crypto.createHash(process.env.BLOOM_CRYPTO_SECRET_KEY);
    hash.update(value + seed.toString());
    return parseInt(hash.digest("hex"), 16) % this.size;
  }

  async add(value) {
    for (let i = 0; i < this.hashCount; i++) {
      const index = this.hash(value, i);
      await redisClient.setBit(process.env.BLOOM_DB_KEY, index, 1);  // Set bit in Redis
    }
  }

  async alreadyExist(value) {
    for (let i = 0; i < this.hashCount; i++) {
      const index = this.hash(value, i);
      const bit = await redisClient.getBit(process.env.BLOOM_DB_KEY,index); 
      if (bit === 0) {
        return false;
      }
    }
    return true;
  }
}

module.exports = { BloomFilter };
