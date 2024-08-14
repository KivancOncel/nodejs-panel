const User = require("../models/user");

exports.getUserById = (req, res, next) => {
  const userId = req.params.userId;
  User.fetchAll(userId)
    .then((user) => {
      if (user) {
        res.render("admin/user/profile", {
          user: user,
          pageTitle: user.name + " Sayfası",
          path: "/admin/user/profile",
        });
      } else {
        res.redirect("/admin");
      }
    })
    .catch((err) => console.log(err));
};

exports.getAllUser = (req, res, next) => {
  res.locals.user = req.session.user;
  if (req.session.loggedIn) {
    res.locals.user = req.session.user;
    User.fetchAllUser()
      .then((userAll) => {
        if (userAll) {
          res.render("admin/user/user-list", {
            userAll: userAll,
            pageTitle: "Kullanıcı Sayfası",
            path: "/admin/user/user-list",
          });
        } else {
          res.redirect("/admin");
        }
      })
      .catch((err) => console.log(err));
  } else {
    res.redirect("/admin");
  }
};

exports.editUserInfo = (req, res, next) => {
  const userId = req.params.userId;
  const updatedName = req.body.name;
  const updatedPassword = req.body.password;
  const updatedMail = req.body.mail;
  const updatedDescription = req.body.description;
  const updatedNameSurname = req.body.namesurname;
  const updatedPhone = req.body.phone;
  const updatedNameTitle = req.body.title;
  const updatedNameWebUrl = req.body.weburl;
  const user = new User(
    userId,
    updatedName,
    updatedPassword,
    updatedMail,
    updatedDescription,
    updatedNameSurname,
    updatedPhone,
    updatedNameTitle,
    updatedNameWebUrl    
  );
  user
    .save()
    .then(() => {
      res.redirect("/admin/user/profile/" + userId);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.editUserRegister = (req, res, next) => {
  res.locals.user = req.session.user;
  if (req.session.loggedIn) {
    const userId = req.params.userId;
    const registerNo = req.params.registerNo;
    User.registerChange(userId, registerNo)
      .then(() => {
        res.redirect("/admin/user/user-list/");
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect("/admin");
  }
};

exports.deleteUser = (req, res, next) => {
  res.locals.user = req.session.user;
  if (req.session.loggedIn) {
    const userId = req.params.userId;
    User.deleteUser(userId)
      .then(() => {
        res.redirect("/admin/user/user-list/");
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect("/admin");
  }
};

exports.getUserInfoInAuthPage = (req, res, next) => {
  res.locals.user = req.session.user;
  if (req.session.loggedIn) {
    const userId = req.params.userId;
    User.fetchAll(userId)
      .then((user) => {
        if (user) {
          res.render("admin/user/user-edit", {
            user: user,
            pageTitle: user.name + " Sayfası",
            path: "/admin/user/user-edit",
          });
        } else {
          res.redirect("/admin");
        }
      })
      .catch((err) => console.log(err));
  } else {
    res.redirect("/admin");
  }
};

exports.editUserInfoInAuthPage = (req, res, next) => {
  const userId = req.params.userId;
  const updatedName = req.body.name;
  const updatedPassword = req.body.password;
  const updatedMail = req.body.mail;
  const updatedDescription = req.body.description;
  const updatedNameSurname = req.body.namesurname;
  const updatedPhone = req.body.phone;
  const updatedNameTitle = req.body.title;
  const updatedNameWebUrl = req.body.weburl;
  const updatedRegister = 1;
  const updatedPhoto = "";
  const user = new User(
    userId,
    updatedName,
    updatedPassword,
    updatedMail,
    updatedDescription,
    updatedNameSurname,
    updatedPhone,
    updatedNameTitle,
    updatedNameWebUrl,
    updatedRegister,
    updatedPhoto
  );
  user
    .save()
    .then(() => {
      res.redirect("/admin/user/user-list");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.addUser = (req, res, next) => {
  const updatedName = req.body.name;
  const updatedPassword = req.body.password;
  const updatedMail = req.body.mail;
  const updatedDescription = req.body.description;
  const updatedNameSurname = req.body.namesurname;
  const updatedPhone = req.body.phone;
  const updatedNameTitle = req.body.title;
  const updatedNameWebUrl = req.body.weburl;
  const updatedRegister = 0;
  const updatedPhoto = null;
  const user = new User(
    updatedName,
    updatedPassword,
    updatedMail,
    updatedDescription,
    updatedNameSurname,
    updatedPhone,
    updatedNameTitle,
    updatedNameWebUrl,
    updatedPhoto,
    updatedRegister
  );
  user
    .save()
    .then(() => {
      res.redirect("/admin/user/user-list");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.userIndex = (req, res, next) => {
  res.locals.user = req.session.user;
  if (req.session.loggedIn) {
    res.render("admin/user/user-add", {
      pageTitle: "User Add",
      path: "/admin/user/add-user",
      editing: false,
    });
  } else {
    res.redirect("/admin");
  }
};

exports.userImage = (req, res, next) => {
  res.locals.user = req.session.user;
  if (req.session.loggedIn) {
    res.render("admin/user/user-image", {
      pageTitle: "Add User Image",
      path: "/admin/user/user-image",
      req: req,
    });
  } else {
    res.redirect("/admin");
  }
};

exports.updateUserImage = (req, res, next) => {
  const userId = req.params.userId;
  var multer = require("multer");
  var fileUpload = require("../util/upload-image");

  res.locals.user = req.session.user;
  if (req.session.loggedIn) {
    var upload = multer({
      storage: fileUpload.files.storage(),
      allowedFile: fileUpload.files.allowedFile,
    }).single("file");
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        res.send(err);
      } else if (err) {
        res.send(err);
      } else {
        User.updateUserImage(userId, req.file.filename)
          .then((result) => {
            res.redirect("/admin/user/user-list");
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  } else {
    res.redirect("/admin");
  }
};
