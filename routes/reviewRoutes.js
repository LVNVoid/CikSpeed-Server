const express = require("express");
const {
  addReview,
  getReviewByReservationId,
} = require("../controllers/reviewController");
const authenticate = require("../middleware/auth");
const router = express.Router();

// Tambah review
router.post("/", authenticate, addReview);

// Lihat review berdasarkan Id Reservasi
router.get("/:reservationId", authenticate, getReviewByReservationId);

module.exports = router;
