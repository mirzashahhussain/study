const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");
// require("dotenv").config();

connectToMongo();

const app = express();
// const port = process.env.PORT || 5000;
const port = 5000;

connectToMongo()
  .then(() => {
    // Available Routes
    app.use(express.json());
    app.use(cors());
    app.use("/api/auth", require("./routes/auth"));
    app.use("/api/course", require("./routes/course"));
    app.use("/api/quiz", require("./routes/quizRoutes"))

    app.listen(port, () => {
      console.log(`Study Backend listening on port http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });
