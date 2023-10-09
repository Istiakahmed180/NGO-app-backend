const express = require("express");
const Send = express.Router();
const SendModel = require("../Scemma/sendSchema");

Send.get("/root", (req, res) => {
  res.send({ message: "Send History Route Is Running" });
});

Send.get("/all-send-history", async (req, res) => {
  try {
    const getAllSendHistory = await SendModel.find().sort({
      _id: -1,
    });
    res.status(200).json({
      message: "Get Sending History Data Complete",
      data: getAllSendHistory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Side Error" });
  }
});

Send.get("/get-user-send-history", async (req, res) => {
  try {
    const userEmail = req.query.email;

    const getUserSendData = await SendModel.find({ email: userEmail }).sort({
      _id: -1,
    });
    res.status(200).json({ data: getUserSendData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Side Error" });
  }
});

Send.post("/add-send-history", async (req, res) => {
  try {
    const {
      name,
      recevierName,
      email,
      receiverEmail,
      image,
      receiverImage,
      totalBalance,
      currentBalance,
      sendAmount,
    } = req.body;

    const sendingData = new SendModel({
      name,
      recevierName,
      email,
      receiverEmail,
      image,
      receiverImage,
      totalBalance,
      currentBalance,
      sendAmount,
    });

    await sendingData.save();

    res
      .status(200)
      .json({ message: "Sending Data Save To Database", sendingData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Side Error" });
  }
});

Send.delete("/delete-send-history/:id", async (req, res) => {
  try {
    const senderID = req.params.id;

    const senderHistoryDelete = await SendModel.findByIdAndDelete(senderID);
    if (!senderHistoryDelete) {
      return res.status(404).json({ message: "Sending Data Not Available" });
    }

    res.status(200).json({ message: "Sending Data Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Side Error" });
  }
});

module.exports = Send;
