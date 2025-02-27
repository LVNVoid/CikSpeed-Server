const express = require("express");
const {
  addVehicle,
  getVehicles,
  getUserVehicles,
  deleteUserVehicle,
} = require("../controllers/vehicleController");
const authenticate = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const router = express.Router();

// Tambah kendaraan (hanya admin)
router.post("/", authenticate, addVehicle);

// Daftar kendaraan (semua pengguna)
router.get("/", getVehicles);

// Daftar kendaraan (hanya customer)
router.get("/user", authenticate, getUserVehicles);

// Hapus kendaraan yang dimiliki oleh user yang sedang login

router.delete("/:id", authenticate, deleteUserVehicle);

module.exports = router;
