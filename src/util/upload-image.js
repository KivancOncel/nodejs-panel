var multer = require("multer");
var path = require("path");
var fs = require("fs");

module.exports.files = {
  storage: function () {
    var storage = multer.diskStorage({
      destination: function (req, file, cb) {
        const uploadPath = path.resolve(__dirname, "../public/uploads/");
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
      },
      filename: function (req, file, cb) {
        cb(null, `${Date.now()}--${file.originalname}`);
      },
    });

    return storage;
  },
  allowedFile: function (req, file, cb) {
    if (
      !file.originalname.match(
        /\.(pdf|doc|txt|jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/
      )
    ) {
      req.fileValidationError = "Only  files are allowed!";
      return cb(new Error("Only  files are allowed!"), false);
    }
    cb(null, true);
  },
};