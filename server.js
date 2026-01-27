const express = require("express");
const logger = require("morgan");
const session = require("express-session");
const methodOverride = require("method-override");
const authMiddlewares = require("./middleware/authMiddlewares.js");
const path = require("path");
const db = require("./db/connection.js");
const routes = require("./routes/index.js");
const dotenv = require("dotenv");
const MongoStore = require("connect-mongo").default;
dotenv.config();

const app = express();
const PORT = process.env.PORT ? process.env.PORT : 3000;

// Middleware
app.use(express.urlencoded({ extended: true })); // Parse through Form Data and adds it to request body
app.use(methodOverride("_method")); // Tricks Form POST request so we can use PUT / DELETE
app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  }),
);
app.use(authMiddlewares.passUserToView);

// Routes
app.use("/", routes);

// Initialize Server
db.on("connected", () => {
  console.clear();
  console.log("You are connected to MongoDB!");

  app.listen(PORT, () => {
    console.log("Your server is running!");
  });
});
