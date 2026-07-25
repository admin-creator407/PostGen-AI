const mongoose = require('mongoose');

// Do not silently queue database operations while MongoDB is unreachable.
// Queued operations make endpoints such as login appear to hang.
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn('MONGO_URI environment variable is not defined. Database functionality will fail.');
    return;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
