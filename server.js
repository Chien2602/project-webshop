const express = require("express");
const app = express();
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport");
dotenv.config();
const port = process.env.PORT;
const cors = require("cors");
const connectMongoDB = require("./configs/mongoDB.config");
const indexRoute = require("./routes/index.route");

connectMongoDB();

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello World");
})

app.use("/api", indexRoute);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})