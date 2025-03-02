const authorize = (roles) => (req, res, next) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ error: "Autentikasi diperlukan sebelum otorisasi." });
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      error: `Akses ditolak. Anda memerlukan salah satu peran berikut: ${roles.join(
        ", "
      )}.`,
    });
  }

  next();
};

module.exports = authorize;
