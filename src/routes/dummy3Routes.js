const express = require("express");

const {
  signupController: dummy3SignupController,
  updateProfileController: dummy3UpdateProfileController,
  updateProfileController1: dummy3UpdateProfileController1,
  loginController: dummy3LoginController,
  getCookieController: dummy3GetCookieController,
  loginController1: dummy3LoginController1,
  getProfileController: dummy3GetProfileController
} = require("../controllers/dummy3Controllers");

const router = express.Router(); // router instance

// HOME route that indicates about learning of data sanitization and validation.
router.get("/", (_, res) => {
  res.status(200).json({
    message: "Namaste Node S02 - EP-21 --> Data Sanitization & Validations",
  });
});

// /signup -> POST
router.post("/signup", dummy3SignupController);

// **************** With DB level Validations only. 🚀🚀🚀🚀 *************************************
// /profile --> update --> PATCH --> running validation and sanitization check using runValidators
router.patch("/profile/:email", dummy3UpdateProfileController); // dynamic route.
// we as a developer know that email should be passed in wildcard. but express doesn't care unless
// you're restricting it.
// even if you'll hit /profile/123, dummy3UpdateProfileController will get invoked unless
// you're restricting it.
// apply regex & manual checking both as well to make sure it is full secured.
// skipping regex as of now.
// ************************************************************************************************

// ************* With API and DB level checks. Maximum validation & sanitization. 🚀🚀🚀🚀*******

router.patch("/profile1/:email", dummy3UpdateProfileController1);

// ************************************************************************************************

// ------------ Ep 23 - (Authentication, JWT, cookies) 🚀🚀🚀 -----------------------------------
// creates a login API that sends some random information via cookies.
router.post("/login", dummy3LoginController);

router.get("/getCookie", dummy3GetCookieController); // dummy API to get the cookie for future routes.

// let's create a new login API that sends a actual JWT via cookies & update profile API
// that will verify the user via tokens before updating.
router.post("/login1", dummy3LoginController1);

router.get("/profile", dummy3GetProfileController);

// --------------------------------------------------------------------------------------------------

module.exports = {
  router,
};
