const { default: mongoose } = require("mongoose");

const UserProfitSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  withdrawDate: {
    type: Date,
  },
  clientDeposit: {
    type: Number,
  },
  totalProfitBalance: {
    type: Number,
  },
  deductionProfitAmount: {
    type: Number,
  },
  withdrawProfitAmount: {
    type: Number,
  },
  profitPercentAmount: {
    type: Number,
  },
});

const UserProfitModel = mongoose.model("userProfit", UserProfitSchema);

module.exports = UserProfitModel;
