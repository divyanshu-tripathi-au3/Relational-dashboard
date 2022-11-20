const Validator = require("validator");
const isEmpty = require('./is-Empty')

const validateEmailInput = data => {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";

  if (!Validator.isEmail(data.email)) errors.email = "Invalid Email format!"
  if (Validator.isEmpty(data.email)) errors.email = "Email is required";

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

const validateUserData = data => {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  // data.name = !isEmpty(data.name) ? data.name : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (!Validator.isEmail(data.email)) errors.email = "Invalid Email format!"
  if (Validator.isEmpty(data.email)) errors.email = "Email is required";
  
  // if (Validator.isEmpty(data.name)) errors.name = "Name is required";
  
  if (!Validator.isStrongPassword(data.password)) errors.password = "Invalid Password! Min length 8 with 1 uppercase, lowercase, number and symbol"
  if (Validator.isEmpty(data.password)) errors.password = "Password is required";

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

// const verifyUser = data => {
//   let errors = {};

//   data.email = !isEmpty(data.email) ? data.email : "";
//   data.code = !isEmpty(data.code) ? data.code : "";

//   if (!Validator.isEmail(data.email)) errors.email = "Invalid Email format!"
//   if (Validator.isEmpty(data.email)) errors.email = "Email is required";

//   if (Validator.isEmpty(data.code)) errors.code = "Code is required";

//   return {
//     errors,
//     isValid: isEmpty(errors)
//   }
// }

const verifyLoginData = data => {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (!Validator.isEmail(data.email)) errors.email = "Invalid Email format!"
  if (Validator.isEmpty(data.email)) errors.email = "Email is required";

  if (Validator.isEmpty(data.password)) errors.password = "Password is required";

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

const validateUserInput = data => {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";

  if (!Validator.isEmail(data.email)) errors.email = "Invalid Email format!"
  if (Validator.isEmpty(data.email)) errors.email = "Email is required";

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

const validateCode = data => {
  let errors = {};

  data.code = !isEmpty(data.code) ? data.code : "";  
  // data.email = !isEmpty(data.email) ? data.email : "";

  if (Validator.isEmpty(data.code)) errors.code = "Code is required";
  // if (Validator.isEmpty(data.email)) errors.email = "Email is required";

  return {
    errors,
    isValid: isEmpty(errors)
  }
}


const validateForgetPasswordInput = data => {
  let errors = {};

  // data.code = !isEmpty(data.code) ? data.code : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.email = !isEmpty(data.email) ? data.email : "";

  if (!Validator.isStrongPassword(data.password)) errors.password = "Invalid Password!"
  if (Validator.isEmpty(data.password)) errors.password = "Password is required";

  // if (Validator.isEmpty(data.code)) errors.code = "Code is required";

  if (Validator.isEmpty(data.email)) errors.email = "Email is required";

  return {
    errors,
    isValid: isEmpty(errors)
  }
}



const validateEndUser = data => {
  let errors = {};

  if (!Validator.isEmail(data.email)) errors.email = "Invalid Email format!"
  if (Validator.isEmpty(data.email)) errors.email = "Email is required";

 return {
   errors,
   isValid: isEmpty(errors)
 }
}



module.exports = {
  validateEmailInput,
  validateUserData, 
  verifyLoginData,
  validateUserInput,  
  validateCode,
  validateForgetPasswordInput,
  validateEndUser
}