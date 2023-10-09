const express = require("express");
const Received = express.Router();
const ReceivedModel = require("../Scemma/receivedSchema");

Received.get("/root", (req, res) => {
  res.send({ message: "Received Route Is Running" });
});

Received.get("/all-receive-data", async (req, res) => {
  try {
    const receiveAllData = await ReceivedModel.find().sort({ _id: -1 });
    res.status(200).json({
      message: "Get All Receiveing History Data Successful",
      data: receiveAllData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Side Error" });
  }
});

Received.get("/get-user-receive-history", async (req, res) => {
  try {
    const userEmail = req.query.email;

    const getUserRecevingData = await ReceivedModel.find({
      email: userEmail,
    }).sort({ _id: -1 });

    if (!getUserRecevingData) {
      return res.status(404).json({ message: "User Receiving Data Not Found" });
    }

    res.status(200).json({
      message: "User Receiving Data Found Successfully",
      data: getUserRecevingData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Side Error" });
  }
});

Received.post("/add-receive-data", async (req, res) => {
  try {
    const {
      name,
      senderName,
      email,
      senderEmail,
      image,
      senderImage,
      totalBalance,
      currentBalance,
      receiveAmount,
    } = req.body;

    const receivingData = new ReceivedModel({
      name,
      senderName,
      email,
      senderEmail,
      image,
      senderImage,
      totalBalance,
      currentBalance,
      receiveAmount,
    });

    await receivingData.save();

    res
      .status(200)
      .json({ message: "Receiving Data Send To Database", receivingData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Side Error" });
  }
});

Received.delete("/delete-receive-data/:id", async (req, res) => {
  try {
    const clientID = req.params.id;

    const deleteReceivingData = await ReceivedModel.findByIdAndDelete(clientID);
    if (!deleteReceivingData) {
      return res.status(404).json({ message: "Receiving Data Not Available" });
    }
    res.status(200).json({ message: "Receiving Data Deleted Successfull" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Side Error" });
  }
});

module.exports = Received;
