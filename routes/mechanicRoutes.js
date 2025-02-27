const express = require("express");
const {
  createMechanic,
  getAllMechanics,
  deleteMechanic,
  updateMechanic,
} = require("../controllers/mechanicController");
const authenticate = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const router = express.Router();

// Tambah mekanik (hanya admin)
router.post("/", authenticate, authorize(["admin"]), createMechanic);

// Daftar mekanik (semua pengguna)
router.get("/", getAllMechanics);

// Update mekanik (hanya admin)
router.put("/:id", authenticate, authorize(["admin"]), updateMechanic);

// Hapus mekanik (hanya admin)
router.delete("/:id", authenticate, authorize(["admin"]), deleteMechanic);

module.exports = router;
