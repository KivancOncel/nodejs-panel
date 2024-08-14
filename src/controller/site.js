exports.getIndex = (req, res, next) => {
  res.render("site/index", {
    pageTitle: "Main Page",
    path: "/",
  });
};
