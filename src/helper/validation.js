// 🌟 profileUpdateHelper 🌟 that does API level validation and sanitization
// has its own .js file in helper folder 🚀🚀🚀

const validator = require("validator");

const dummy3LoginValidation = (receivedObj) => {
  if (Object?.keys(receivedObj)?.length === 0)
    throw new Error("Invalid Credentials.");

  const { email } = receivedObj;

  if ("email" in receivedObj && !validator?.isEmail(email))
    throw new Error("Invalid Credentials.");
};

module.exports = {
  dummy3LoginValidation,
};
