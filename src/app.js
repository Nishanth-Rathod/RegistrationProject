// require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
require("./db/connection");
const Register = require("./models/userregister");
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieparser = require("cookie-parser");

const auth = require("./middleware/auth");
const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const Partials_path = path.join(__dirname, "../templates/partials");
console.log(template_path);

app.use(express.json());
app.use(cookieparser());
// Here "app.use(express.urlencoded({ extended: false }));" is very inportant (5 star) to see the data in the console
app.use(express.urlencoded({ extended: false }));
app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(Partials_path);

// console.log(process.env.SECRET_KEY);

app.get("/", (req, res) => {
  res.render(path.join(__dirname, "../templates/views/index.hbs"));
});
app.get("/secret", auth, (req, res) => {
  // console.log(`This is the Cookies : ${req.cookies.jwt}`);
  res.render(path.join(__dirname, "../templates/views/secret.hbs"));
});

app.get("/logout", auth, async (req, res) => {
  try {
    console.log(req.user);

    // For single Device Logout
    // req.user.tokens = req.user.tokens.filter((currElement) => {
    // return currElement.token !== req.token;
    // });
    // ************************
    // For Logout for All The Devices
    req.user.tokens = [];

    res.clearCookie("jwt");
    await req.user.save();
    res.render("login");
    console.log("Logout sccessfully...");
  } catch (e) {
    res.status(500).send(e);
  }
});

app.get("/login", (req, res) => {
  res.render(path.join(__dirname, "../templates/views/login.hbs"));
});
app.get("/register", (req, res) => {
  res.render(path.join(__dirname, "../templates/views/register.hbs"));
});
// Creating the user to the Database (Registration)
app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.cpassword;
    if (password === cpassword) {
      const registerRunners = new Register({
        name: req.body.name,
        email: req.body.email,
        number: req.body.number,
        password: password,
        cpassword: cpassword,
      });
      // middleware
      console.log(`success part:${registerRunners}`);
      const token = await registerRunners.generateAuthToken();
      console.log(`The token is:${token}`);

      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 90000),
        httpOnly: true,
      });
      console.log(cookie);

      const Registered = await registerRunners.save();
      console.log(Registered);
      res.status(201).render("index");
    } else {
      res.send("<h1>PLEASE ENTER THE CORRECT PASSWORD</h1>");
    }
  } catch (e) {
    res.status(400).send(e);
  }
});
// ***********************************************************************
// Getting the data
app.get("/data", async (req, res) => {
  const RunnerData = await Register.find();
  res.send(RunnerData);
});
// ***********************************************************************

// Login Data Using post
app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const RunnerLogin = await Register.findOne({ email: email });
    const IsMatch = await bcrypt.compare(password, RunnerLogin.password);

    const token = await RunnerLogin.generateAuthToken();
    console.log(`The token is:${token}`);

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 90000),
      httpOnly: true,
      // secure:true
    });
    // console.log(`This is the Cookies : ${req.cookies.jwt}`);

    if (IsMatch) {
      console.log(IsMatch);
      res.status(201).render("index");
    } else {
      res.status(400).send("<h1>Invalid Password</h1>");
    }

    // console.log(`The Email is : ${email} and the password is : ${password}`);
  } catch (e) {
    res.status(400).send("<h1>Invalid Email or Password</h1>", e);
    console.log(e);
  }
});

app.listen(port, () => {
  console.log(`Server Running at ${port}`);
});
