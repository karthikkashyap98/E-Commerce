const express = require("express");
require("./db/mongoose");

const userRouter = require("./routes/user");
const categoryRouter = require("./routes/category");
const productRouter = require("./routes/product");

const app = express();
app.use(express.json());

app.use("/api", userRouter);
app.use("/api", categoryRouter);
app.use("/api", productRouter);
module.exports = app;
