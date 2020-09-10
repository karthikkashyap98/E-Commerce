const Category = require("../models/category");

exports.create = async (req, res) => {
  const category = new Category(req.body);
  try {
    await category.save();
    return res.status(201).json({
      category,
    });
  } catch (error) {
    return res.status(400).json({
      error: error,
    });
  }
};
