const Order = require("../models/order");
const fs = require("fs");
const path = require("path");

// Siparişleri listele (arama/filtre desteği)
exports.getOrderList = async (req, res) => {
  const { q, status } = req.query;
  let filter = {};
  if (q) filter.customerName = { $regex: q, $options: "i" };
  if (status) filter.status = status;
  const orders = await Order.getAll(filter);
  res.render("admin/order/order-list", { orders, pageTitle: "Order List", q, status });
};

// Sipariş detayını göster
exports.getOrderDetail = async (req, res) => {
  const order = await Order.getById(req.params.orderId);
  res.render("admin/order/order-detail", { order, pageTitle: "Order Detail" });
};

// Sipariş durumunu ve admin notunu güncelle (ve tamamlandıysa fotoğrafları sil)
exports.updateOrderStatus = async (req, res) => {
  const { status, adminNote } = req.body;
  const order = await Order.getById(req.params.orderId);

  if (order && order.customerEmail) {
    let subject = "Sipariş Durumunuz Güncellendi";
    let html = `<p>Sayın ${order.customerName},</p>
        <p>Siparişinizin durumu <b>${status}</b> olarak güncellenmiştir.</p>
        <p>Sipariş Numaranız: <b>${order.orderNumber}</b></p>
        <p>Teşekkürler.</p>`;
    mailer.sendMail(order.customerEmail, subject, html);
  }

  // Sipariş tamamlandıysa fotoğrafları sil
  if (status === "completed" && order && order.items) {
    order.items.forEach(item => {
      if (item.uploadedImages && Array.isArray(item.uploadedImages)) {
        item.uploadedImages.forEach(filename => {
          const filePath = path.join(__dirname, "../public/uploads/", filename);
          fs.unlink(filePath, err => {});
        });
        item.uploadedImages = [];
      }
    });
  }

  await Order.updateStatus(req.params.orderId, status, order.items, adminNote);
  res.redirect("/admin/order/order-detail/" + req.params.orderId);
};

// Siparişi sil
exports.deleteOrder = async (req, res) => {
  await Order.delete(req.params.orderId);
  res.redirect("/admin/order/order-list");
};