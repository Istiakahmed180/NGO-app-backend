const express = require("express");
const { default: mongoose } = require("mongoose");
const adminRoute = express.Router();
require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../Scemma/userInfo");

adminRoute.get("/root", (req, res) => {
  res.send({ message: "Admin Route Is Running " });
});

// verify Admin Access
const verifyToken = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(403).send({ message: "UnAuthrize Access" });
    }
    if (authorization) {
      const token = authorization.split(" ")[1];
      const decoded = await jwt.verify(token, `${process.env.JWT_SECRET}`);
      const { email } = decoded;
      if (email === req.query.email) {
        next();
      } else {
        return res.status(403).send({ message: "UnAuthrize" });
      }
    }
  } catch (err) {
    return next("Privet Api");
  }
};

//  get single author posts

module.exports = adminRoute;
