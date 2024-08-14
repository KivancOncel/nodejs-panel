const User = require("../models/user");

exports.getIndex = (req, res, next) => {
  req.session.destroy();
  res.render("admin/index", {
    pageTitle: "Admin Main Page",
    path: "/admin",
    error: "",
  });
};

exports.postLogin = (req, res, next) => {
  const { username, password } = req.body;
  User.getUser(username, password)
    .then((user) => {
      if (username === user.name && password === user.password) {
        // Oturum başlat
        req.session.loggedIn = true;
        req.session.user = user;
        res.locals.user = req.session.user;
        res.render("admin/dashboard", {
          user: user,
          error: "",
          pageTitle: "Admin Main Page",
          path: "/admin/dashboard",
        });
      } else {
        res.render("admin/index", {
          error: "Hatalı kullanıcı adı veya şifre.",
          pageTitle: "Admin Main Page",
          path: "/admin",
        });
      }
    })
    .catch((err) => console.log(err));
};

exports.getDashboard = (req, res, next) => {
  res.locals.user = req.session.user;
  if (req.session.loggedIn) {
    res.render("admin/dashboard", {
      pageTitle: "Welcome Page",
      path: "/admin/dashboard",
    });
  } else {
    res.redirect("/admin");
  }
};

exports.destroySession = (req, res, next) => {
  req.session.destroy();
  res.redirect("/admin");
};
