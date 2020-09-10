const express = require("express");
const router = express.Router();

const {
  create,
  read,
  listCategories,
  listBySearch,
  photo,
} = require("../controllers/product");
const { auth, isAdmin } = require("../middleware/auth");

router.post("/product/create/", auth, create);
router.get("/product/:productID", auth, read);

router.get("/products/categories", listCategories);
router.post("/products/by/search", listBySearch);
router.get("/product/photos/:productID", photo);

module.exports = router;
