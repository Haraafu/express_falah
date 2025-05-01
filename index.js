const express = require("express");
const cors = require('cors');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

const corsSettings = {
  origin: function (origin, callback) {
    const origins = [
      'http://localhost:5173',         
      'https://cs9-falahandhesryo.vercel.app'
    ];

    if (!origin || origins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed for this origin"));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

app.use(cors());

app.use(express.json());

app.use("/store", require("./src/routes/store.route"));
app.use("/user", require("./src/routes/user.route"));
app.use("/item", require("./src/routes/item.route"));
app.use("/transaction", require("./src/routes/transaction.route"));

app.get("/", (req, res) => {
    res.send("Welcome to the API!")
});

module.exports = app;
