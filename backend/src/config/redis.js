const Redis = require("ioredis");

let redisClient = null;

if (process.env.REDIS_URL) {
  redisClient = new Redis(process.env.REDIS_URL, {
    // Redis is an optional performance layer. Never make user requests wait
    // for an unavailable Redis server (especially during local development).
    connectTimeout: 2000,
    enableOfflineQueue: false,
    maxRetriesPerRequest: 1,
    retryStrategy: () => null,
  });

  redisClient.on("connect", () => {
    console.log("Redis connected successfully");
  });

  redisClient.on("error", (err) => {
    console.warn(`Redis unavailable; caching and rate limiting are disabled (${err.message}).`);
  });

  redisClient.on("end", () => {
    console.warn("Redis connection closed; continuing without cache and rate limiting.");
  });
} else {
  console.log(
    " REDIS_URL not configured. Redis caching and rate limiting will be disabled.",
  );
}

module.exports = redisClient;
