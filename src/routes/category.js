const express = require("express");
const router = express.Router();

const { create } = require("../controllers/category");
const { auth, isAdmin } = require("../middleware/auth");

router.post("/category/create", auth, isAdmin, create);

module.exports = router;
