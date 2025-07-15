const express = require("express");
const cors = require('cors');

require("dotenv").config();
require("./config/connect");

const port = process.env.port;
const app = express();

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

const productRoute = require("./routes/product");
const customerRoute = require("./routes/customer");
const orderRoute = require("./routes/order");

app.use("/api/product/", productRoute);
app.use("/api/customer/", customerRoute);
app.use("/api/order/", orderRoute);

app.get("/", (req, res)=>{
    res.send("Application is working");
})

app.listen(port, ()=>console.log("Application is running on port : ", port))