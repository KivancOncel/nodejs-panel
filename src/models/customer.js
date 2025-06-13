const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class Customer {
  constructor(
    name,
    email,
    phone,
    password, // hashlenmiş
    addresses = [],
    status = true,
    createdAt = Date.now(),
    lastLogin = null,
    id
  ) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.password = password;
    this.addresses = addresses;
    this.status = status;
    this.createdAt = createdAt;
    this.lastLogin = lastLogin;
    if (id) this._id = new mongodb.ObjectId(id);
  }

  async save() {
    const db = await getDb();
    if (this._id) {
      return db.collection("customers").updateOne({ _id: this._id }, { $set: this });
    } else {
      return db.collection("customers").insertOne(this);
    }
  }

  static async getAll() {
    const db = await getDb();
    return db.collection("customers").find().sort({ createdAt: -1 }).toArray();
  }

  static async getById(id) {
    const db = await getDb();
    return db.collection("customers").findOne({ _id: new mongodb.ObjectId(id) });
  }

  static async delete(id) {
    const db = await getDb();
    return db.collection("customers").deleteOne({ _id: new mongodb.ObjectId(id) });
  }
}

module.exports = Customer;