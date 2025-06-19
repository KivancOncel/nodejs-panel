const Blog = require("../models/blog");

exports.getBlogList = async (req, res) => {
  const blogs = await Blog.getAll();
  res.render("admin/blog/blog-list", { blogs, pageTitle: "Blog List" });
};

exports.getAddBlog = (req, res) => {
  res.render("admin/blog/blog-add", { pageTitle: "Add Blog" });
};

exports.postAddBlog = async (req, res) => {
  const { title, slug, summary, content, tags, author, isPublished } = req.body;
  const coverImage = req.file ? req.file.filename : null;
  const tagsArr = tags ? tags.split(",").map(t => t.trim()) : [];
  const blog = new Blog(
    title,
    slug,
    summary,
    content,
    coverImage,
    tagsArr,
    author,
    isPublished === "on"
  );
  await blog.save();
  res.redirect("/admin/blog/blog-list");
};

exports.getEditBlog = async (req, res) => {
  const blog = await Blog.getById(req.params.blogId);
  res.render("admin/blog/blog-edit", { blog, pageTitle: "Edit Blog" });
};

exports.postEditBlog = async (req, res) => {
  const { title, slug, summary, content, tags, author, isPublished } = req.body;
  const coverImage = req.file ? req.file.filename : req.body.oldCoverImage;
  const tagsArr = tags ? tags.split(",").map(t => t.trim()) : [];
  const blog = new Blog(
    title,
    slug,
    summary,
    content,
    coverImage,
    tagsArr,
    author,
    isPublished === "on",
    undefined,
    undefined,
    req.params.blogId
  );
  await blog.save();
  res.redirect("/admin/blog/blog-list");
};

exports.deleteBlog = async (req, res) => {
  await Blog.delete(req.params.blogId);
  res.redirect("/admin/blog/blog-list");
};