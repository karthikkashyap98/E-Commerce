// const multer = require("multer");
const fs = require("fs");
const formidable = require("formidable");
const _ = require("lodash");
const Product = require("../models/product");

exports.create = async (req, res) => {
  let form = new formidable.IncomingForm({ multiples: true });
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }

    // check for all fields
    const { name, description, price, category, quantity, shipping } = fields;

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.status(400).send({
        error: "All fields are required",
      });
    }

    let product = new Product(fields);
    product.owner = req.user;
    console.log(files.photo);
    if (files.photo) {
      if (Array.isArray(files.photo)) {
        //Save as array of objects
        for (let i = 0; i < files.photo.length; i++) {
          if (files.photo[i].size > 1000000) {
            return res.status(400).json({
              error: "Image should be less than 1MB",
            });
          }
          photo = {
            data: fs.readFileSync(files.photo[i].path),
            contentType: files.photo[i].type,
          };
          product.photos = product.photos.concat({ photo });
        }
      } else {
        if (files.photo.size > 1000000) {
          return res.status(400).json({
            error: "Image should be less than 1MB",
          });
        }
        photo = {
          data: fs.readFileSync(files.photo.path),
          contentType: files.photo.type,
        };
        product.photos = product.photos.concat({ photo });
      }
    }
    product.save().then((data, err) => {
      if (err) {
        return res.status(400).send({ error: err });
      }
      res.status(201).send({ data });
    });
  });
};

exports.read = async (req, res) => {
  const _id = req.params.productID;
  try {
    const product = await Product.findById({ _id: _id });
    if (!product) {
      res.status(404).send("Product Not Found");
    }
    product.photos = undefined;
    res.send(product);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get the list of categories that are actually linked to products.
exports.listCategories = async (req, res) => {
  try {
    const product = await Product.distinct("category", {});
    res.send(product);
  } catch (error) {
    res.status(400).send({
      error: "Products not found",
    });
  }
};

exports.photo = async (req, res) => {
  try {
    const _id = req.params.productID;
    const product = await Product.findById({ _id: _id });
    if (!product) {
      return res.status(404).send({ error: "Product Not Found" });
    }
    res.send(product.photos);
  } catch (error) {
    res.status(400).send({ error: error });
  }
};

exports.listBySearch = async (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  let findArgs = {};

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 10) {
      if (key === "price") {
        // -> [0, 100]
        // gte
        // lte
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  try {
    const products = await Product.find(findArgs)
      .select("-photos")
      .populate("category")
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit);
    res.json({ products, size: products.length });
  } catch (error) {
    res.status(400).send(error);
  }
};
