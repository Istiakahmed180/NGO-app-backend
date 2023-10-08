const express = require("express");
const Withdraw = express.Router();
const WithdrawModel = require("../Scemma/withdrawShhema");
const UserModel = require("../Scemma/userInfo");
const InvestModel = require("../Scemma/investSchema");
const moment = require("moment");

Withdraw.get("/", (req, res) => {
  res.send("Withdraw Route Is Running");
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

Withdraw.get("/get-approve-withdraw-request", async (req, res) => {
  try {
    const getAllApproveWithdraw = await WithdrawModel.find({
      approvalStatus: "approved",
    }).sort({ date: -1 });

    res.status(200).json({
      message: "Appreoved Withdraw Request Data Get Complete",
      data: getAllApproveWithdraw,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Side Error" });
  }
});

Withdraw.post("/add-withdraw-request", async (req, res) => {
  try {
    const { name, email, phone, address, gender, bio, amount, image } =
      req.body;

    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const pendingWithdrawal = await WithdrawModel.findOne({
      email: email,
      approvalStatus: "pending",
    });

    if (pendingWithdrawal) {
      return res.json({
        message: "Withdrawal request is pending",
        type: false,
      });
    }

    if (amount <= 0) {
      return res.json({
        message: "Invalid withdrawal amount",
        type: false,
      });
    }

    if (user.currentBalance < amount) {
      return res.json({
        message: "Insufficient balance for withdrawal",
        type: false,
      });
    }

    const checkWithdrawDate = await WithdrawModel.findOne({
      email: email,
      approvalStatus: "approved",
      isAdminApproved: true,
    }).sort({ _id: -1 });

    if (checkWithdrawDate) {
      const currentDate = moment().format("DD-MM-YYYY");
      const withdrawalDate = moment(checkWithdrawDate.withdrawDate).format(
        "DD-MM-YYYY"
      );

      if (withdrawalDate > currentDate) {
        return res.json({
          message: `You can withdraw again after this date: (${withdrawalDate})`,
          type: false,
        });
      } else {
        checkWithdrawDate.withdrawDate = null;

        const addRequest = new WithdrawModel({
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

        await checkWithdrawDate.save();
        await addRequest.save();

        res.status(200).json({
          message: "Withdraw Request Saved for Approval",
          data: addRequest,
          type: true,
        });
      }
    } else {
      const addRequest = new WithdrawModel({
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
      await addRequest.save();
      res.status(200).json({
        message: "Withdraw Request Saved for Approval",
        data: addRequest,
        type: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Side Error" });
  }
});

Withdraw.put("/admin/approve/:id", async (req, res) => {
  try {
    const requestID = req.params.id;

    const withdraw = await WithdrawModel.findById(requestID);

    if (!withdraw) {
      return res.status(404).json({ message: "Withdraw Data Not Found" });
    }

    const user = await UserModel.findOne({ email: withdraw.email });

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    if (withdraw?.amount > user?.currentBalance) {
      return res.json({ message: "Insufficient Balance for Withdrawal" });
    }

    const currentAmount = withdraw.amount;

    user.currentBalance -= currentAmount;
    user.withdrawalBalance += currentAmount;

    const deductionAmount = withdraw.amount * 0.07;

    const currentDate = moment();
    const withdrawDate = moment(currentDate).add(1, "month");

    withdraw.approvalStatus = "approved";
    withdraw.isAdminApproved = true;
    withdraw.deductionPercentAmount = deductionAmount;
    withdraw.withdrawAmount = currentAmount;
    withdraw.amount -= deductionAmount;
    withdraw.withdrawDate = withdrawDate;

    await user.save();
    await withdraw.save();

    return res
      .status(200)
      .json({ message: "Withdraw Request Approved Success", user, withdraw });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Side Error" });
  }
});

Withdraw.delete("/delete-withdraw-approved-request/:id", async (req, res) => {
  try {
    const requestID = req.params.id;

    const deleteWithdrawApprovedRequest = await WithdrawModel.findByIdAndDelete(
      requestID
    );

    res.status(200).json({
      message: "Withdraw Approved Data Deleted",
      data: deleteWithdrawApprovedRequest,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Side Error" });
  }
});

module.exports = Withdraw;
