const { Vehicle } = require("../models");

// Tambah kendaraan (Hanya customer)
const addVehicle = async (req, res) => {
  const { brand, type, productionYear } = req.body;

  try {
    const userId = req.user.id;

    const vehicle = await Vehicle.create({
      brand,
      type,
      productionYear,
      userId,
    });

    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ error: "Gagal menambahkan kendaraan" });
  }
};

// Data kendaraan yang dimiliki seluruh user
const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll();
    res.json(vehicles);
  } catch (error) {
    res.status(400).json({ error: "Gagal mengambil data kendaraan" });
  }
};

// Data kendaraan yang dimiliki oleh user yang sedang login
const getUserVehicles = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.id;

    console.log(req.user.id);

    const vehicles = await Vehicle.findAll({
      where: { userId },
    });

    res.status(200).json(vehicles);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ error: "Gagal mengambil data kendaraan" });
  }
};

const deleteUserVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Cari kendaraan berdasarkan ID dan pastikan kendaraan milik user yang sedang login
    const vehicle = await Vehicle.findOne({
      where: { id, userId },
    });

    if (!vehicle) {
      return res
        .status(404)
        .json({ error: "Kendaraan tidak ditemukan atau bukan milik Anda" });
    }

    await vehicle.destroy();

    res.status(200).json({ message: "Kendaraan berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    res.status(500).json({ error: "Gagal menghapus kendaraan" });
  }
};

module.exports = {
  addVehicle,
  getVehicles,
  getUserVehicles,
  deleteUserVehicle,
};
