const { default: mongoose } = require("mongoose");

const ProfitSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  vat: {
    type: Number,
  },
  date: {
    type: Date,
    default: new Date(),
  },
});

const ProfitModel = mongoose.model("profit", ProfitSchema);

module.exports = ProfitModel;
