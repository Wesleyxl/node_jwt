const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token_header = req.headers.auth;

  if (!token_header) {
    return res.status(401).json({ error: "Token is required" });
  }

  jwt.verify(token_header, "jsonwebtoken", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Token is invalid" });
    }

    res.locals.auth_data = decoded;

    return next();
  });
};

module.exports = auth;
