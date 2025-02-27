const { Symptom } = require("../models");

// Daftar gejala
const getSymptoms = async (req, res) => {
  try {
    const symptoms = await Symptom.findAll();
    res.json(symptoms);
  } catch (error) {
    res.status(400).json({ error: "Gagal mengambil data gejala" });
  }
};

module.exports = { getSymptoms };
