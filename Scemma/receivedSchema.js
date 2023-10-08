const { default: mongoose } = require("mongoose");

const ReceivedHistorySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  senderName: {
    type: String,
  },
  email: {
    type: String,
  },
  senderEmail: {
    type: String,
  },
  image: {
    type: String,
  },
  senderImage: {
    type: String,
  },
  totalBalance: {
    type: Number,
  },
  currentBalance: {
    type: Number,
  },
  receiveAmount: {
    type: Number,
  },
  receiveDateAndTime: {
    type: Date,
    default: new Date(),
  },
});

const ReceivedModel = mongoose.model("receivedHistory", ReceivedHistorySchema);

module.exports = ReceivedModel;
