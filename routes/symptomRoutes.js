const express = require("express");
const { getSymptoms } = require("../controllers/symptomController");
const router = express.Router();

// Daftar gejala
router.get("/", getSymptoms);

module.exports = router;
