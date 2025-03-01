const express = require("express");
const {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  getAllUsers,
} = require("../controllers/authController");
const router = express.Router();

// Registrasi
router.post("/register", register);

// Login
router.post("/login", login);

// Logout
router.post("/logout", logout);

// GET Current User
router.get("/me", getCurrentUser);

// GET All User
router.get("/users", getAllUsers);

// Update Profile
router.put("/profile", updateProfile);

module.exports = router;
