const express = require("express");
const Deposit = express.Router();
const DepositModel = require("../Scemma/depositSchema");
const UserProfitModel = require("../Scemma/userProfitSchema");
const UserModel = require("../Scemma/userInfo");
const moment = require("moment/moment");
const cron = require("node-cron");

cron.schedule("0 0 * * *", async () => {
  try {
    const currentDate = moment();
    const depositsToUpdate = await DepositModel.find({
      withdrawDate: { $gt: currentDate },
      amount: { $gt: 0 },
    });

    for (const deposit of depositsToUpdate) {
      const daysDifference =
        moment(deposit.withdrawDate).diff(currentDate, "days") + 1;
      const dailyIncrement = deposit.clientDeposit / daysDifference;

      if (deposit.dailyIncrement) {
        deposit.amount += deposit.dailyIncrement;
        deposit.profit += deposit.dailyIncrement;
      } else {
        deposit.dailyIncrement = dailyIncrement;
        deposit.amount += deposit.dailyIncrement;
        deposit.profit += deposit.dailyIncrement;
      }

      await deposit.save();
    }

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
      return res.json({ message: "User Not Found", type: false });
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
    const { name, email, image, phone, address, gender, amount, bio, profit } =
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
    const withdrawDate = moment(currentDate).add(450, "days");
    const profitWithdrawDate = moment(currentDate).add(30, "days");

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
      profit,
      withdrawDate: withdrawDate,
      clientDeposit: amount,
      profitWithdrawDate: profitWithdrawDate,
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
    deposit.profitPercentAmount = deposit.depositAmount * 0.03;
    deposit.depositAmount =
      deposit.depositAmount - deposit.depositAmount * 0.03;
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

Deposit.put("/withdraw-profit-money", async (req, res) => {
  try {
    const profitID = req.query.id;
    const profitAmount = parseFloat(req.body.amount);

    const profit = await DepositModel.findById(profitID);

    if (!profit) {
      return res
        .status(404)
        .json({ message: "Profit Data Not Found", type: false });
    }

    if (profit.amount === 0) {
      return res.json({
        message: "Your deposit service has been terminated",
        type: false,
      });
    }

    if (profit.profit === 0) {
      return res.json({ message: "Your profit balance is zero", type: false });
    }

    if (profitAmount > profit.amount) {
      return res.status(400).json({
        message: "Withdrawal amount exceeds available profit",
        type: false,
      });
    }

    profit.profit -= profitAmount;
    profit.amount -= profitAmount;
    profit.profitWithdrawDate = moment().add(30, "days");

    await profit.save();

    const userProfitData = new UserProfitModel({
      name: profit?.name,
      email: profit?.email,
      withdrawDate: profit.profitWithdrawDate,
      clientDeposit: profit?.clientDeposit,
      totalProfitBalance: profit?.profit,
      deductionProfitAmount: profitAmount - profitAmount * 0.03,
      withdrawProfitAmount: profitAmount,
      profitPercentAmount: profitAmount * 0.03,
    });

    const profitData = await userProfitData.save();

    res.status(200).json({
      message: "Profit Withdraw successful",
      type: true,
      profit: profitData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Side Error" });
  }
});

module.exports = Deposit;
