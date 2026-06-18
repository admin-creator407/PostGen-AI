require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
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
      "http://127.0.0.1:5173",

      "https://postgen-ai-linkedin-post-generator.vercel.app",
      "https://postgen-ai-linkedin-post-generator-chxtiwlon.vercel.app",
      "https://postgen-ai-linkedin-post-ge-git-1dea55-admin-creator-s-projects.vercel.app",

      "https://postgen-ai.onrender.com",
    ],

    credentials: true,

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json({ limit: "50kb" })); //setting limit

//API Routes
app.use("/api/auth", require("./src/routes/auth"));
app.use("/api/posts", require("./src/routes/posts"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running!" });
});

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
