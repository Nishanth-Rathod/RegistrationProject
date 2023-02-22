const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const RunnerSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  number: {
    type: Number,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  cpassword: {
    type: String,
    require: true,
  },
  tokens: [
    {
      token: {
        type: String,
        require: true,
      },
    },
  ],
});

// Here arrow functions are not supported or no recommended
//Hashing the Password as we before the saving in the database
// Here cpassword is not stored in the database because it is undefined and for security we are not storing in the database as it is not hashed
RunnerSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    // console.log(`The Current password is:${this.password}`);
    this.password = await bcrypt.hash(this.password, 10);
    // console.log(`The Hashed password is:${this.password}`);
    this.cpassword = await bcrypt.hash(this.password, 10);
  }

  next();
});

// jwt:Generating the token

RunnerSchema.methods.generateAuthToken = async function () {
  try {
    console.log(this._id);
    const token = jwt.sign(
      { _id: this._id.toString() },
      "mynameisramavathnishanthrathodiamafullstackwebdeveloper"
    );
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    // console.log(token);
    return token;
  } catch (e) {
    res.send(e);
    console.log(e);
  }
};

// Creating a Collection
const Register = new mongoose.model("Register", RunnerSchema);

module.exports = Register;
