const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

const ObjectId = mongodb.ObjectId;

class Content {
  constructor(
    title,
    summary,
    description,
    keywords,
    seoDescription,
    level,
    photo,
    createDate,
    id
  ) {
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.title = title;
    this.summary = summary;
    this.description = description;
    this.keywords = keywords;
    this.seoDescription = seoDescription;
    this.level = level;
    this.photo = photo;
    this.createDate = Date.now();
  }

  async save() {
    const db = await getDb();
    let dbOp;
    if (this._id) {
      // update product
      dbOp = db
        .collection("content")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db.collection("content").insertOne(this);
    }
    return dbOp
      .then((result) => {
        //console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static async getContent() {
    const db = await getDb();
    return db
      .collection("content")
      .find()
      .toArray()
      .then((content) => {
        return content;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static async deleteUser(contentId) {
    const db = await getDb();
    return db
      .collection("content")
      .deleteOne({ _id: new mongodb.ObjectId(contentId) })
      .then()
      .catch((err) => {
        console.log(err);
      });
  }

  static async fetchAll(contentId) {
    const db = await getDb();
    return db
      .collection("content")
      .find({ _id: new mongodb.ObjectId(contentId) })
      .next()
      .then((content) => {
        if (content) {
          return content;
        } else {
          return false;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = Content;
