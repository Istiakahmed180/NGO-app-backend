const express = require("express");
const Withdraw = express.Router();

Withdraw.get("/root", (req, res) => {
  res.send({ message: "Withdraw Route Is Running" });
});

module.exports = Withdraw;
