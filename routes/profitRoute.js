const express = require("express");
const Profit = express.Router();
const ProfitModel = require("../Scemma/profitSchema");
const WithdrawModel = require("../Scemma/withdrawShhema");
const moment = require("moment/moment");

Profit.get("/root", (req, res) => {
  res.send({ message: "Profit Route Is Running" });
});

Profit.get("/get-admin-profit", async (req, res) => {
  try {
    const adminProfit = await ProfitModel.find();
    if (adminProfit.length > 0) {
      return res
        .status(200)
        .json({ message: "Admin Profit Data Get Complete", data: adminProfit });
    } else {
      return res
        .status(200)
        .json({ message: "No Admin Profit Data Avialable" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Side Error" });
  }
});

Profit.post("/add-admin-profit", async (req, res) => {
  try {
    const { name, email, image, phone, address, gender, bio, vat } = req.body;

    const withdrawProfit = await WithdrawModel.findOne({ email });

    if (!withdrawProfit) {
      return res.status(404).json({ message: "Client Information Not Found" });
    }

    const existingAdminProfit = await ProfitModel.findOne({ email });

    if (existingAdminProfit) {
      existingAdminProfit.vat += vat;
      await existingAdminProfit.save();
      return res
        .status(200)
        .json({ message: "Admin Vat Updated Successfully" });
    } else {
      const currentVat = parseFloat(vat).toFixed(2);

      const adminProfit = new ProfitModel({
        name,
        email,
        image,
        phone,
        address,
        gender,
        bio,
        vat: currentVat,
      });

      await adminProfit.save();
      return res
        .status(201)
        .json({ message: "Admin Profit Added Successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Side Error" });
  }
});

Profit.get("/daily-admin-profit", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const currentWithdrawRequest = await WithdrawModel.find({
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
      approvalStatus: "approved",
      isAdminApproved: true,
    });

    res
      .status(200)
      .json({
        message: "Daily withdraw data get complete",
        data: currentWithdrawRequest,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Server side error ${error}` });
  }
});

module.exports = Profit;
