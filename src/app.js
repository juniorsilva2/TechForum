const dotenv = require("dotenv");
const connectToDatabase = require("./database/mongodb");
const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const session = require("cookie-session");
const passport = require("passport");
const publicUserRoutes = require("./routes/public/publicUserRoutes");
const publicTopicRoutes = require("./routes/public/publicTopicRoutes");
const publicPostRoutes = require("./routes/public/publicPostRoutes");
const privateUserRoutes = require("./routes/private/privateUserRoutes");
const privateTopicRoutes = require("./routes/private/privateTopicRoutes");
const privatePostRoutes = require("./routes/private/privatePostRoutes");
const privateCommentRoutes = require("./routes/private/privateCommentRoutes");

dotenv.config();
connectToDatabase();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000}
}));

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);
app.use(passport.authenticate('session'));

app.use(publicUserRoutes);
app.use(publicTopicRoutes);
app.use(publicPostRoutes);
app.use(privateUserRoutes);
app.use(privateTopicRoutes);
app.use(privatePostRoutes);
app.use(privateCommentRoutes);

app.listen(process.env.EXPRESS_PORT, () => console.log(`Running!`));

module.exports = app;
