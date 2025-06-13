const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

class Category {
  constructor(name, slug, id) {
    this.name = name;
    this.slug = slug;
    if (id) this._id = new mongodb.ObjectId(id);
    this.createDate = Date.now();
  }

  async save() {
    const db = await getDb();
    if (this._id) {
      return db.collection("categories").updateOne({ _id: this._id }, { $set: this });
    } else {
      return db.collection("categories").insertOne(this);
    }
  }

  static async getAll() {
    const db = await getDb();
    return db.collection("categories").find().sort({ createDate: -1 }).toArray();
  }

  static async getById(id) {
    const db = await getDb();
    return db.collection("categories").findOne({ _id: new mongodb.ObjectId(id) });
  }

  static async delete(id) {
    const db = await getDb();
    return db.collection("categories").deleteOne({ _id: new mongodb.ObjectId(id) });
  }
}

module.exports = Category;