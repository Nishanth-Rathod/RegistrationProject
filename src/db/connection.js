const mongoose = require("mongoose");

// Connecting with Database
mongoose
  .connect("mongodb://localhost:27017/NishanthRegistration")
  .then(() => {
    console.log("Successfully Connected...");
  })
  .catch((e) => {
    console.log(e);
  });
