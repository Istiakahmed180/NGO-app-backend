const { default: mongoose } = require("mongoose");

const SendHistorySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  recevierName: {
    type: String,
  },
  email: {
    type: String,
  },
  receiverEmail: {
    type: String,
  },
  image: {
    type: String,
  },
  receiverImage: {
    type: String,
  },
  totalBalance: {
    type: Number,
  },
  currentBalance: {
    type: Number,
  },
  sendAmount: {
    type: Number,
  },
  sendingDateAndTime: {
    type: Date,
    default: new Date(),
  },
});

const SendModel = mongoose.model("sendHistory", SendHistorySchema);

module.exports = SendModel;
