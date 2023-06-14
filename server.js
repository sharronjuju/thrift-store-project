const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();
require("./config/passport");
const authRoute = require("./routes").auth;
const productRoute = require("./routes").product;
const orderRoute = require("./routes").order;
const Product = require("./models").product;
const cors = require("cors");
const path = require("path");
const port = process.env.PORT || 8080;

//連結到mongodb
mongoose
  .connect(process.env.MONGODB_CONNECTION)
  .then(() => {
    console.log("連結到mongodb...");
  })
  .catch((e) => {
    console.log(e);
  });

//middlewears
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "https://thrift-store.herokuapp.com",
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
app.use(express.static(path.join(__dirname, "client", "build")));

//middlewears for google oauth20
app.use(passport.initialize());
app.use(passport.session());

//routes
app.use("/api/user", authRoute);
app.use("/api/product", productRoute);
app.use("/api/order", orderRoute);

if (
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "staging"
) {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

app.listen(port, () => {
  console.log("後端伺服器聆聽在port...");
});
