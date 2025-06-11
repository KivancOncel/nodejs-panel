const Menu = require("../models/menu");
const Content = require("../models/content");

exports.getIndex = (req, res, next) => {
  res.render("site/index", {
    pageTitle: "Main Page",
    path: "/",
  });
};
exports.getIndex = async (req, res) => {
  const headerMenus = await Menu.getAll("header");
  res.render("site/index", { headerMenus });
};
exports.getContentBySlug = async (req, res) => {
  const headerMenus = await Menu.getAll("header");
  const slug = req.params.slug;
  const content = await Content.getBySlug(slug);
  if (!content) {
    return res.status(404).render("site/404");
  }
  res.render("site/content-detail", { content, headerMenus, pageTitle: content.title });
};
