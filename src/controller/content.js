const Content = require("../models/content");
const getDb = require("../util/database").getDb;
var async = require('async');

exports.getContentIndex = (req, res, next) => {
  var locals = {};
  res.locals.user = req.session.user;
  if (req.session.loggedIn) {
    async.parallel([
      function(callback) {
        Content.getContent().then((datas) => {
          locals.content = datas;         
          callback();
        });
      }
    ], function(err) { //This function gets called after the two tasks have called their "task callbacks"
      if (err) return next(err); //If an error occurred, we let express handle it by calling the `next` function
      res.render("admin/content/content-list", {
        content: locals.content,
        pageTitle: "Content Page List",
        path: "/admin/content/content-list",
      });
    });
  } else {
    res.redirect("/admin");
  }
};

exports.addContentIndex = (req, res, next) => {
  res.locals.user = req.session.user;
  if (req.session.loggedIn) {
    Content.getContent()
      .then((result) => {
        res.render("admin/content/content-add", {
          pageTitle: "Content Add Page",
          path: "admin/content/content-add",
          contents: result
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect("/admin");
  }
};

exports.addContent = (req, res, next) => {
  const pageTitle = req.body.pageTitle;
  const pageDesciption = req.body.pageDesciption;
  const pageSummary = req.body.pageSummary;
  const seoKeywords = req.body.seoKeywords;
  const seoDesciption = req.body.seoDesciption;
  const pageLevel = req.body.pageLevel;
  const image = req.file.filename;
  const content = new Content(
    pageTitle,
    pageSummary,
    pageDesciption,
    seoKeywords,
    seoDesciption,
    pageLevel,
    image
  );
  content
    .save()
    .then(() => {
      res.redirect("/admin/content/content-list");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteContent = (req, res, next) => {
  res.locals.user = req.session.user;
  if (req.session.loggedIn) {
    const contentId = req.params.contentId;
    Content.deleteUser(contentId)
      .then(() => {
        res.redirect("/admin/content/content-list/");
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect("/admin");
  }
};

exports.getContentInfo = (req, res, next) => {
  res.locals.user = req.session.user;
  if (req.session.loggedIn) {
    var locals = {};
    const contentId = req.params.contentId;
    async.parallel([
      function(callback) {
        Content.getContent().then((datas) => {
          locals.contents = datas;
          callback();
        });
      },
      function(callback) {
        Content.fetchAll(contentId).then((datas) => {
          locals.content = datas;
          callback();
        });
      }
    ], function(err) { //This function gets called after the two tasks have called their "task callbacks"
      if (err) return next(err); //If an error occurred, we let express handle it by calling the `next` function
      res.render("admin/content/content-edit", {
        contents: locals.content,
        datas: locals.contents,
        pageTitle: locals.content.title + " Sayfası",
        path: "/admin/content/content-edit",
      });
    });
  }
}