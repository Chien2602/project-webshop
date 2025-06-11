const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT;
const cors = require("cors");
const indexRoute = require("./routes/index.route");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello World");
})

app.use("/api", indexRoute);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})