const { Symptom } = require("../models");

// Daftar gejala
const getSymptoms = async (req, res) => {
  try {
    const symptoms = await Symptom.findAll();
    const total = await Symptom.count();
    res.json({
      total: total,
      data: symptoms,
    });
  } catch (error) {
    res.status(400).json({ error: "Gagal mengambil data gejala" });
  }
};

// Tambah gejala
const addSymptom = async (req, res) => {
  try {
    const { name, serviceType } = req.body;
    const symptom = await Symptom.create({ name, serviceType });
    res.status(201).json(symptom);
  } catch (error) {
    res.status(400).json({ error: "Gagal menambahkan gejala" });
  }
};

// Hapus gejala
const deleteSymptom = async (req, res) => {
  try {
    const { id } = req.params;
    await Symptom.destroy({ where: { id } });
    res.status(200).json({ message: "Gejala berhasil dihapus" });
  } catch (error) {
    res.status(400).json({ error: "Gagal menghapus gejala" });
  }
};

const updateSymptom = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, serviceType } = req.body;
    const symptom = await Symptom.findByPk(id);
    if (!symptom) {
      return res.status(404).json({ error: "Gejala tidak ditemukan" });
    }
    symptom.name = name;
    symptom.serviceType = serviceType;
    await symptom.save();
    res.status(200).json(symptom);
  } catch (error) {
    res.status(400).json({ error: "Gagal memperbarui gejala" });
  }
};

module.exports = { getSymptoms, addSymptom, deleteSymptom, updateSymptom };
