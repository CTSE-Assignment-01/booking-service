const express = require("express");
const bookingController = require("../controllers/booking.controller");
const { protect } = require("../middlewares/auth.middlware");

const router = express.Router();

// Apply the auth middleware to all booking routes
router.use(protect);

// Booking routes (now protected with JWT authentication)
router.post("/", bookingController.createBooking); // Create a booking
router.get("/", bookingController.getAllBookings); // Get all bookings
router.get("/:id", bookingController.getBookingById); // Get a single booking by id
router.put("/:id", bookingController.updateBooking); // Update a booking
router.delete("/:id", bookingController.deleteBooking); // Delete a booking

module.exports = router;
