const User = require("../models/user");
const { errorHandler } = require("../utils/dbErrorHandler");

exports.signUp = async (req, res) => {
  const user = new User(req.body);
  try {
    user.role = 0;
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (err) {
    error = errorHandler(err);
    if (error.length == 0) error = err.message;
    res.status(400).send({
      error: error,
    });
  }
};

exports.logIn = async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(404).send({ error: error });
  }
};

exports.logOut = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
};
