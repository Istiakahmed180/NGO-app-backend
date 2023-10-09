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

module.exports = Withdraw;
