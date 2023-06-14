const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
    googleID: {
        type: String,
    },
    email: {
        type: String,
        minlength: 6,
        maxlength: 50,
    },
    password: {
        type: String,
        minlength: 6,
        maxLength: 1024,
    },
    role: {
        type: String,
        default: "consumer",
        enum: ["consumer", "manager"]
    },
    productkey: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

//instance methods
userSchema.methods.comparePassword = async function (password, cb) {
    let result;
    try {
        result = await bcrypt.compare(password, this.password);
        return cb(null, result);
    } catch (e) {
        return cb(e, result);
    };
}

//mongoose middlewares

//若使用者為新用戶或正在改密碼，則將密碼進行雜湊處理
userSchema.pre("save", async function (next) {
    if (this.googleID == undefined) {
        if (this.isNew || this.isModified) {
            let hashValue = await bcrypt.hash(this.password, 10);
            this.password = hashValue;
        };
    };
    next();
});

//若使用者為新用戶且為管理者，則將productkey進行雜湊處理，role改為manager
userSchema.pre("save", async function (next) {
    // console.log(this.productkey != undefined);
    if (this.isNew && this.productkey != undefined) {
        this.role = "manager";
        const hashValue = await bcrypt.hash(this.productkey, 10);
        this.productkey = hashValue;
    };
    next();
});

module.exports = mongoose.model("User", userSchema);