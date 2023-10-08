const { default: mongoose } = require("mongoose");

const WithdrawSchema = new mongoose.Schema({
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
  deductionPercentAmount: {
    type: Number,
  },
  withdrawAmount: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  withdrawDate: {
    type: Date,
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

const WithdrawModel = mongoose.model("withdrawrequest", WithdrawSchema);

module.exports = WithdrawModel;
