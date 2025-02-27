const express = require("express");
const {
  getSymptoms,
  addSymptom,
  deleteSymptom,
  updateSymptom,
} = require("../controllers/symptomController");
const authenticate = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const router = express.Router();

// Daftar gejala
router.get("/", authenticate, getSymptoms);

// Tambah gejala
router.post("/", authenticate, authorize(["admin"]), addSymptom);

// Hapus gejala
router.delete("/:id", authenticate, authorize(["admin"]), deleteSymptom);

// Update gejala
router.put("/:id", authenticate, authorize(["admin"]), updateSymptom);

module.exports = router;
