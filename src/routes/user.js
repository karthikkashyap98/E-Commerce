const express = require("express");
const router = express.Router();

const { signUp, logIn, logOut } = require("../controllers/user");
const { auth, isAdmin } = require("../middleware/auth");

router.post("/signUp", signUp);
router.post("/login", logIn);
router.post("/logout", auth, isAdmin, logOut);
module.exports = router;
