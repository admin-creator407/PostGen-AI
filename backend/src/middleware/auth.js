const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    // Get token from Authorization header (Bearer <token>)
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "No authentication token, authorization denied." });
    }

    const token = authHeader.split(" ")[1];

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user info (id, email) to the request object
    req.user = decoded;
    next();
  } catch (error) {
    res
      .status(401)
      .json({
        message: "Token is invalid or has expired, authorization denied.",
      });
  }
};

module.exports = auth;
