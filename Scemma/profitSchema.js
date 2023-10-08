const { default: mongoose } = require("mongoose");

const ProfitSchema = new mongoose.Schema({
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
  bio: {
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
