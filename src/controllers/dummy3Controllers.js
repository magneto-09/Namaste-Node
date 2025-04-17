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

// update Profile --> PATCH  --> route -> /basePath/profile1/:email --> dynamic --> DB level checks only
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

// ------------ Ep 23 - (Authentication, JWT, cookies) 🚀🚀🚀 -----------------------------------
const { dummy3LoginValidation } = require("../helper/validation");

// if creds are valid send some raw random information through cookies.
const loginController = async (req, res, next) => {
  try {
    dummy3LoginValidation(req.body); // API level checks.

    const { email, password } = req.body;
    const ifExists = await Dummy3?.findOne({ email }); // returns document if present else undefined.

    if (!ifExists) throw new Error("Invalid credentials");
    else {
      if (password !== ifExists?.password)
        throw new Error("Invalid credentials");
      else {
        // means credentails are valid so sends some random information via cookies.
        console.log("Login successful.");
        res.cookie(
          "random",
          "sending some random info. to see how cookies works",
          {
            httpOnly: true, // makes the cookie invisible for the user
            // but rest of the flow would be same. check Node S02 part 02 - ep-10 in the doc.
            // path: "/dummy4",  // cookie will only be sent to /dummy4 route & their sub-routes.
            // although even after set, you'll still see all the cookies in POSTMAN cookies UI section.
            // but on the browser, the 'random' cookie (the name of cookie that we're sending from here)
            // will be sent to /dummy4 route & their sub-routes.🚩🚩🚩🚩
          }
        );

        return res.status(200).json({
          message: "Logged In",
          userDetails: ifExists,
        });
      }
    }
  } catch (error) {
    console.log("Error Occured!!!!!!");
    next(error); // default error middleware.
  }
};

// cookieParser middleware has been added globally in the app.js to get the cookies from req.cookie.
const getCookieController = (req, res, next) => {
  try {
    const cookies = req.cookies;
    console.log(cookies);
    return res.status(200).json({
      cookies,
    });
  } catch (error) {
    console.log("Error Occured!!!!!!");
    next(error); // default error middleware.
  }

  // created a dummy route and this controller just to show how to read cookies in the controller.
};

// let's create a new login controller that sends a actual JWT via cookies & update profile controller
// that will verify the user via tokens before updating.

const JWT = require("jsonwebtoken");

const loginController1 = async (req, res, next) => {
  try {
    dummy3LoginValidation(req.body); // API level checks.

    const { email, password } = req.body;

    const ifExists = await Dummy3?.findOne({ email }); // returns document if present else undefined.

    if (!ifExists) throw new Error("Invalid credentials");
    else {
      if (password !== ifExists?.password)
        throw new Error("Invalid credentials");
      else {
        // means credentails are valid so sends JWT token via cookies.
        // 1 -- generate a JWT token and sends the existing user's id as payload while generating token.
        const token = JWT.sign({ _id: ifExists?._id }, process.env.JWT_SECRET);

        // 2 -- send the token through cookies.
        res.cookie("token", token, {
          httpOnly: true, // makes cookie invisible to user only.
          path: "/dummy3", // cookie will be available only for /dummy3 and its subroutes.
        });

        console.log("Login successful.");

        return res.status(200).json({
          message: "Logged In",
        });
      }
    }
  } catch (error) {
    console.log("Error Occured!!!!!!");
    next(error); // default error middleware.
  }
};

const getProfileController = async (req, res, next) => {
  try {
    // 3 -- extract the token from the req.cookies (needs cookie-parser)

    // const cookies = req.cookies;
    // console.log(cookies);

    const { token } = req.cookies; // extracting the token.
    // console.log(token);

    if (!token) throw new Error("Update Not Allowed.");

    // 4 -- Validate the token. Hence, validating the user.
    const decodedMessage = JWT.verify(token, process.env.JWT_SECRET);
    // if got verified successfully then only we'll be able to see user's id else we'll get an error.

    // console.log(decodedMessage);

    const data = await Dummy3?.findById(decodedMessage?._id);

    return res.status(200).json({
      data,
    });
  } catch (error) {
    console.log("Error Occured!!!!!!");
    next(error); // default error middleware.
  }
};

// ----------------------------------------------------------------------------------------

/*
separate the logic of:- 
   extracting token, 
   verify it, 
   extract _id from decodedMessage and,
   get the user from _id
into a separate auth middleware.🌟🌟
*/
const getProfileController1 = (req, res, next) => {
  try {
    const user = req.user; // set in jwtAuth which will be invoked before invoking this.

    // if logic of this handler is getting executed then it simply means that auth verification of
    // user is successful including getting the user from DB and store it in req.user.

    return res.status(200).json({
      message: "Verified the user by creating jwtAuth middleware.",
      Idea: "separate the logic in 2 diff. files.",
      user,
    });
  } catch (error) {
    console.log("Error Occured!!!!!!");
    next(error); // default error middleware.
  }
};

