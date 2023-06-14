const router = require("express").Router();
const multer = require("multer");
const Product = require("../models").product;
const productValidation = require("../validation").productValidation;
const { Storage } = require("@google-cloud/storage");

router.use((req, res, next) => {
  console.log("product route正在接受一個request...");
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

//google credentials
const storage = new Storage({
  projectId: "thrift-store-images",
  credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS),
});
const bucketName = "thrift-store-images";

//storage
const storageImage = multer.memoryStorage();
const upload = multer({
  storage: storageImage,
  fileFilter(req, file, cb) {
    // 只接受三種圖片格式
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

//不需被保護的request//

//獲得商店中所有有庫存產品
router.get("/", async (req, res) => {
  try {
    let productFound = await Product.find({ stock: { $ne: 0 } }).exec();
    return res.send(productFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

//獲得所有顯示於首頁商品
router.get("/popular", async (req, res) => {
  try {
    let productFound = await Product.find({ popular: true }).exec();
    return res.send(productFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

//透過商品名稱尋找商品
router.get("/findByName/:name", async (req, res) => {
  let { name } = req.params;
  let newName = new RegExp(name, "i");
  try {
    let productFound = await Product.find({
      title: { $regex: newName },
    }).exec();
    return res.send(productFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

//透過商品id尋找商品
router.get("/findById/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let productFound = await Product.findOne({ _id }).exec();
    return res.send(productFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

//需被保護的request//

//獲得商店中所有產品
router.get("/allProduct", authCheck, async (req, res) => {
  if (req.user.role == "manager") {
    try {
      let productFound = await Product.find({}).exec();
      return res.send(productFound);
    } catch (e) {
      return res.status(500).send(e);
    }
  } else {
    return res.status(400).send("僅有管理者能操作此頁面");
  }
});

//新增產品
router.post("/addProduct", authCheck, async (req, res) => {
  //驗證數據符合規範
  let { error } = productValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //管理者新增產品
  if (req.user.role == "manager") {
    let { title, size, price, stock, description, popular } = req.body;
    let newProduct = new Product({
      title,
      size,
      price,
      stock,
      description,
      popular,
    });
    try {
      let savedProduct = await newProduct.save();
      return res.send(savedProduct);
    } catch (e) {
      return res.status(400).send(e);
    }
  } else {
    return res.status(400).send("僅有管理者能操作此頁面");
  }
});

//上傳圖片
router.post(
  "/image/:_product_id",
  authCheck,
  upload.single("file"),
  async (req, res) => {
    if (req.user.role == "manager") {
      let { _product_id } = req.params;
      let productFound = await Product.findOne({ _id: _product_id }).exec();
      if (productFound) {
        try {
          if (!req.file) {
            return res.send("至少上傳一張照片");
          } else {
            storage
              .bucket(bucketName)
              .file(req.file.originalname)
              .save(req.file.buffer);
            await Product.findOneAndUpdate(
              { _id: _product_id },
              {
                $push: {
                  file: `https://storage.googleapis.com/thrift-store-images/${req.file.originalname}`,
                },
              },
              {
                new: true,
                runValidators: true,
              }
            ).exec();
            let productFound = await Product.findOne({
              _id: _product_id,
            }).exec();
            return res.send({ productFound });
          }
        } catch (e) {
          res.status(500).send(e);
        }
      } else {
        return res.status(400).send("無法找到產品");
      }
    } else {
      return res.status(400).send("僅有管理者能操作此頁面");
    }
  }
);

//刪除圖片
router.delete("/image/:_file_id", authCheck, async (req, res) => {
  if (req.user.role == "manager") {
    let { _file_id } = req.params;
    try {
      let updateProduct = await Product.findOneAndUpdate(
        {
          file: {
            $in: [
              `https://storage.googleapis.com/thrift-store-images/${_file_id}`,
            ],
          },
        },
        {
          $pull: {
            file: `https://storage.googleapis.com/thrift-store-images/${_file_id}`,
          },
        },
        { new: true, runValidators: true }
      ).exec();
      storage.bucket(bucketName).file(_file_id).delete();
      return res.send({
        message: "刪除成功",
        updateProduct,
      });
    } catch (e) {
      res.status(500).send(e);
    }
  } else {
    return res.status(400).send("僅有管理者能操作此頁面");
  }
});

//刪除產品
router.delete("/:_id", authCheck, async (req, res) => {
  if (req.user.role == "manager") {
    let { _id } = req.params;
    let productFound = await Product.findOne({ _id }).exec();
    if (productFound) {
      try {
        for (let n of productFound.file) {
          let splitFile = n.split("/");
          let fileID = splitFile[splitFile.length - 1];
          storage.bucket(bucketName).file(fileID).delete();
        }
        await Product.deleteOne({ _id }).exec();
        return res.send("產品已被刪除");
      } catch (e) {
        return res.status(400).send("無法刪除此產品");
      }
    } else {
      return res.status(400).send("無法找到產品");
    }
  } else {
    return res.status(400).send("僅有管理者能操作此頁面");
  }
});

//修改產品
router.patch("/:_id", authCheck, async (req, res) => {
  //驗證數據符合規範
  let { error } = productValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //管理者修改產品
  if (req.user.role == "manager") {
    let { _id } = req.params;
    let productFound = await Product.findOne({ _id }).exec();
    if (productFound) {
      try {
        let updateProduct = await Product.findOneAndUpdate({ _id }, req.body, {
          new: true,
          runValidators: true,
        }).exec();
        return res.send(updateProduct);
      } catch (e) {
        return res.status(400).send("無法更新產品內容");
      }
    } else {
      return res.status(400).send("無法找到產品");
    }
  } else {
    return res.status(400).send("僅有管理者能操作此頁面");
  }
});

//加入收藏
router.post("/addFavorite/:_id", authCheck, async (req, res) => {
  if (req.user.role == "consumer") {
    let { _id } = req.params;
    try {
      let productFound = await Product.findOne({ _id }).exec();
      productFound.favorite.push(req.user._id);
      let saveProduct = await productFound.save();
      return res.send(saveProduct);
    } catch (e) {
      return res.status(400).send("無法加入收藏");
    }
  } else {
    return res.status(400).send("此功能僅提供一般會員");
  }
});

//刪除收藏
router.delete("/deleteFavorite/:_id", authCheck, async (req, res) => {
  if (req.user.role == "consumer") {
    let { _id } = req.params;
    let productFound = await Product.findOne({ _id }).exec();
    if (productFound) {
      try {
        let updateProduct = await Product.findOneAndUpdate(
          { _id },
          { $pull: { favorite: req.user._id } },
          { new: true, runValidators: true }
        ).exec();
        res.send(updateProduct);
      } catch (e) {
        return res.status(400).send("無法刪除");
      }
    } else {
      return res.status(400).send("無法找到產品");
    }
  } else {
    return res.status(400).send("此功能僅提供一般會員");
  }
});

//獲得所有收藏
router.get("/favorite/:_user_id", authCheck, async (req, res) => {
  if (req.user.role == "consumer") {
    let { _user_id } = req.params;
    try {
      let productFound = await Product.find({ favorite: _user_id }).exec();
      return res.send(productFound);
    } catch (e) {
      return res.status(500).send(e);
    }
  } else {
    return res.status(400).send("此功能僅提供一般會員");
  }
});

module.exports = router;
