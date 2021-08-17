const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  // Name Check
  if (Validator.isEmpty(data.name)) {
    errors.name = "Name Field is Required";
  }

  // Email Check
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email Field is Required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  // Password Checks
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password Field is Required";
  }
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Comfirm Password Field is Required";
  }
  if (!Validator.isLength(data.password, { min: 8, max: 32 })) {
    errors.password = "Password Must Be at least 8 Characters";
  }
  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Password Fields Must Match";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
