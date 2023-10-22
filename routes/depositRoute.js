const express = require("express");
const Deposit = express.Router();
const DepositModel = require("../Scemma/depositSchema");
const UserModel = require("../Scemma/userInfo");
const moment = require("moment/moment");
const cron = require("node-cron");

cron.schedule("*/1 * * *", async () => {
  try {
    const currentDate = moment();
    const depositsToUpdate = await DepositModel.find({
      withdrawDate: { $gt: currentDate },
      amount: { $gt: 0 },
    });

    await Promise.all(
      depositsToUpdate.map(async (deposit) => {
        const daysDifference =
          moment(deposit.withdrawDate).diff(currentDate, "days") + 1;

        const dailyIncrement = deposit.amount / daysDifference;

        if (deposit.dailyIncrement) {
          deposit.amount += deposit.dailyIncrement;
        } else {
          deposit.dailyIncrement = dailyIncrement.toFixed(2);
          deposit.amount += deposit.dailyIncrement.toFixed(2);
        }

        await deposit.save();
      })
    );

    console.log("Deposits updated successfully.");
  } catch (error) {
    console.error("Error updating deposits:", error);
  }
});

Deposit.get("/root", (req, res) => {
  res.send({ message: "Deposit Route Is Running" });
});

Deposit.get("/get-deposit-transaction", async (req, res) => {
  try {
    const userEmail = req.query.email;

    const userData = await DepositModel.find({ email: userEmail }).sort({
      _id: -1,
    });
    if (!userData) {
      return res.status(404).json({ message: "User Not Found", type: false });
    }
    res
      .status(200)
      .json({ message: "Deposit Data Complete", data: userData, type: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Side Error" });
  }
});

Deposit.post("/add-deposit-transaction", async (req, res) => {
  try {
    const { name, email, image, phone, address, gender, amount, bio } =
      req.body;

    const existingUser = await UserModel.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (existingUser.currentBalance <= 0) {
      return res.json({
        message: "Your Investment Current Balance Zero",
        type: false,
      });
    }

    if (existingUser.currentBalance < amount) {
      return res.json({
        message: "Insufficient Balance",
        type: false,
      });
    }
    const currentDate = moment();
    const withdrawDate = moment(currentDate).add(15, "months");

    existingUser.currentBalance -= amount;

    const userData = new DepositModel({
      name,
      email,
      image,
      phone,
      address,
      gender,
      amount,
      bio,
      withdrawDate: withdrawDate,
    });

    const depositData = await userData.save();
    await existingUser.save();

    res.status(200).json({
      message: "Deposit Amount Successful",
      data: depositData,
      type: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Side Error" });
  }
});

Deposit.put("/withdraw-deposit-money", async (req, res) => {
  try {
    const depositID = req.query.id;

    const deposit = await DepositModel.findById(depositID);

    if (!deposit) {
      return res
        .status(404)
        .json({ message: "Deposit Data Not Found", type: false });
    }
    if (deposit.amount === 0) {
      return res.json({
        message: `${deposit.depositAmount} amount is withdraw complete`,
      });
    }

    deposit.depositAmount = deposit.amount;

    deposit.amount = 0;

    const updatedDeposit = await deposit.save();

    res.status(200).json({
      message: "Withdraw Deposit Money Successful",
      data: updatedDeposit,
      type: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Side Error" });
  }
});

module.exports = Deposit;
