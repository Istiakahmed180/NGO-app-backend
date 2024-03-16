const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();
const userAuth = require("./routes/loginRoutes");
const adminRoute = require("./routes/adminroute");
const Invest = require("./routes/investRoute");
const SendHistory = require("./routes/sendRoute");
const Received = require("./routes/receivedRoute");
const Deposit = require("./routes/depositRoute");
const Profit = require("./routes/profitRoute");
const Withdraw = require("./routes/withdrawRoute");
require("./Scemma/depositSchema");

// Middleware
app.use(cors());
app.use(express.json());

// Set the strictQuery option
mongoose.set("strictQuery", false);

// MongoDB connection
const mongoUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pwqsejd.mongodb.net/aiTreading?retryWrites=true&w=majority`;

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((e) => console.log(e));

// User authentication
app.use("/api/auth", userAuth);
app.use("/api/admin", adminRoute);
app.use("/api/invest", Invest);
app.use("/api/send", SendHistory);
app.use("/api/received", Received);
app.use("/api/withdraw", Withdraw);
app.use("/api/deposit", Deposit);
app.use("/api/profit", Profit);

// Testing
app.get("/api/root", (req, res) => {
  res.send({
    message: "HSD AI Server Is Running On Aws Update Version Is v(1.0.1)",
  });
});

app.listen(port, () => {
  console.log(`NGO Server Is Running On Port ${port}`);
});
