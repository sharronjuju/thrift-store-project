const express = require("express");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../models").user;
const registerValidation = require("../validation").registerValidation;
const managerRegisterValidation =
  require("../validation").managerRegisterValidation;
const loginValidation = require("../validation").loginValidation;

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use((req, res, next) => {
  console.log("auth route正在接受一個request...");
  next();
});

//middlewears
const authCheck = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.redirect("/user/login");
  }
};

//買家註冊
router.post("/register", async (req, res) => {
  //確認數據是否符合規範
  let { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //確認信箱是否被註冊過
  const emailExist = await User.findOne({ email: req.body.email }).exec();
  if (emailExist) return res.status(400).send("此信箱已經被註冊過。");

  //製作新用戶
  let { email, password } = req.body;
  let newUser = new User({ email, password });
  try {
    let savedUser = await newUser.save();
    return res.send({
      message: "使用者儲存成功!",
      savedUser,
    });
  } catch (e) {
    return res.status(500).send("無法儲存使用者...");
  }
});

//商家註冊
router.post("/manager/register", async (req, res) => {
  //確認數據是否符合規範
  let { error } = managerRegisterValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //確認信箱是否被註冊過
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("此信箱已經被註冊過。");

  //確認product key是否正確
  let productKey = req.body.productkey;
  const rightValue = await bcrypt.hash(process.env.PRODUCT_KEY, 10);
  let compareResult = await bcrypt.compare(productKey, rightValue);
  if (compareResult) {
    //製作新用戶
    let { email, password, productkey } = req.body;
    let newUser = new User({ email, password, productkey });
    try {
      let savedUser = await newUser.save();
      return res.send({
        message: "使用者儲存成功!",
        savedUser,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send("無法儲存使用者...");
    }
  } else {
    return res.status(400).send("授權碼錯誤");
  }
});

//登入
router.post("/login", (req, res, next) => {
  //確認數據是否符合規範
  let { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.send("No User Exists");
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send(req.user);
      });
    }
  })(req, res, next);
});

//透過google 登入
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  return res.redirect("https://thrift-store.herokuapp.com/loginFromGoogle");
});

//登出
router.get("/logout", (req, res) => {
  req.logOut((err) => {
    if (err) return res.send(err);
    return res.send("登出成功");
  });
});

//取得當前用戶資料
router.get("/", (req, res) => {
  return res.send(req.user);
});

//取得所有用戶
router.get("/all", authCheck, async (req, res) => {
  if (req.user.role == "manager") {
    try {
      let userFound = await User.find({}).exec();
      return res.send(userFound);
    } catch (e) {
      return res.status(500).send(e);
    }
  } else {
    return res.status(400).send("僅有管理者能操作此頁面");
  }
});

//刪除單一用戶
router.delete("/:_id", authCheck, async (req, res) => {
  if (req.user.role == "manager") {
    let { _id } = req.params;
    try {
      await User.deleteOne({ _id }).exec();
      return res.send("已被刪除");
    } catch (e) {
      return res.status(400).send("無法刪除");
    }
  } else {
    return res.status(400).send("僅有管理者能操作此頁面");
  }
});

module.exports = router;
