const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();
// const userAuth = require("./routes/loginRoutes");
// const adminRoute = require("./routes/adminroute");
// const Invest = require("./routes/investRoute");
// const SendHistory = require("./routes/sendRoute");
// const Received = require("./routes/receivedRoute");
// const Withdraw = require("./routes/withdrawRoute");
// const Deposit = require("./routes/depositRoute");
// const Profit = require("./routes/profitRoute");
// require("./Scemma/depositSchema");

// Middleware
app.use(cors());
app.use(express.json());

// Set the strictQuery option
// mongoose.set("strictQuery", false);

// MongoDB connection
// const mongoUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pwqsejd.mongodb.net/aiTreading?retryWrites=true&w=majority`;

// mongoose
//   .connect(mongoUrl, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("Connected to MongoDB");
//   })
//   .catch((e) => console.log(e));

// User authentication
// app.use("/auth", userAuth);
// app.use("/admin", adminRoute);
// app.use("/invest", Invest);
// app.use("/send", SendHistory);
// app.use("/received", Received);
// app.use("/withdraw", Withdraw);
// app.use("/deposit", Deposit);
// app.use("/profit", Profit);

// Testing
app.get("/api/root", (req, res) => {
  res.send("NGO Server Is Running");
});

app.listen(port, () => {
  console.log(`NGO Server Is Running On Port ${port}`);
});
