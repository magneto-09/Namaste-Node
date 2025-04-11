const { dummy3Model: Dummy3 } = require("../models/dummy3");

const { dummy3EmailEnums: ALLOWED_EMAIL_DOMAIN } = require("../helper/enums");

// signup -> POST
const signupController = async (req, res, next) => {
  const dataObj = req.body;
  const newData = new Dummy3(dataObj); // instance of model --> document

  try {
    await newData?.save();

    console.log("New Data Added Successfully!!!!!!!!!");
    res.status(200).json({
      message: "Data Added!!!",
      newData,
    });
  } catch (error) {
    console.log("Error Occured!!!!!!");
    next(error); // default error middleware.
  }

  // added 6 datas into the db and before adding validation and sanitization
  // checks. that's why dummy3 collection in the DB is vulnerable like others.
};

// update Profile --> PATCH  --> route -> /basePath/profile1/:email --> dynamic
const updateProfileController = async (req, res, next) => {
  try {
    // Manual check to ensure email passed via params is truly an email.
    const { email } = req?.params;

    const domain = email?.split("@")?.[1];

    if (!email?.includes("@") || !ALLOWED_EMAIL_DOMAIN?.includes(domain)) {
      return res.status(401).json({
        message: "Incorrect email has been passed in params!!!!!!!",
        email,
      });
    } else {
      const updatedData = req?.body; // Intentionally sending BAD DATA
      const op = await Dummy3.updateOne({ email }, updatedData, {
        runValidators: true, // this'll make sure to run validation and sanitization checks at DB lvl.
      });

      console.log("Data updated!!!!!!!");
      res.status(200).json({
        message: "Data updated with validation & sanitization checks",
        op,
      });
    }
  } catch (error) {
    console.log("Error Occured!!!!!!");
    next(error); // default error middleware.
  }

  // After adding validation and sanitization checks, things will work fine when we're trying to
  // add new data.
  // But we also know that these validations and sanitizations will be bypassed by update() funcns.
  // Hence, how to apply validation and sanitization for existing data.
  // Option 01 -> use runValidators.
};

module.exports = {
  signupController,
  updateProfileController,
};
