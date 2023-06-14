const mongoose = require("mongoose");
const { Schema } = mongoose;
const Product = require("./product-model");

const orderSchema = new Schema({
  product: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Product",
    default: [],
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  totalprice: {
    type: Number,
  },
  realname: {
    type: String,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  progress: {
    type: String,
    default: "pending",
    enum: ["pending", "processing", "finished"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

//instance methods

orderSchema.methods.changePending = function () {
  this.progress = "processing";
};

orderSchema.methods.changeProgress = function () {
  this.progress = "finished";
};

orderSchema.methods.changeStock = async function () {
  let productFound = await Product.find({ _id: { $in: this.product } }).exec();
  for (let n of productFound) {
    n.subtractStock();
    await n.save();
  }
};

//mongoose middlewares

orderSchema.pre("save", async function (next) {
  await this.populate("product", ["title", "size", "price"]);
  console.log(this.product);
  let totalPrice = 0;
  for (let n of this.product) {
    totalPrice += n.price;
  }
  this.totalprice = totalPrice;

  next();
});

module.exports = mongoose.model("Order", orderSchema);
