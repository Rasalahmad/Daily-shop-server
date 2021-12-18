const express = require("express");
const app = express();
const mongoose = require("mongoose")
const dotenv = require("dotenv");
const userRoute = require("./routers/user");
const authRoute = require("./routers/auth");
const productRoute = require("./routers/product");

dotenv.config();

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("DB CONNECTION SUCCESSFUL"))
    .catch((err) => console.log(err));

app.use(express.json())
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/product", productRoute);

app.listen(process.env.PORT || 5000, () => {
    console.log("Server is running")
})