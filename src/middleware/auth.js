const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: "Please Authenticate." });
  }
};

const isAdmin = async (req, res, next) => {
  console.log(req.user);
  if (req.user.role === 0) {
    return res.status(403).json({
      error: "Admin resource! Access denied",
    });
  }
  next();
};

module.exports = { auth, isAdmin };
