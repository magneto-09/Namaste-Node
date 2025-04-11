const express = require("express");

const {
  signupController: dummy3SignupController,
  updateProfileController: dummy3UpdateProfileController,
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

// /profile --> update --> PATCH --> running validation and sanitization check using runValidators
router.patch("/profile/:email", dummy3UpdateProfileController); // dynamic route.
// we as a developer know that email should be passed in wildcard. but express doesn't care unless
// you're restricting it.
// even if you'll hit /profile/123, dummy3UpdateProfileController will get invoked unless
// you're restricting it.
// apply regex & manual checking both as well to make sure it is full secured.
// skipping regex as of now.

module.exports = {
  router,
};
