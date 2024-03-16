const { default: mongoose } = require("mongoose");

const DepositSchema = new mongoose.Schema({
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
  withdrawDate: {
    type: Date,
  },
  depositAmount: {
    type: Number,
  },
  dailyIncrement: {
    type: Number,
  },
  clientDeposit: {
    type: Number,
  },
  profit: {
    type: Number,
  },
  profitWithdrawDate: {
    type: Date,
  },
  profitPercentAmount: {
    type: Number,
  },
});

const DepositModel = mongoose.model("depositTransaction", DepositSchema);

module.exports = DepositModel;
