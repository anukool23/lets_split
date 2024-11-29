const redis = require("redis");

// Example of a Redis connection string (replace with actual credentials)
const connectionString =process.env.REDIS_URI

const redisClient = redis.createClient({
  url: connectionString,
});

redisClient.on("connect", () => {
  console.log("Connected to Redis using connection string");
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

// To start the connection
(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error("Failed to connect to Redis:", err);
  }
})();

module.exports = { redisClient };
