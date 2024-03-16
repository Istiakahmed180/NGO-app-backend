const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  image: String,
  totalBalance: Number,
  currentBalance: Number,
  withdrawalBalance: Number,
  role: String,
  reference: String,
  phone: String,
  gender: String,
  address: String,
  bio: String,
  sendAmount: Number,
  receiveAmount: Number,
  adminProfit: Number,
  date: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
