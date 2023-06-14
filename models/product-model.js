const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  title: {
    type: String,
    minlength: 2,
    maxlength: 20,
    required: true,
  },
  size: {
    type: String,
    default: "F",
    maxlength: 5,
  },
  stock: {
    type: Number,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    maxlength: 50,
  },
  popular: {
    type: Boolean,
    default: false,
  },
  file: {
    type: [String],
  },
  favorite: {
    type: [String],
    default: [],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

//instance methods
productSchema.methods.subtractStock = function () {
  this.stock -= 1;
};

module.exports = mongoose.model("Product", productSchema);
