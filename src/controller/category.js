const Category = require("../models/category");

exports.getCategoryList = async (req, res) => {    
  res.locals.user = req.session.user;
  const categories = await Category.getAll();
  res.render("admin/category/category-list", { categories, pageTitle: "Category List" });
};

exports.getAddCategory = (req, res) => {
  res.render("admin/category/category-add", { pageTitle: "Add Category" });
};

exports.postAddCategory = async (req, res) => {
  const { name, slug } = req.body;
  const category = new Category(name, slug);
  await category.save();
  res.redirect("/admin/category/category-list");
};

exports.getEditCategory = async (req, res) => {    
  res.locals.user = req.session.user;
  const category = await Category.getById(req.params.categoryId);
  res.render("admin/category/category-edit", { category, pageTitle: "Edit Category" });
};

exports.postEditCategory = async (req, res) => {
  const { name, slug } = req.body;
  const category = new Category(name, slug, req.params.categoryId);
  await category.save();
  res.redirect("/admin/category/category-list");
};

exports.deleteCategory = async (req, res) => {
  await Category.delete(req.params.categoryId);
  res.redirect("/admin/category/category-list");
};