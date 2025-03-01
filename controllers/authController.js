require("dotenv").config(); // Load environment variables from .env file
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

// Registrasi pengguna
const register = async (req, res) => {
  const { name, phone, address, password, role } = req.body;

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat pengguna baru
    const user = await User.create({
      name,
      phone,
      address,
      password: hashedPassword,
      role: role || "customer",
    });

    res.status(201).json({ message: "Registrasi berhasil", user });
  } catch (error) {
    res.status(400).json({ error: "Registrasi gagal" });
  }
};

// Login pengguna
const login = async (req, res) => {
  const { phone, password } = req.body;

  try {
    // Cari pengguna berdasarkan nomor telepon
    const user = await User.findOne({ where: { phone } });
    if (!user) {
      return res.status(400).json({ error: "Nomor telepon tidak terdaftar" });
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Password salah" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    // Simpan token dalam cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: parseInt(process.env.COOKIE_MAX_AGE),
    });

    // Exclude password from response
    const { password: _, ...userWithoutPassword } = user.toJSON();

    res.json({ message: "Login berhasil", user: userWithoutPassword });
  } catch (error) {
    res.status(400).json({ error: "Login gagal" });
  }
};

// Logout pengguna
const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout berhasil" });
};

const getCurrentUser = async (req, res) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ error: "Tidak ada token, autentikasi ditolak" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Get user data
    const user = await User.findOne({
      where: { id: decoded.id },
      attributes: { exclude: ["password"] }, // Exclude password from response
    });

    if (!user) {
      return res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }

    res.json({ user });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Token tidak valid" });
    }
    res.status(500).json({ error: "Gagal mendapatkan data pengguna" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] }, // Exclude password from response
    });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: "Gagal mendapatkan data pengguna" });
  }
};

const updateProfile = async (req, res) => {
  const { name, phone, address, oldPassword, newPassword } = req.body;
  try {
    // Ambil token dari cookie dan decode
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ error: "Tidak ada token, autentikasi ditolak" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Pastikan pengguna hanya bisa mengedit profilenya sendiri
    if (decoded.id !== req.params.id) {
      return res
        .status(403)
        .json({ error: "Anda tidak diizinkan mengedit profil ini" });
    }

    // Temukan user berdasarkan ID
    const user = await User.findOne({ where: { id: decoded.id } });
    if (!user) {
      return res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }

    // Jika ingin mengubah password, verifikasi oldPassword terlebih dahulu
    if (newPassword) {
      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ error: "Password lama salah" });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    // Update data pengguna
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.address = address || user.address;

    await user.save();

    res.json({ message: "Profil berhasil diperbarui", user });
  } catch (error) {
    res.status(500).json({ error: "Gagal memperbarui profil" });
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
