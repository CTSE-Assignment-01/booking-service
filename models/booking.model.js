const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  passengerFirstName: {
    type: String,
    required: true,
  },
  passengerLastName: {
    type: String,
    required: true,
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other"],
  },
  nicOrPassport: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  trainDetails: {
    trainId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Train",
      required: true,
    },
    departureDate: {
      type: Date,
      required: true,
    },
    departureTime: {
      type: String,
      required: true,
    },
  },
  tickets: {
    adults: {
      type: Number,
      required: true,
    },
    children: {
      type: Number,
      default: 0,
    },
    infants: {
      type: Number,
      default: 0,
    },
  },
  totalPrice: {
    type: Number,
    required: true,
  },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
