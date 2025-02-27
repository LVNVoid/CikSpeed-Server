const express = require("express");
const {
  createReservation,
  verifyReservation,
  getCustomerReservation,
  checkAvailableSlots,
  getAllReservations,
  getHistoryReservations,
} = require("../controllers/reservationController");
const authenticate = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const router = express.Router();

// Buat reservasi (customer)
router.post("/", authenticate, createReservation);

// Verifikasi reservasi (frontdesk)
router.put(
  "/:id/verify",
  authenticate,
  authorize(["frontdesk", "admin"]),
  verifyReservation
);

// Semua Riwayat reservasi (customer)
router.get("/history", authenticate, getHistoryReservations);

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

module.exports = router;
