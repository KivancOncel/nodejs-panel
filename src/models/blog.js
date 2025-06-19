const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class Blog {
  constructor(
    title,
    slug,
    summary,
    content,
    coverImage,
    tags = [],
    author,
    isPublished = false,
    createdAt = Date.now(),
    updatedAt = Date.now(),
    id
  ) {
    this.title = title;
    this.slug = slug;
    this.summary = summary;
    this.content = content;
    this.coverImage = coverImage;
    this.tags = tags;
    this.author = author;
    this.isPublished = isPublished;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    if (id) this._id = new mongodb.ObjectId(id);
  }

  async save() {
    const db = await getDb();
    if (this._id) {
      this.updatedAt = Date.now();
      return db.collection("blogs").updateOne({ _id: this._id }, { $set: this });
    } else {
      return db.collection("blogs").insertOne(this);
    }
  }

  static async getAll() {
    const db = await getDb();
    return db.collection("blogs").find().sort({ createdAt: -1 }).toArray();
  }

  static async getById(id) {
    const db = await getDb();
    return db.collection("blogs").findOne({ _id: new mongodb.ObjectId(id) });
  }

  static async delete(id) {
    const db = await getDb();
    return db.collection("blogs").deleteOne({ _id: new mongodb.ObjectId(id) });
  }
}

module.exports = Blog;