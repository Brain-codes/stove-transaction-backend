const jwt = require("jsonwebtoken");
const formatResponse = require("../utils/formatResponse");

// Middleware to protect routes
// Protect Routes Based on User Role
const protect = (role) => (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader)
    return res
      .status(401)
      .json(formatResponse(401, "No token, authorization denied"));

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Check if the user is the super admin (if role is 'superAdmin')
    if (role && req.user.role !== "superAdmin") {
      return res.status(403).json(formatResponse(403, "Access denied"));
    }

    // if (role && req.user.role !== role) {
    //   return res.status(403).json(formatResponse(403, "Access denied"));
    // }
    // 

    next();
  } catch (error) {
    res.status(401).json(formatResponse(401, "Token is not valid"));
  }
};

module.exports = protect;
