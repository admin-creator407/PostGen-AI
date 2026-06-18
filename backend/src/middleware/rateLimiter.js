const redisClient = require("../config/redis");

// Custom redis rate limiter limits 10 req per minute
const rateLimiter = async (req, res, next) => {
  if (!redisClient) {
    // If Redis is not running or not configured, bypass rate limiting.
    return next();
  }

  try {
    const userId = req.user ? req.user.id : req.ip;
    const key = `ratelimit:${userId}`;

    const current = await redisClient.incr(key);

    if (current === 1) {
      await redisClient.expire(key, 60);
    }

    if (current > 10) {
      return res.status(429).json({
        message:
          "Too many requests. You are allowed a maximum of 10 generations per minute. Please try again later.",
      });
    }

    next();
  } catch (error) {
    console.error("Rate limiting error:", error.message);
    next();
  }
};

module.exports = rateLimiter;
