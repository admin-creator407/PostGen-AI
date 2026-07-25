const redisClient = require('../config/redis');

/**
 * Get cached data from Redis.
 * @param {string} key 
 * @returns {Promise<any|null>}
 */
const getCache = async (key) => {
  if (!redisClient || redisClient.status !== 'ready') return null;
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
  if (!redisClient || redisClient.status !== 'ready') return;
  try {
    const stringData = JSON.stringify(value);
    await redisClient.setex(key, ttlInSeconds, stringData);
  } catch (error) {
    console.error('Redis set error:', error.message);
  }
};

/**
 * Delete cached data from Redis.
 * @param {string} key
 */
const deleteCache = async (key) => {
  if (!redisClient || redisClient.status !== 'ready') return;
  try {
    await redisClient.del(key);
  } catch (error) {
    console.error('Redis delete error:', error.message);
  }
};

module.exports = {
  getCache,
  setCache,
  deleteCache,
};
