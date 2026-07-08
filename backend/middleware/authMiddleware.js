const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ message: "No token provided. Please log in." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "medtrack_super_secret_key_change_this");
    req.userId = decoded.userId;
    req.role = decoded.role || "patient";
    next();
  } catch (err) {
    return res.status(401).json({ message: "Session expired or invalid token. Please log in again." });
  }
}

module.exports = authMiddleware;
