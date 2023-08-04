const mongoose = require("mongoose");
// require("dotenv").config();

// const mongoURI = process.env.MONGO_URL;
const mongoURI = "mongodb+srv://dino:7827917162@cluster0.web27pf.mongodb.net/";

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to Mongo Successfully");
  } catch (error) {
    console.error(error);
  }
};

module.exports = connectToMongo;

// Backend:
// npm i init
// npm i express
// npm i mongoose
// npm i -D nodemon
// npm i cors
// npm install express-validator
// npm i bcryptjs
// npm i jsonwebtoken
// npm install --save-dev @testing-library/user-event @testing-library/dom
