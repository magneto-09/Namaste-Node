const { dummy3Model: Dummy3 } = require("../models/dummy3");

const {
  dummy3EmailEnums: ALLOWED_EMAIL_DOMAIN,
  dummy3UpdateProfileEnums: ALLOWED_FIELDS,
} = require("../helper/enums");

const { profileUpdateHelper } = require("../helper/authUpdateProfileHelper");

const validator = require("validator"); // npm package that does STRING validation & sanitization only.

// signup -> POST
const signupController = async (req, res, next) => {
  try {
    const dataObj = req.body;

    // after receiving the data we'll do API level checks as well. we'll use validator npm package
    // that is being used for STRING validation & sanitization only.🚀🚀🚀🚀
    if (
      !validator?.isEmail(dataObj?.email) ||
      !validator?.isAlpha(dataObj?.firstName) ||
      !validator?.isAlpha(dataObj?.lastName) ||
      !validator?.isStrongPassword(dataObj?.password)
    ) {
      throw new Error(
        "Account creation failed. Enter the accurate credentials!!!!!!!!!"
      );
    }
    // if everything's Okay then things will proceed further. i.e. create op.

    const newData = new Dummy3(dataObj); // instance of model --> document

    await newData?.save();

    console.log("New Data Added Successfully!!!!!!!!!");
    return res.status(200).json({
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

  // these validation and sanitization checks are at DB level only.
  // We still haven't provide the API level checks as well which should be the 1st line of defense.
};

// update1 -> PATCH --> with API level and DB level Checks. 2 line of defense.

/* API level validation :- 
    1. we'll allow update for few fields only. like :- firstName, lastName, password. 
    2. firstName and lastName should contains only alphabets. 
    3. password must contain (other than alphabets):-  
       3.1 -> Any of these --> @  -  .  _  --> (atleast 1)
       3.2 -> digits --> 0-9 --> (atleast 1)
*/
const updateProfileController1 = async (req, res, next) => {
  try {
    const { email } = req.params;
    const dataObj = req.body;

    // 1. we'll allow update for few fields only. like :- firstName, lastName, password.
    const isUpdateAllowed = Object?.keys(dataObj)?.every((k) =>
      ALLOWED_FIELDS?.includes(k)
    );

    // console.log(dataObj);

    if (!isUpdateAllowed) throw new Error("Update Not Allowed!!!!!!!");

    if (!profileUpdateHelper(dataObj))
      throw new Error("Individual field validation failed!!!!");

    await Dummy3?.updateOne({ email }, dataObj, {
      runValidators: true,
    });

    console.log(
      "Data Updated successfully satisfying DB level & API level checks"
    );
    return res.status(200).json({
      message: "Data Updated Successfully",
    });
  } catch (error) {
    console.log("Error Occured!!!!!!");
    next(error); // default error middleware.
  }
};

module.exports = {
  signupController,
  updateProfileController,
  updateProfileController1,
};
