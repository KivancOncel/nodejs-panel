const Customer = require("../models/customer");

exports.getCustomerList = async (req, res) => {
  const customers = await Customer.getAll();
  res.render("admin/customer/customer-list", { customers, pageTitle: "Customer List" });
};

exports.getCustomerDetail = async (req, res) => {
  const customer = await Customer.getById(req.params.customerId);
  res.render("admin/customer/customer-detail", { customer, pageTitle: "Customer Detail" });
};

exports.deleteCustomer = async (req, res) => {
  await Customer.delete(req.params.customerId);
  res.redirect("/admin/customer/customer-list");
};