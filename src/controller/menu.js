const Menu = require("../models/menu");
const getDb = require("../util/database").getDb;
var async = require('async');

exports.getMenuList = async (req, res) => {
  var locals = {};
  res.locals.user = req.session.user;
  if (req.session.loggedIn) {
    const menus = await Menu.getAll();
    res.render("admin/menu/menu-list", { 
      menus,
      pageTitle: "Menu List",
      path: "/",
    });
  } else {
    res.redirect("/admin");
  }
};

exports.getAddMenu = async (req, res) => {
  res.locals.user = req.session.user;
  if (req.session.loggedIn) {
  const menus = await Menu.getAll();
  res.render("admin/menu/menu-add", { menus,
    pageTitle: "Menu Add",
    path: "/", });
  }
  else {
    res.redirect("/admin");
  }
};

exports.postAddMenu = async (req, res) => {
  const { title, url, order, parent, group } = req.body;
  const menu = new Menu(title, url, parseInt(order), parent || null, group || null);
  await menu.save();
  res.redirect("/admin/menu/menu-list");
};

exports.getEditMenu = async (req, res) => {
  res.locals.user = req.session.user;
  if (req.session.loggedIn) {
  const menu = await Menu.getById(req.params.menuId);
  const menus = await Menu.getAll();
  res.render("admin/menu/menu-edit", { menu, menus,
    pageTitle: "Menu Edit",
    path: "/", });
  }
  else {
    res.redirect("/admin");
  }
};

exports.postEditMenu = async (req, res) => {
  const { title, url, order, parent, group } = req.body;
  const menuId = req.params.menuId;  
  const menu = new Menu(title, url, parseInt(order), parent || null, group || null, menuId);
  await menu.save();
  res.redirect("/admin/menu/menu-list");
};

exports.deleteMenu = async (req, res) => {
  await Menu.delete(req.params.menuId);
  res.redirect("/admin/menu/menu-list");
};