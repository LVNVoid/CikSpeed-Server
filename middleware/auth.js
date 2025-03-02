const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ error: "Akses ditolak. Token tidak ditemukan." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    switch (error.name) {
      case "TokenExpiredError":
        return res
          .status(401)
          .json({ error: "Token sudah kedaluwarsa. Silakan login kembali." });
      case "JsonWebTokenError":
        return res.status(401).json({ error: "Token tidak valid." });
      default:
        return res
          .status(500)
          .json({ error: "Terjadi kesalahan dalam autentikasi." });
    }
  }
};

module.exports = authenticate;
