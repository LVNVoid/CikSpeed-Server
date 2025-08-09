const { Reservation, Review } = require("../models");

const addReview = async (req, res) => {
  try {
    const { reservationId, rating, comment } = req.body;

    const reservation = await Reservation.findOne({
      where: { id: reservationId, status: "success" },
    });
    if (!reservation) {
      return res
        .status(400)
        .json({ message: "Reservasi belum selesai atau tidak ditemukan" });
    }

    const existing = await Review.findOne({ where: { reservationId } });
    if (existing) {
      return res.status(400).json({ message: "Review sudah pernah dibuat" });
    }

    const review = await Review.create({
      reservationId,
      rating,
      comment,
      userId: req.user.id,
    });
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getReviewByReservationId = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const review = await Review.findOne({ where: { reservationId } });
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addReview, getReviewByReservationId };
