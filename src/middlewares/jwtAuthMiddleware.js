const JWT = require("jsonwebtoken");

const { dummy3Model: Dummy3 } = require("../models/dummy3");

const jwtAuth = async (req, _, next) => {
  try {
    const { token } = req?.cookies; // using cookie-parser in app.js

    if (!token) throw new Error("Token is not Valid."); // if cookies get cleared.

    const decodedObj = JWT?.verify(token, process.env.JWT_SECRET); // Payload that we were sending
    // while generating the token. was sending _id of existing data as a payload.

    const { _id } = decodedObj;

    const user = await Dummy3?.findById(_id); // now rn Dummy3 is the best collection that i've created
    // and break the code logic of Dummy3 routes into controller, routes, and middleware files.

    // Since, auth middleware is something which is always related to verify the identity of the user.
    // that's why named it as user. 🚀🚀🚀

    // Also for our simplicity or to avoid logic duplicacy.
    //  we'll send the user via req.user  to access it from other handlers. 🚀🚀

    // req.user is the custom property 🚀🚀

    if (!user) throw new Error("User Not Found.");

    req.user = user;
    next(); // invoke the next route handler.
  } catch (error) {
    next(error); // default error middleware.
  }
};

// 2 way token stragey. getting the access token as bearer in req. headers authorization to verify the
// user's identity.
// 2 -- GET /profile by getting the bearer token from authorization to verify and returns a user.
const jwtAuth1 = async (req, _, next) => {
  try {
    // console.log(req.headers);

    const authHeader = req?.headers?.authorization;

    // console.log(authHeader);

    const accessToken = authHeader?.split(" ")?.[1];

    // console.log(accessToken);

    if (!accessToken) throw new Error("Invalid Access Token."); // if user forget to pass the token

    const decodedObj = JWT?.verify(
      accessToken,
      process.env.ACCESS_TOKEN_JWT_SECRET
    );

    // console.log(decodedObj);

    const { _id } = decodedObj;

    const user = await Dummy3?.findById(_id); // will get a user with _id

    if (!user) throw new Error("User Not Found.");

    req.user = user; // custom property created to make this user available in other handlers via req.
    next();
  } catch (error) {
    next(error); // default error middleware.
  }
};

module.exports = {
  jwtAuth, // industry standard to wrap it in the object cuz module.exports is empty object initially.
  jwtAuth1, // 2 token strategy.
};
