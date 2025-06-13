const path = require("path");
const express = require("express");

const adminController = require("../controller/admin");
const userController = require("../controller/user");
const contentController = require("../controller/content");
const menuController = require("../controller/menu");
const productController = require("../controller/product");
const categoryController = require("../controller/category");
const customerController = require("../controller/customer");

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads/"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.get("/", adminController.getIndex);
router.post("/", adminController.postLogin);
router.get("/dashboard", adminController.getDashboard);
router.get("/logout", adminController.destroySession);
router.get("/user/profile/:userId", userController.getUserById);
router.post("/user/profile/edit-profile/:userId", userController.editUserInfo);
router.get("/user/user-list", userController.getAllUser);
router.get(
  "/user/user-register/:userId/:registerNo",
  userController.editUserRegister
);
router.get("/user/user-delete/:userId", userController.deleteUser);
router.get("/user/user-edit/:userId", userController.getUserInfoInAuthPage);
router.post("/user/user-edit/:userId", userController.editUserInfoInAuthPage);
router.get("/user/user-add", userController.userIndex);
router.post("/user/user-add", userController.addUser);
router.get("/user/user-image/:userId", userController.userImage);
router.post("/user/user-image/:userId", userController.updateUserImage);

router.get("/content/content-list", contentController.getContentIndex);
router.get("/content/content-add", contentController.addContentIndex);
router.post("/content/content-add",upload.single('images[]'), contentController.addContent);
router.get("/content/content-edit/:contentId", contentController.getContentInfo);
router.post("/content/content-edit/:contentId", upload.single('images[]'), contentController.editContentInfo);
router.get("/content/content-delete/:contentId", contentController.deleteContent);

router.get("/menu/menu-list", menuController.getMenuList);
router.get("/menu/menu-add", menuController.getAddMenu);
router.post("/menu/menu-add", menuController.postAddMenu);
router.get("/menu/menu-edit/:menuId", menuController.getEditMenu);
router.post("/menu/menu-edit/:menuId", menuController.postEditMenu);
router.get("/menu/menu-delete/:menuId", menuController.deleteMenu);

router.get("/product/product-list", productController.getProductList);
router.get("/product/product-add", productController.getAddProduct);
router.get("/product/product-edit/:productId", productController.getEditProduct);
router.get("/product/product-delete/:productId", productController.deleteProduct);
router.post(
  "/product/product-add",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "sliderImages", maxCount: 10 }
  ]),
  productController.postAddProduct
);

router.post(
  "/product/product-edit/:productId",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "sliderImages", maxCount: 10 }
  ]),
  productController.postEditProduct
);

router.get("/category/category-list", categoryController.getCategoryList);
router.get("/category/category-add", categoryController.getAddCategory);
router.post("/category/category-add", categoryController.postAddCategory);
router.get("/category/category-edit/:categoryId", categoryController.getEditCategory);
router.post("/category/category-edit/:categoryId", categoryController.postEditCategory);
router.get("/category/category-delete/:categoryId", categoryController.deleteCategory);

router.get("/customer/customer-list", customerController.getCustomerList);
router.get("/customer/customer-detail/:customerId", customerController.getCustomerDetail);
router.get("/customer/customer-delete/:customerId", customerController.deleteCustomer);

module.exports = router;
