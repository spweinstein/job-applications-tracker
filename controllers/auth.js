const User = require("../models/user.js");
const bcrypt = require("bcrypt");

// GET "/auth/register"
const renderRegistrationForm = (req, res) => {
  res.render("auth/register.ejs", {
    pageTitle: "Register",
  });
};

// POST "/auth/register"
const registerUser = async (req, res) => {
  // Make sure username is not already taken
  const userInDatabase = await User.findOne({ username: req.body.username });
  if (userInDatabase) {
    return res.render("auth/register.ejs", {
      error: "Username already taken.",
      pageTitle: "Register",
    });
  }

  // Make sure password and confirm password are the same
  if (req.body.password !== req.body.confirmPassword) {
    return res.render("auth/register.ejs", {
      error: "Password and confirm password must match.",
      pageTitle: "Register",
    });
  }

  // Hash the password
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);

  // Create our new user
  const user = await User.create({
    username: req.body.username,
    password: hashedPassword,
  });

  // Manage Session
  req.session.user = {
    username: user.username,
    _id: user._id,
  };

  req.session.save(() => {
    res.redirect("/");
  });
};

// GET "/auth/login"
const renderLoginForm = (req, res) => {
  res.render("auth/login.ejs", {
    pageTitle: "Log In",
  });
};

// POST "/auth/login"
const loginUser = async (req, res) => {
  // Make sure username is not already taken
  const userInDatabase = await User.findOne({ username: req.body.username });

  if (!userInDatabase) {
    return res.render("auth/login.ejs", {
      error: "Login failed. Please try again.",
      pageTitle: "Login",
    });
  }

  // Compare userInDatabase's hashed password against Form Data password hashed by bcrypt
  const validPassword = bcrypt.compareSync(
    req.body.password,
    userInDatabase.password,
  );

  if (!validPassword) {
    return res.render("auth/login.ejs", {
      error: "Login failed. Please try again.",
      pageTitle: "Login",
    });
  }

  // Manage Session
  req.session.user = {
    username: userInDatabase.username,
    _id: userInDatabase._id,
  };

  req.session.save(() => {
    res.redirect("/jobApps");
  });
};

// GET "/auth/logout"
const logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

module.exports = {
  renderRegistrationForm,
  registerUser,
  renderLoginForm,
  loginUser,
  logoutUser,
};
