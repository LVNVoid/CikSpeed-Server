require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { generateToken } = require("../utils/jwt");

const register = async (req, res) => {
  try {
    const { name, phone, address, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      phone,
      address,
      password: hashedPassword,
      role: role || "customer",
    });
    res.status(201).json({ message: "Registrasi berhasil", user });
  } catch (error) {
    res.status(400).json({ error: "Registrasi gagal", details: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ where: { phone } });
    if (!user)
      return res.status(400).json({ error: "Nomor telepon tidak terdaftar" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ error: "Password salah" });

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: parseInt(process.env.COOKIE_MAX_AGE) || 3600000,
    });

    const { password: _, ...userWithoutPassword } = user.toJSON();
    res.json({ message: "Login berhasil", user: userWithoutPassword });
  } catch (error) {
    res.status(400).json({ error: "Login gagal", details: error.message });
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout berhasil" });
};

// Mendapatkan pengguna saat ini
const getCurrentUser = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token)
      return res
        .status(401)
        .json({ error: "Tidak ada token, autentikasi ditolak" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findOne({
      where: { id: decoded.id },
      attributes: { exclude: ["password"] },
    });

    if (!user)
      return res.status(404).json({ error: "Pengguna tidak ditemukan" });
    res.json({ user });
  } catch (error) {
    res.status(401).json({
      error:
        error.name === "TokenExpiredError"
          ? "Token telah kedaluwarsa, silakan login ulang."
          : "Token tidak valid",
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ["password"] } });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: "Gagal mendapatkan data pengguna" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, oldPassword, newPassword } = req.body;
    const token = req.cookies.token;
    if (!token)
      return res
        .status(401)
        .json({ error: "Tidak ada token, autentikasi ditolak" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findOne({ where: { id: decoded.id } });
    if (!user)
      return res.status(404).json({ error: "Pengguna tidak ditemukan" });

    // Validasi perubahan password
    if (newPassword) {
      if (!oldPassword || !(await bcrypt.compare(oldPassword, user.password))) {
        return res.status(400).json({ error: "Password lama salah" });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    await user.save();

    res.json({ message: "Profil berhasil diperbarui", user });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Gagal memperbarui profil", details: error.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  getAllUsers,
};
