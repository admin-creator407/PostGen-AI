const Redis = require("ioredis");

let redisClient = null;

if (process.env.REDIS_URL) {
  redisClient = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
  });

  redisClient.on("connect", () => {
    console.log("Redis connected successfully");
  });

  redisClient.on("error", (err) => {
    console.error(" Redis connection error:", err.message);
  });
} else {
  console.log(
    " REDIS_URL not configured. Redis caching and rate limiting will be disabled.",
  );
}

module.exports = redisClient;
