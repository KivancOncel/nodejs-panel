const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

class Menu {
  constructor(title, url, order, parent, group, id) {
    this.title = title;
    this.url = url;
    this.order = order;
    this.parent = parent; // üst menü id'si, ana menü için 0 veya null
    this.group = group;   // header, footer, sidebar gibi
    if (id) this._id = new mongodb.ObjectId(id);
  }

  async save() {
    const db = await getDb();
    if (this._id) {
      return db.collection("menu").updateOne({ _id: this._id }, { $set: this });
    } else {
      return db.collection("menu").insertOne(this);
    }
  }

  static async getAll(group) {
    const db = await getDb();
    const filter = group ? { group } : {};
    return db.collection("menu").find(filter).sort({ order: 1 }).toArray();
  }

  static async getById(id) {
    const db = await getDb();
    return db.collection("menu").findOne({ _id: new mongodb.ObjectId(id) });
  }

  static async delete(id) {
    const db = await getDb();
    return db.collection("menu").deleteOne({ _id: new mongodb.ObjectId(id) });
  }
}

module.exports = Menu;