// --------------------- 🚀🚀🚀🚀 Two Token Strategy 🚀🚀🚀🚀 -----------------------------------

/*
    1 -- Acess token -> expiry -> 15 min.
    2 -- Refresh token -> expiry -> 7 days.
    3 -- Send the refresh token via res.cookie by making the httpOnly true and defining the specified
         path. like '/refreshAccessToken' API  --> this will be used to generate new access token when 
         expired by verifying the refresh token at first. 

    4 -- send the access token via res.send. 
    5 -- attach this access token with protected routes as Bearer token in req. headers authorization 
         to verify the identity of user 
    6 -- In the BE things would be simple via POSTMAN. 
    7 -- In the FE side, we'll use axios intercepotr to call '/refreshAccessToken' API to generate
         a new access token whenever it gets expired. 
    
    8 -- Check Two-Token Strategy Doc. 
*/

const loginController2 = async (req, res, next) => {
  try {
    dummy3LoginValidation(req.body); // API level validation & sanitization checks.

    const { email, password } = req.body;

    const ifExists = await Dummy3?.findOne({ email });

    if (!ifExists) throw new Error("Invalid Credentials.");
    else {
      if (password !== ifExists?.password)
        throw new Error("Invalid Credentials.");
      else {
        // creds are valid. generate refresh token and access token

        const payload = { _id: ifExists?._id };

        const refreshToken = JWT?.sign(
          payload,
          process.env.REFRESH_TOKEN_JWT_SECRET,
          {
            expiresIn: "7d",
          }
        );

        const accessToken = JWT?.sign(
          payload,
          process.env.ACCESS_TOKEN_JWT_SECRET,
          {
            expiresIn: 15 * 60,
          }
        );

        // send refresh token via res.cookie. make the cookie accessible to specified path only
        // i.e. refreshAccessToken
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true, // invisible to user. but stored in user's browser.
          path: "/dummy3/refreshAccessToken", // this cookie will be available to this path only.
          maxAge: 7 * 24 * 60 * 60 * 1000, // expires in 7 days
        });

        // sends the access token via res.send
        return res.status(200).json({
          message: "Logged In Successful",
          Idea: "2 way token strategy",
          accessToken: accessToken,
        });
      }
    }
  } catch (error) {
    console.log("Error Occured!!!!!!");
    next(error); // default error middleware.
  }
};

// 1 -- /refreshAccessToken -- frontend will handle the calling of this by itself. automatic calling
const refreshAccessTokenController = (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    // console.log(req.cookies);

    if (!refreshToken) throw new Error("Token not valid."); // if cookie is cleared.

    // verify this refresh token if valid or not.
    const decodedObj = JWT?.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_JWT_SECRET
    ); // if token expires then it'll throw an error.

    // console.log(decodedObj);

    const payload = { _id: decodedObj?._id };

    // generating new access token & will expire it after 15 min. as well.
    const newAccessToken = JWT?.sign(
      payload,
      process.env.ACCESS_TOKEN_JWT_SECRET,
      {
        expiresIn: 15 * 60,
      }
    );

    // send access token via res.send
    return res.status(200).send({
      message: "New Access Token gets generated",
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.log("Error Occured!!!!!!");
    next(error); // default error middleware.
  }
};

// 2 -- GET /profile by getting the bearer token from authorization to verify and returns a user.
// Check jwtAuthMiddleware file 🚀🚀🚀
const getProfileController2 = (req, res, next) => {
  try {
    const data = req.user; // check jwtAuth1

    return res.status(200).send({
      message:
        "Getting profile by following 2 token strategy for authentication.",
      user: data,
    });
  } catch (error) {
    console.log("Error Occured!!!!!!");
    next(error); // default error middleware.
  }
};

// TODO:

// 3 -- Logout functionaliy. clearing cookies onyl would not help. An instant kill switch for
//      generated refreshToken as well.

// --------------------- 🚀🚀🚀🚀 Two Token Strategy 🚀🚀🚀🚀 -----------------------------------

// --------------------------------------------------------------------------------------------------

module.exports = {
  signupController,
  updateProfileController,
  updateProfileController1,
  loginController,
  getCookieController,
  loginController1,
  getProfileController,
  getProfileController1,

  // 2 way token strategy
  loginController2,
  refreshAccessTokenController,
  getProfileController2,
};
