const path = require("path");
const express = require("express");

const adminController = require("../controller/admin");
const userController = require("../controller/user");
const contentController = require("../controller/content");

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../panel/public/uploads/");
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
//router.post("/content/content-edit/:contentId", upload.single('images[]'), contentController.editContentInfo);
router.get("/content/content-delete/:contentId", contentController.deleteContent);

module.exports = router;
