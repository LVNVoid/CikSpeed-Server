const { Reservation, Symptom, Vehicle, User } = require("../models");

// Buat reservasi (customer)
const createReservation = async (req, res) => {
  const {
    date,
    time,
    symptomIds,
    description,
    vehicleId,
    otherSymptomDescription,
  } = req.body;

  try {
    // Ambil data user yang sedang login
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Vehicle }],
    });

    if (!user) {
      return res.status(404).json({ error: "User tidak ditemukan" });
    }

    // Periksa apakah user memiliki kendaraan
    if (!user.Vehicles || user.Vehicles.length === 0) {
      return res.status(400).json({ error: "User tidak memiliki kendaraan" });
    }

    // Tentukan jenis servis berdasarkan gejala atau deskripsi gejala lain
    let serviceType = "regular";
    let symptoms = [];

    if (symptomIds && symptomIds.length > 0) {
      symptoms = await Symptom.findAll({ where: { id: symptomIds } });
      serviceType = symptoms.some((s) => s.serviceType === "major")
        ? "major"
        : "regular";
    } else if (otherSymptomDescription) {
      serviceType = "regular";
    }

    // Ambil semua reservasi pada tanggal dan slot waktu yang relevan (untuk servis besar)
    if (time) {
      const timesToCheck =
        serviceType === "major" ? [time, getNextTime(time)] : [time];
      const reservations = await Reservation.findAll({
        where: { date, time: timesToCheck },
      });

      if (reservations.length >= 2) {
        return res.status(400).json({ error: "Slot waktu tidak tersedia" });
      }
    }

    // Buat reservasi dengan kendaraan yang dipilih
    const reservation = await Reservation.create({
      date,
      time,
      serviceType,
      status: "pending",
      description,
      otherSymptomDescription,
      userId: req.user.id, // Perbaikan di sini
      vehicleId,
    });

    // Hubungkan reservasi dengan gejala yang dipilih
    if (symptomIds && symptomIds.length > 0) {
      await reservation.addSymptoms(symptoms);
    }

    // Kirim respons dengan data reservasi dan gejala yang dipilih
    const reservationWithSymptoms = await Reservation.findByPk(reservation.id, {
      include: [
        { model: Symptom, through: { attributes: [] } },
        { model: Vehicle },
      ],
    });

    res.status(201).json(reservationWithSymptoms);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Gagal membuat reservasi", details: error.message });
  }
};
const getHistoryReservations = async (req, res) => {
  const userId = req.user.id;
  try {
    const historyReservations = await Reservation.findAll({
      where: {
        userId: userId,
        status: ["success", "failed"],
      },
      include: [
        { model: Vehicle, paranoid: false }, // Sertakan data kendaraan
        { model: User }, // Sertakan data pengguna
        { model: Symptom, through: { attributes: [] } }, // Sertakan data gejala
      ],
      order: [["createdAt", "DESC"]], // Urutkan dari yang terbaru
    });

    if (!historyReservations.length) {
      return res
        .status(404)
        .json({ error: "Tidak ada riwayat reservasi ditemukan" });
    }

    res.json(historyReservations);
  } catch (error) {
    res.status(400).json({
      error: "Gagal mengambil data riwayat reservasi",
      details: error.message,
    });
  }
};

// Verifikasi reservasi (frontdesk)
const verifyReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation)
      return res.status(404).json({ error: "Reservasi tidak ditemukan" });

    reservation.status = req.body.status;
    await reservation.save();
    res.json(reservation);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Gagal memverifikasi reservasi", details: error.message });
  }
};

// Daftar reservasi (customer)
const getCustomerReservation = async (req, res) => {
  try {
    const userId = req.user.id;

    const latestReservation = await Reservation.findOne({
      where: {
        userId: userId,
        status: ["pending", "confirmed", "canceled"],
      },
      include: [
        { model: Vehicle, paranoid: false },
        { model: User },
        { model: Symptom, through: { attributes: [] } },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!latestReservation) {
      return res.status(404).json({
        success: false,
        message: "Tidak ada data reservasi yang ditemukan untuk pengguna ini.",
      });
    }

    res.status(200).json({
      success: true,
      data: latestReservation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Gagal mengambil data reservasi",
      details: error.message,
    });
  }
};
// Dapatkan semua reservasi (admin/frontdesk)
const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      include: [
        { model: Vehicle, paranoid: false }, // Sertakan data kendaraan
        { model: User }, // Sertakan data pengguna
        { model: Symptom, through: { attributes: [] } }, // Sertakan data gejala
      ],
      order: [
        ["date", "ASC"],
        ["time", "ASC"],
      ],
    });
    res.json(reservations);
  } catch (error) {
    res.status(400).json({
      error: "Gagal mengambil data semua reservasi",
      details: error.message,
    });
  }
};

// Memeriksa slot waktu yang tersedia
const checkAvailableSlots = async (req, res) => {
  const { date, serviceType } = req.query;

  try {
    // Ambil semua reservasi pada tanggal yang dipilih
    const reservations = await Reservation.findAll({
      where: { date },
      attributes: ["time", "serviceType"],
    });

    // Tentukan jam operasional
    const operatingHours = [
      "09:00",
      "10:00",
      "11:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
    ];

    // Hitung jumlah reservasi per slot waktu dengan reduce
    const slotCounts = reservations.reduce((acc, { time, serviceType }) => {
      acc[time] = (acc[time] || 0) + 1;
      if (serviceType === "major")
        acc[getNextTime(time)] = (acc[getNextTime(time)] || 0) + 1;
      return acc;
    }, {});

    // Filter slot waktu yang tersedia
    const availableSlots = operatingHours.filter((slot, i) => {
      if (serviceType === "major") {
        const nextSlot = operatingHours[i + 1];
        return (slotCounts[slot] || 0) < 2 && (slotCounts[nextSlot] || 0) < 2;
      }
      return (slotCounts[slot] || 0) < 2;
    });

    res.json(availableSlots);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Gagal memeriksa slot waktu", details: error.message });
  }
};

// Fungsi bantu untuk mendapatkan waktu berikutnya dalam format HH:MM
const getNextTime = (time) => {
  const nextTime = new Date(`1970-01-01T${time}:00`);
  nextTime.setHours(nextTime.getHours() + 1);
  return nextTime.toTimeString().slice(0, 5); // Format HH:MM
};

module.exports = {
  createReservation,
  verifyReservation,
  getCustomerReservation,
  checkAvailableSlots,
  getAllReservations,
  getHistoryReservations,
};
