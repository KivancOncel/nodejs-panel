const Product = require("../models/product");
const Category = require("../models/category");
const mongodb = require("mongodb");

exports.getProductList = async (req, res) => {    
  res.locals.user = req.session.user;
  const products = await Product.getAll();
  const categories = await Category.getAll();

  // Kategori id'sini isme çevir
  const categoryMap = {};
  categories.forEach(cat => {
    categoryMap[cat._id.toString()] = cat.name;
  });

  // Her ürünün category alanını isme çevir
  const productsWithCategoryName = products.map(product => {
    return {
      ...product,
      categoryName: product.category && categoryMap[product.category.toString()] ? categoryMap[product.category.toString()] : "-"
    };
  });

  res.render("admin/product/product-list", {
    products: productsWithCategoryName,
    pageTitle: "Product List",
    path: "/admin/product/product-list"
  });
};

exports.getAddProduct = async (req, res) => {
  res.locals.user = req.session.user;
  const categories = await Category.getAll();
  res.render("admin/product/product-add", { categories, pageTitle: "Add Product", path: "/admin/product/product-add" });
};

exports.postAddProduct = async (req, res) => {
  const categoryId = req.body.category ? new mongodb.ObjectId(req.body.category) : null;
  // Dosya yükleme: mainImage (tek), sliderImages (çoklu)
  const mainImage = req.files && req.files.mainImage ? req.files.mainImage[0].filename : null;
  const sliderImages = req.files && req.files.sliderImages ? req.files.sliderImages.map(f => f.filename) : [];

  // Editable fields JSON parse
  let editableFields = [];
  if (req.body.editableFields) {
    try {
      editableFields = JSON.parse(req.body.editableFields);
    } catch (e) {
      editableFields = [];
    }
  }

  const {
    name, description, summary, slug, dimensions, price, discountPrice,
    imageCount, sku, stock, deliveryTime, printType, minOrder, extraFeatures,
    isActive, vatRate, tags, isFeatured
  } = req.body;

  const product = new Product(
    name,
    description,
    summary,
    mainImage,
    sliderImages,
    slug,
    categoryId,
    dimensions,
    parseFloat(price),
    parseFloat(discountPrice),
    parseInt(imageCount),
    sku,
    parseInt(stock),
    deliveryTime,
    printType,
    parseInt(minOrder),
    extraFeatures,
    isActive === "on" ? true : false,
    parseFloat(vatRate),
    tags,
    isFeatured === "on" ? true : false,
    editableFields
  );
  await product.save();
  res.redirect("/admin/product/product-list");
};

exports.getEditProduct = async (req, res) => {
  res.locals.user = req.session.user;
  const product = await Product.getById(req.params.productId);
  const categories = await Category.getAll();
  res.render("admin/product/product-edit", { product, categories, pageTitle: "Edit Product", path: "/admin/product/product-edit" });
};

exports.postEditProduct = async (req, res) => {
  const categoryId = req.body.category ? new mongodb.ObjectId(req.body.category) : null;
  const mainImage = req.files && req.files.mainImage ? req.files.mainImage[0].filename : req.body.oldMainImage;
  let sliderImages = req.body.oldSliderImages ? [].concat(req.body.oldSliderImages) : [];
  if (req.files && req.files.sliderImages) {
    sliderImages = sliderImages.concat(req.files.sliderImages.map(f => f.filename));
  }

  // Editable fields JSON parse
  let editableFields = [];
  if (req.body.editableFields) {
    try {
      editableFields = JSON.parse(req.body.editableFields);
    } catch (e) {
      editableFields = [];
    }
  }

  const {
    name, description, summary, slug, dimensions, price, discountPrice,
    imageCount, sku, stock, deliveryTime, printType, minOrder, extraFeatures,
    isActive, vatRate, tags, isFeatured
  } = req.body;

  const product = new Product(
    name,
    description,
    summary,
    mainImage,
    sliderImages,
    slug,
    categoryId,
    dimensions,
    parseFloat(price),
    parseFloat(discountPrice),
    parseInt(imageCount),
    sku,
    parseInt(stock),
    deliveryTime,
    printType,
    parseInt(minOrder),
    extraFeatures,
    isActive === "on" ? true : false,
    parseFloat(vatRate),
    tags,
    isFeatured === "on" ? true : false,
    editableFields,
    req.params.productId
  );
  await product.save();
  res.redirect("/admin/product/product-list");
};

exports.deleteProduct = async (req, res) => {
  await Product.delete(req.params.productId);
  res.redirect("/admin/product/product-list");
};