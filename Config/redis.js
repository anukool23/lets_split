// const redis = require("redis");

// // Example of a Redis connection string (replace with actual credentials)
// const connectionString = "redis-cli -u redis://default:lzQueFE7WPqzkX0dETtLw0lAztzMT9nu@redis-10310.c305.ap-south-1-1.ec2.redns.redis-cloud.com:10310";

// const redisClient = redis.createClient({
//   url: connectionString,
// });

// redisClient.on("connect", () => {
//   console.log("Connected to Redis using connection string");
// });

// redisClient.on("error", (err) => {
//   console.error("Redis error:", err);
// });

// // To start the connection
// (async () => {
//   try {
//     await redisClient.connect();
//   } catch (err) {
//     console.error("Failed to connect to Redis:", err);
//   }
// })();

// module.exports = { redisClient };



const redis = require("redis");

// Example of a Redis connection string (replace with actual credentials)
const connectionString = "rediss://default:AVNS_ejNsfcZxmMyyXz6E9dO@redis-2d732d2f-aanukool-f912.e.aivencloud.com:18101";

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
