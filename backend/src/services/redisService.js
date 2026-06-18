const redisClient = require('../config/redis');

/**
 * Get cached data from Redis.
 * @param {string} key 
 * @returns {Promise<any|null>}
 */
const getCache = async (key) => {
  if (!redisClient) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Redis get error:', error.message);
    return null;
  }
};

/**
 * Set data in Redis cache with an expiration time.
 * @param {string} key 
 * @param {any} value 
 * @param {number} ttlInSeconds - default 3600 (1 hour)
 */
const setCache = async (key, value, ttlInSeconds = 3600) => {
  if (!redisClient) return;
  try {
    const stringData = JSON.stringify(value);
    await redisClient.setex(key, ttlInSeconds, stringData);
  } catch (error) {
    console.error('Redis set error:', error.message);
  }
};

module.exports = {
  getCache,
  setCache,
};
