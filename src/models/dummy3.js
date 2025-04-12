const mongoose = require("mongoose");

const { dummy3EmailEnums: ALLOWED_EMAIL_DOMAIN } = require("../helper/enums");

const dummy3Schema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      // let's add some validations and sanitization checks
      minLength: [3, "Min. length should be 3. got {VALUE}"],
      maxLength: [50, "Max. length can be 50. got {VALUE}"],
      trim: true, // sanitization
    },
    lastName: {
      type: String,
      required: true,
      // let's add some validations and sanitization checks
      minLength: [3, "Min. length should be 3. got {VALUE}"],
      maxLength: [50, "Max. length can be 50. got {VALUE}"],
      trim: true, // sanitization
    },
    age: {
      type: Number,
      required: true,
      // let's add some validations and sanitization checks
      min: [18, "Min. age should be 18. got {VALUE}"],
      max: [130, "Max. Age supported is 130. got {VALUE}"],
      trim: true, // sanitization
    },
    email: {
      type: String,
      required: true,
      unique: true,
      // let's add some validations and sanitization checks
      maxLength: [
        30,
        "Email's Length Exceeded!!!!!!!!!. It should not be more than 30",
      ],
      trim: true, // santization
      lowercase: true, // santization
      // custom validation to check if email contains allowed_domain or not.
      validate: {
        validator: (email) => {
          if (!email?.includes("@")) return false;
          const domain = email?.split("@")?.[1];

          return ALLOWED_EMAIL_DOMAIN?.includes(domain);
        },
        message: (props) =>
          `${
            props?.value
          } is not a valid email. Allowed domains: ${ALLOWED_EMAIL_DOMAIN?.join(
            ", "
          )}`,
      },
    },
    password: {
      type: String,
      required: true,
      minLength:[8, 'Min. length required is 8. Received {VALUE}'],
      maxLength:[30, 'Max. allowed length is 50. Received {VALUE}']
    },
  },
  {
    // strict: 'throw', // by default -> true
    timestamps: true, // this will automatically add createdAt & updatedAt
    // when data gets created or updated.
    // if data exists before adding this timestamp then we'll see updatedAt only
    // when data got updated.
  }
);

const dummy3Model = mongoose.model("dummy3", dummy3Schema); // JS wrapper around schema. Constructor

module.exports = {
  dummy3Model,
};
