const express = require("express");
const InvestModel = require("../Scemma/investSchema");
const UserModel = require("../Scemma/userInfo");
const Invest = express.Router();

Invest.get("/root", (req, res) => {
  res.send({ message: "Invest Route Is Running" });
});

// Updated all client API
Invest.get("/all-client", async (req, res) => {
  try {
    const allClient = await InvestModel.find({
      approvalStatus: "approved",
    }).sort({ date: -1 });

    res.json(allClient);
  } catch (error) {
    res.status(500).json({ message: "Server Side Error" });
  }
});

// Updated User invest request API
Invest.get("/get-user-investment-data", async (req, res) => {
  try {
    const userEmail = req.query.email;

    const getInvestmentData = await InvestModel.find({
      email: userEmail,
      // approvalStatus: "approved",
    }).sort({ _id: -1 });

    if (!getInvestmentData) {
      return res
        .status(404)
        .json({ message: "User Investment Data Not Available" });
    }

    res.status(200).json({
      message: "User Investment Data Find Complete",
      data: getInvestmentData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Side Error" });
  }
});

// Updated Client API
Invest.post("/add-client", async (req, res) => {
  try {
    const { name, email, phone, address, gender, bio, amount, image } =
      req.body;

    if (amount <= 0) {
      return res.json({
        message: "Invalid Investment amount",
        type: false,
      });
    }

    const newClient = new InvestModel({
      name,
      email,
      phone,
      address,
      gender,
      bio,
      amount,
      image,
      approvalStatus: "pending",
      isAdminApproved: false,
    });

    const savedClient = await newClient.save();
    res.json({
      message: "Client Amount Saved To Approval",
      savedClient,
      type: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Faind To Save Client" });
  }
});

Invest.delete("/admin/invest-request-delete/:id", (req, res) => {
  const investID = req.params.id;

  try {
    InvestModel.findByIdAndDelete(investID)
      .then((deletedInvest) => {
        if (!deletedInvest) {
          res.status(404).send({ message: "Invest Requested Data Not Found" });
        } else {
          res.status(200).send({ message: "Invest Requested Deleted" });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({ message: "Server Side Error" });
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Side Error" });
  }
});

// Updated Invest Request API
Invest.get("/admin/invest-request", async (req, res) => {
  try {
    const pendingData = await InvestModel.find({
      approvalStatus: "pending",
    }).sort({ date: -1 });
    res.json(pendingData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error Fetching Pending Data" });
  }
});

// Updated admin approval APi
Invest.put("/admin/approve/:id", async (req, res) => {
  const clientId = req.params.id;

  try {
    const invest = await InvestModel.findById(clientId);

    if (!invest) {
      res.status(404).json({ message: "Investment Not Found" });
    }

    invest.approvalStatus = "approved";
    const currentAmount = invest.amount;
    const totalAmount = invest.amount;

    const user = await UserModel.findOne({ email: invest.email });

    if (!user) {
      res.status(404).json({ message: "User Not Found" });
    }

    user.currentBalance += currentAmount;
    user.totalBalance += totalAmount;

    await user.save();
    await invest.save();

    return res
      .status(200)
      .json({ message: "Investment Approved Successfully", user, invest });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

Invest.delete("/delete-client/:id", (req, res) => {
  const clientID = req.params.id;

  InvestModel.findByIdAndDelete(clientID)
    .then(() => {
      res.json({ message: "Client deleted successfully", success: true });
    })
    .catch((err) => {
      console.log(err);
      res.json({ message: "Failed to delete client" });
    });
});

// Updated Transfer Amount API
Invest.post("/transfer-amount", async (req, res) => {
  const { senderEmail, recipientEmail, amount } = req.body;

  try {
    const sender = await UserModel.findOne({ email: senderEmail });
    const recipient = await UserModel.findOne({ email: recipientEmail });

    if (!sender) {
      return res.json({ message: "Sender Email Not Found", type: false });
    }

    if (!recipient) {
      return res.json({ message: "Recipient Email Not Found", type: false });
    }
    if (amount <= 0) {
      return res.json({
        message: "Invalid Sending amount",
        type: false,
      });
    }

    if (sender.currentBalance < amount) {
      return res.json({
        message: "Insufficient balance to transfer",
        type: false,
      });
    }

    sender.currentBalance -= amount;
    sender.sendAmount = amount;
    await sender.save();

    recipient.currentBalance += amount;
    recipient.totalBalance += amount;
    recipient.receiveAmount = amount;
    await recipient.save();

    res.json({
      message: "Amount transferred successfully",
      type: true,
      sender,
      recipient,
    });
  } catch (error) {
    console.log(error);
    res.json({ message: "Server Side Error" });
  }
});

module.exports = Invest;
