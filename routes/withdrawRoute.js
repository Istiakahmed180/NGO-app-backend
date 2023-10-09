const express = require("express");
const Withdraw = express.Router();
const WithdrawModel = require("../Scemma/withdrawShhema");
const UserModel = require("../Scemma/userInfo");
const InvestModel = require("../Scemma/investSchema");
const moment = require("moment");

Withdraw.get("/root", (req, res) => {
  res.send({ message: "Withdraw Route Is Running" });
});

Withdraw.get("/admin/withdraw-request", async (req, res) => {
  try {
    const pendingRequest = await WithdrawModel.find({
      approvalStatus: "pending",
    }).sort({ date: -1 });
    res.json({ data: pendingRequest });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Side Error" });
  }
});

Withdraw.get("/get-user-withdraw-history", async (req, res) => {
  try {
    const userEmail = req.query.email;

    const userWithdrawHistory = await WithdrawModel.find({
      email: userEmail,
      approvalStatus: "approved",
    }).sort({ _id: -1 });

    if (!userWithdrawHistory) {
      return res
        .status(404)
        .json({ message: "User Withdraw History Data Not Available" });
    }

    res.status(200).json({
      message: "User Withdraw HIstory Find Successfully",
      data: userWithdrawHistory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Side Error" });
  }
});

module.exports = Withdraw;
