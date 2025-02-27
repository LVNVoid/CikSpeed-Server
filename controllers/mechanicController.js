const { Mechanic } = require("../models");

// Create a new mechanic
const createMechanic = async (req, res) => {
  try {
    const { name, phoneNumber } = req.body;
    const mechanic = await Mechanic.create({ name, phoneNumber });
    res.status(201).json(mechanic);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all mechanics
const getAllMechanics = async (req, res) => {
  try {
    const mechanics = await Mechanic.findAll();
    res.json(mechanics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a mechanic
const deleteMechanic = async (req, res) => {
  try {
    const { id } = req.params;
    await Mechanic.destroy({ where: { id } });
    res.status(200).json({ message: "Mechanic deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a mechanic
const updateMechanic = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phoneNumber } = req.body;

    // Update data mekanik
    const [updatedRows] = await Mechanic.update(
      { name, phoneNumber },
      { where: { id } }
    );

    // Jika tidak ada baris yang di-update, kirim respons 404
    if (updatedRows === 0) {
      return res.status(404).json({ error: "Mechanic not found" });
    }

    // Ambil data mekanik yang telah di-update
    const updatedMechanic = await Mechanic.findOne({ where: { id } });

    // Kirim respons dengan data yang telah di-update
    res.status(200).json(updatedMechanic);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createMechanic,
  getAllMechanics,
  deleteMechanic,
  updateMechanic,
};
