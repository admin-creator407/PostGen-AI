require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const connectDB = require("./src/config/db");

const app = express();

// connection mongo
connectDB();

app.use(morgan("dev"));

app.use(
  cors({
    origin: [
      "http://localhost",
      "http://localhost:5173",
      "https://post-gen-ai-beta.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// app.options("*", cors());
app.use(express.json({ limit: "50kb" })); //setting limit
// app.use(cors());

app.get("/api/health", (req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;
  res.status(databaseConnected ? 200 : 503).json({
    status: databaseConnected ? "ok" : "degraded",
    message: databaseConnected
      ? "Server and database are running!"
      : "Server is running but MongoDB is unavailable.",
  });
});

const rateLimiter = require("./src/middleware/rateLimiter");

// Return a useful response immediately rather than allowing Mongoose to hold
// requests open while a database connection is unavailable.
app.use("/api", (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message:
        "Database is unavailable. Check the MongoDB connection and try again.",
    });
  }
  next();
});

// Apply rate limiting globally to all API routes
app.use("/api", rateLimiter);

//API Routes
app.use("/auth", require("./src/routes/auth"));
app.use("/posts", require("./src/routes/posts"));

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
