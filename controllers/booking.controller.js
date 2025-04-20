const Booking = require("../models/booking.model");

const BookingController = {
  // Create a new booking
  createBooking: async (req, res) => {
    try {
      const newBooking = new Booking(req.body);
      const savedBooking = await newBooking.save();
      res.status(201).json(savedBooking);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Get all bookings
  getAllBookings: async (req, res) => {
    try {
      const bookings = await Booking.find().populate("bookedBy");
      res.status(200).json(bookings);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  // Get a single booking by id
  getBookingById: async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id).populate(
        "bookedBy trainDetails.trainId"
      );
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.status(200).json(booking);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  // Update a booking
  updateBooking: async (req, res) => {
    try {
      const updatedBooking = await Booking.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.status(200).json(updatedBooking);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete a booking
  deleteBooking: async (req, res) => {
    try {
      await Booking.findByIdAndDelete(req.params.id);
      res.status(204).json({ message: "Booking deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = BookingController;
