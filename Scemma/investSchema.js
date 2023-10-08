const mongoose = require("mongoose");

const InvestInfoSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  image: {
    type: String,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  gender: {
    type: String,
  },
  amount: {
    type: Number,
  },
  bio: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  approvalStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  isAdminApproved: {
    type: Boolean,
    default: false,
  },
});

const InvestModel = mongoose.model("investRequest", InvestInfoSchema);

module.exports = InvestModel;
