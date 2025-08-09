const express = require("express");
const {
  createReservation,
  getCustomerReservation,
  updateReservation,
  checkAvailableSlots,
  getAllReservations,
  getHistoryReservations,
  getAllHistoryReservations,
  getReservationById,
  deleteReservation,
  updateReservationStatus,
  getTodayReservations,
} = require("../controllers/reservationController");
const authenticate = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const router = express.Router();

// Buat reservasi (customer)
router.post("/", authenticate, createReservation);

// Verifikasi reservasi (frontdesk)
router.put(
  "/:id",
  authenticate,
  authorize(["frontdesk", "admin"]),
  updateReservation
);

// Mendapatkan data reservasi hari ini
router.get("/today", getTodayReservations);

//  Update status reservasi
router.put(
  "/status/:id",
  authenticate,
  authorize(["frontdesk", "admin"]),
  updateReservationStatus
);

router.delete("/:id", authenticate, deleteReservation);

// Semua Riwayat reservasi (customer)
router.get("/history/user", authenticate, getHistoryReservations);

// Semua riwayat reservasi (admin / frontdesk)
router.get(
  "/history",
  authenticate,
  authorize(["admin", "frontdesk"]),
  getAllHistoryReservations
);

// GET All Reservation (Admin / Frontdesk)
router.get(
  "/",
  authenticate,
  authorize(["admin", "frontdesk"]),
  getAllReservations
);

// Daftar reservasi (customer)
router.get("/my-reservations", authenticate, getCustomerReservation);

// Periksa slot waktu yang tersedia
router.get("/available-slots", (req, res) => {
  const { date, serviceType } = req.query;
  checkAvailableSlots(req, res);
});

// Get reservation by ID (admin / frontdesk)
router.get(
  "/:id",
  authenticate,
  authorize(["admin", "frontdesk"]),
  getReservationById
);

module.exports = router;
