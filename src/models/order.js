const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class Order {
  constructor(
    orderNumber,
    customerId,
    customerName,
    customerEmail,
    customerPhone,
    address,
    items = [],
    total,
    status = "new",
    paymentType,
    paymentStatus,
    shippingCompany,
    shippingCode,
    shippingFee,
    note,
    adminNote,
    createdAt = Date.now(),
    updatedAt = Date.now(),
    id
  ) {
    this.orderNumber = orderNumber;
    this.customerId = customerId;
    this.customerName = customerName;
    this.customerEmail = customerEmail;
    this.customerPhone = customerPhone;
    this.address = address;
    this.items = items;
    this.total = total;
    this.status = status;
    this.paymentType = paymentType;
    this.paymentStatus = paymentStatus;
    this.shippingCompany = shippingCompany;
    this.shippingCode = shippingCode;
    this.shippingFee = shippingFee;
    this.note = note;
    this.adminNote = adminNote;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    if (id) this._id = new mongodb.ObjectId(id);
  }

  async save() {
    const db = await getDb();
    if (this._id) {
      this.updatedAt = Date.now();
      return db.collection("orders").updateOne({ _id: this._id }, { $set: this });
    } else {
      return db.collection("orders").insertOne(this);
    }
  }

  static async getAll(filter = {}) {
    const db = await getDb();
    return db.collection("orders").find(filter).sort({ createdAt: -1 }).toArray();
  }

  static async getById(id) {
    const db = await getDb();
    return db.collection("orders").findOne({ _id: new mongodb.ObjectId(id) });
  }

  static async updateStatus(id, status, items, adminNote, shippingCompany, shippingCode) {
    const db = await getDb();
    const updateObj = { status, items, adminNote, updatedAt: Date.now() };
    if (shippingCompany !== undefined) updateObj.shippingCompany = shippingCompany;
    if (shippingCode !== undefined) updateObj.shippingCode = shippingCode;
    return db.collection("orders").updateOne(
        { _id: new mongodb.ObjectId(id) },
        { $set: updateObj }
    );
  }

  static async delete(id) {
    const db = await getDb();
    return db.collection("orders").deleteOne({ _id: new mongodb.ObjectId(id) });
  }
}

module.exports = Order;