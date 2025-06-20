const Menu = require("../models/menu");
const Content = require("../models/content");
const Blog = require("../models/blog");

exports.getIndex = async (req, res) => {
  const headerMenus = await Menu.getAll("header");
  const content = await Content.getBySlug("/");
  const blog = await Blog.getAll();
  res.render("site/index", { 
    headerMenus,
    content,
    blog,
    pageTitle: content?.title || "Anasayfa",
    pageDescription: content?.description || "",
    pageKeywords: content?.keywords || "",
    path: "/", 
  });
};

exports.getContentBySlug = async (req, res) => {
  const headerMenus = await Menu.getAll("header");
  const slug = req.params.slug;
  const content = await Content.getBySlug(slug);
  if (!content) {
    return res.status(404).render("site/404");
  }
  res.render("site/content-detail", { 
    content, 
    headerMenus, 
    pageTitle: content.title,
    pageDescription: content.description,
    pageKeywords: content.keywords 
  });
};

exports.getBlogBySlug = async (req, res) => {
  const headerMenus = await Menu.getAll("header");
  const slug = req.params.slug;
  const blog = await Blog.getBySlug(slug);
  if (!blog) {
    return res.status(404).render("site/404");
  }
  res.render("site/blog-detail", { 
    blog, 
    headerMenus, 
    pageTitle: blog.title,
    pageDescription: blog.description,
    pageKeywords: blog.tags 
  });
};
