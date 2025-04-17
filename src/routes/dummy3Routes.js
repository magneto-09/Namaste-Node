const express = require("express");

const {
  signupController: dummy3SignupController,
  updateProfileController: dummy3UpdateProfileController,
  updateProfileController1: dummy3UpdateProfileController1,
  loginController: dummy3LoginController,
  getCookieController: dummy3GetCookieController,
  loginController1: dummy3LoginController1,
  getProfileController: dummy3GetProfileController,
  getProfileController1: dummy3GetProfileController1,
  // 2 way token strategy
  loginController2: dummy3LoginController2,
  refreshAccessTokenController: dummy3RefreshAccessTokenController,
  getProfileController2: dummy3GetProfileController2,
} = require("../controllers/dummy3Controllers");
const { jwtAuth, jwtAuth1 } = require("../middlewares/jwtAuthMiddleware");

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

// separate the logic of extracting token, verify it, extract _id from payload and get the user from _id
// into a separate auth middleware.🌟🌟
router.get("/profile1", jwtAuth, dummy3GetProfileController1);

// ----------- Two way Token Strategy 🚀🚀🚀 ------------------------------------------------------
router.post("/login2", dummy3LoginController2);

router.get("/refreshAccessToken", dummy3RefreshAccessTokenController); // to generate new access token

router.get("/profile2", jwtAuth1, dummy3GetProfileController2);

// --------------------------------------------------------------------------------------------------

module.exports = {
  router,
};
