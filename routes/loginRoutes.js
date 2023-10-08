const express = require("express");
const { default: mongoose } = require("mongoose");
const authenticaton = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../Scemma/userInfo");
const moment = require("moment/moment");

authenticaton.use(express.json());

authenticaton.get("/root", (req, res) => {
  res.send({ message: "Authentication Route Is Running" });
});

authenticaton.get("/recent-users", (req, res) => {
  try {
    User.find({ role: { $ne: "admin" } })
      .sort({ _id: -1 })
      .limit(10)
      .then((users) => {
        res.status(200).send({
          message: "Top 10 Recent Users Retrieved Successfully",
          data: users,
        });
      })
      .catch((error) => {
        console.log(error);
        res.send({ message: "Failed to Get Recent Users" });
      });
  } catch (error) {
    res.send({ message: "Custom Error" });
  }
});

authenticaton.get("/all-users", async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } });
    res.status(200).send({ message: "Get All Users Successfull", users });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

authenticaton.post("/register", async (req, res) => {
  try {
    const userinfo = req.body;
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      image,
      totalBalance,
      currentBalance,
      withdrawalBalance,
      reference,
    } = userinfo;
    const enryptedpass = await bcrypt.hash(password, 10);
    const alreayExist = await User.findOne({ email: email });
    if (alreayExist) {
      res.send({ message: "User Is Already Exist" });
    } else {
      const user = new User({
        firstName,
        lastName,
        email,
        password: enryptedpass,
        image,
        totalBalance,
        currentBalance,
        withdrawalBalance,
        role,
        reference,
      });

      user.save((err) => {
        if (err) {
          res.send(err);
        } else {
          res.send({ message: "Register SuccessFull" });
        }
      });
    }
  } catch (e) {
    res.send({ message: "custome error" });
  }
});

authenticaton.post("/login", async (req, res) => {
  try {
    const userinfo = req.body;
    const { email, password } = userinfo;
    const validuser = await User.findOne({ email: email });
    const validPass = await bcrypt.compare(password, validuser.password);
    if (validuser) {
      if (validPass) {
        const token = jwt.sign(
          { email: validuser.email },
          `${process.env.JWT_SECRET}`
        );
        res.status(200).send({ message: "Login Successful", data: token });
      } else {
        res.send({ message: "password not Match" });
      }
    } else {
      res.send({ message: "user not Valid" });
    }
  } catch (e) {
    res.send({ message: "custome error" });
  }
});

authenticaton.post("/user-info", async (req, res) => {
  try {
    const { token } = req.body;
    const user = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = user.email;
    const userdata = await User.findOne({ email: userEmail });
    if (userdata) {
      res.status(200).send({ message: "successfull", data: userdata });
    } else {
      res.status(400).send({ message: "Not Valid User" });
    }
  } catch (e) {
    res.status(500).send({ message: "Server Error" });
  }
});

authenticaton.put("/upload-profile", async (req, res) => {
  try {
    const id = req.query.id;
    const { profile } = req.body;
    await User.updateOne(
      { _id: id },
      {
        $set: {
          porfilepic: profile,
        },
      },
      async (err, data) => {
        if (err) {
          res.send({ message: "update failed" });
        } else {
          const user = await User.findOne({ _id: id });
          res.send({ message: "update complete", data: user });
        }
      }
    );
  } catch (err) {}
});

authenticaton.put("/update-profile/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { firstName, lastName, email, image, phone, gender, address, bio } =
      req.body;
    const updateData = {
      firstName,
      lastName,
      email,
      image,
      phone,
      gender,
      address,
      bio,
    };
    const user = await User.findByIdAndUpdate(id, updateData, { new: true });
    if (user) {
      res.send({ message: "Update complete", data: user });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).send({ message: "Custom error" });
  }
});

authenticaton.delete("/delete-user/:id", (req, res) => {
  const clientID = req.params.id;
  User.findByIdAndDelete(clientID)
    .then(() => {
      res.json({ message: "User deleted successfully", success: true });
    })
    .catch((err) => {
      console.log(err);
      res.json({ message: "Failed to delete User" });
    });
});

module.exports = authenticaton;
