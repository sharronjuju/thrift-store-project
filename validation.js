const Joi = require("joi");

const registerValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(50).required().email(),
    password: Joi.string().min(6).max(255).required(),
  });
  return schema.validate(data);
};

const managerRegisterValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(50).required().email(),
    password: Joi.string().min(6).max(255).required(),
    productkey: Joi.string().required(),
  });
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(6).max(50).required().email(),
    password: Joi.string().min(6).max(255).required(),
  });
  return schema.validate(data);
};

const productValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(2).max(20).required(),
    size: Joi.string().min(1).max(20),
    stock: Joi.number().min(1),
    price: Joi.number().min(10).max(9999).required(),
    description: Joi.string().max(50).required(),
    popular: Joi.boolean(),
  });
  return schema.validate(data);
};

const orderValidation = (data) => {
  const schema = Joi.object({
    realname: Joi.string().min(2).max(50).required(),
    phone: Joi.string().required(),
    address: Joi.string().min(2).max(50).required(),
  });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.managerRegisterValidation = managerRegisterValidation;
module.exports.loginValidation = loginValidation;
module.exports.productValidation = productValidation;
module.exports.orderValidation = orderValidation;
