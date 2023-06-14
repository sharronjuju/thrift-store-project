const router = require("express").Router();
const Order = require("../models").order;
const orderValidation = require("../validation").orderValidation;

router.use((req, res, next) => {
  console.log("order route正在接受一個request...");
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

//透過產品id新增至購物車
router.post("/:_product_id", authCheck, async (req, res) => {
  if (req.user.role == "consumer") {
    let { _product_id } = req.params;
    try {
      let orderFound = await Order.findOne({
        user: req.user._id,
        progress: "pending",
      }).exec();
      if (orderFound) {
        orderFound.product.push(_product_id);
        let saveOrder = await orderFound.save();
        return res.send(saveOrder);
      } else {
        let newOrder = new Order({
          product: _product_id,
          user: req.user._id,
        });
        let saveOrder = await newOrder.save();
        return res.send(saveOrder);
      }
    } catch (e) {
      return res.status(400).send(e);
    }
  } else {
    return res.status(400).send("此功能僅提供一般會員");
  }
});

//取得購物車清單
router.get("/shoppingCart", authCheck, async (req, res) => {
  if (req.user.role == "consumer") {
    try {
      let orderFound = await Order.findOne({
        user: req.user._id,
        progress: "pending",
      })
        .populate("product", ["title", "size", "price", "file"])
        .exec();
      if (orderFound) {
        return res.send(orderFound);
      } else {
        return res.send("");
      }
    } catch (e) {
      return res.status(400).send(e);
    }
  } else {
    return res.status(400).send("此功能僅提供一般會員");
  }
});

//購物車結帳
router.patch("/checkout", authCheck, async (req, res) => {
  if (req.user.role == "consumer") {
    //驗證數據符合規範
    let { error } = orderValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    //確認訂單存在
    let orderFound = await Order.findOne({
      user: req.user._id,
      progress: "pending",
    }).exec();
    if (orderFound) {
      try {
        let updateOrder = await Order.findOneAndUpdate(
          { user: req.user._id, progress: "pending" },
          req.body,
          { new: true, runValidators: true }
        )
          .populate("product", ["title", "size", "price"])
          .exec();
        updateOrder.changePending();
        updateOrder.changeStock();
        await updateOrder.save();
        return res.send(updateOrder);
      } catch (e) {
        return res.status(400).send(e);
      }
    } else {
      return res.send("無法送出訂單");
    }
  } else {
    return res.status(400).send("此功能僅提供一般會員");
  }
});

//用戶取得自己的單一訂單
router.get("/oneOrder/:_order_id", authCheck, async (req, res) => {
  if (req.user.role == "consumer") {
    let { _order_id } = req.params;
    try {
      let orderFound = await Order.findOne({
        user: req.user._id,
        _id: _order_id,
      })
        .populate("product", ["title", "size", "price", "file"])
        .exec();
      if (orderFound) {
        return res.send(orderFound);
      } else {
        return res.send("");
      }
    } catch (e) {
      return res.status(400).send(e);
    }
  } else {
    return res.status(400).send("此功能僅提供一般會員");
  }
});

//用戶取得自己的所有訂單
router.get("/all", authCheck, async (req, res) => {
  if (req.user.role == "consumer") {
    try {
      let orders = await Order.find({ user: req.user._id })
        .populate("product", ["title", "size", "price"])
        .exec();
      if (orders.length > 0) {
        return res.send(orders);
      } else {
        return res.send("");
      }
    } catch (e) {
      return res.status(400).send(e);
    }
  } else {
    return res.status(400).send("此功能僅提供一般會員");
  }
});

//用戶刪除訂單商品
router.patch("/:_product_id", authCheck, async (req, res) => {
  if (req.user.role == "consumer") {
    let { _product_id } = req.params;
    //確認訂單存在
    let orderFound = await Order.findOne({
      user: req.user._id,
      progress: "pending",
    }).exec();
    if (orderFound) {
      try {
        let updateOrder = await Order.findOneAndUpdate(
          { _id: orderFound.id },
          { $pull: { product: _product_id } },
          { new: true, runValidators: true }
        )
          .populate("product", ["title", "size", "price"])
          .exec();
        await updateOrder.save();
        return res.send(updateOrder);
      } catch (e) {
        return res.status(400).send(e);
      }
    } else {
      return res.send("無法刪除商品");
    }
  } else {
    return res.status(400).send("此功能僅提供一般會員");
  }
});

//管理者取得所有訂單
router.get("/manager/all", authCheck, async (req, res) => {
  if (req.user.role == "manager") {
    try {
      let orders = await Order.find({})
        .populate("product", ["title", "price"])
        .exec();
      if (orders.length > 0) {
        return res.send(orders);
      } else {
        return res.send("");
      }
    } catch (e) {
      return res.status(400).send(e);
    }
  } else {
    return res.status(400).send("僅有管理者能操作此頁面");
  }
});

//管理者取得單一訂單
router.get("/manager/:_order_id", authCheck, async (req, res) => {
  if (req.user.role == "manager") {
    let { _order_id } = req.params;
    try {
      let orderFound = await Order.findOne({
        _id: _order_id,
      })
        .populate("product", ["title", "size", "price", "file"])
        .exec();
      if (orderFound) {
        return res.send(orderFound);
      } else {
        return res.send("");
      }
    } catch (e) {
      return res.status(400).send(e);
    }
  } else {
    return res.status(400).send("僅有管理者能操作此頁面");
  }
});

//管理者修改訂單狀態
router.patch("/manager/:_order_id", authCheck, async (req, res) => {
  if (req.user.role == "manager") {
    let { _order_id } = req.params;
    let orderFound = await Order.findOne({ _id: _order_id }).exec();
    if (orderFound) {
      try {
        orderFound.changeProgress();
        await orderFound.save();
        return res.send(orderFound);
      } catch (e) {
        return res.status(400).send(e);
      }
    } else {
      return res.status(400).send("無法找到訂單");
    }
  } else {
    return res.status(400).send("僅有管理者能操作此頁面");
  }
});

//管理者刪除單一訂單;
router.delete("/:_id", authCheck, async (req, res) => {
  let { _id } = req.params;
  if (req.user.role == "manager") {
    let orderFound = await Order.findOne({ _id }).exec();
    if (orderFound) {
      try {
        await Order.deleteOne({ _id }).exec();
        return res.send("已被刪除");
      } catch (e) {
        return res.status(400).send("無法刪除");
      }
    } else {
      return res.status(400).send("無法找到");
    }
  } else {
    return res.status(400).send("僅有管理者能操作此頁面");
  }
});

module.exports = router;
