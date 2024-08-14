const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

const ObjectId = mongodb.ObjectId;

class User {
  constructor(
    id,
    name,
    password,
    mail,
    description,
    namesurname,
    phone,
    title,
    weburl,
    photo,
    register
  ) {
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.name = name;
    this.password = password;
    this.mail = mail;
    this.description = description;
    this.namesurname = namesurname;
    this.phone = phone;
    this.title = title;
    this.weburl = weburl;
    this.photo = photo;
    this.register = register;
  }

  async save() {
    const db = await getDb();
    let dbOp;
    if (this._id) {
      // update product
      dbOp = db.collection("user").updateOne(
        { _id: this._id },
        {
          $set: {
            name: this.name,
            password: this.password,
            mail: this.mail,
            description: this.description,
            namesurname: this.namesurname,
            phone: this.phone,
            title: this.title,
            weburl: this.weburl,
          },
        }
      );
    } else {
      dbOp = db.collection("user").insertOne(this);
    }
    return dbOp
      .then((result) => {
        //console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static async getUser(name, password) {
    const db = await getDb();
    return db
      .collection("user")
      .find({ name: name, password: password, register: 1 })
      .next()
      .then((user) => {
        if (user) {
          return user;
        } else {
          return false;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static async fetchAll(userId) {
    const db = await getDb();
    return db
      .collection("user")
      .find({ _id: new mongodb.ObjectId(userId) })
      .next()
      .then((user) => {
        if (user) {
          return user;
        } else {
          return false;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static async fetchAllUser() {
    const db = await getDb();
    return db
      .collection("user")
      .find()
      .toArray()
      .then((user) => {
        return user;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  static async registerChange(userId, regId) {
    const db = await getDb();
    if (regId == 1) {
      regId = 0;
    } else {
      regId = 1;
    }
    const query = { register: regId };
    return db
      .collection("user")
      .updateOne({ _id: new mongodb.ObjectId(userId) }, { $set: query })
      .then((user) => {
        return user;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  static async deleteUser(userId) {
    const db = await getDb();
    return db
      .collection("user")
      .deleteOne({ _id: new mongodb.ObjectId(userId) })
      .then()
      .catch((err) => {
        console.log(err);
      });
  }
  static async updateUserImage(userId, newImage) {
    const db = await getDb();
    let dbOp;
    const query = { photo: newImage };
    dbOp = db
      .collection("user")
      .updateOne({ _id: new mongodb.ObjectId(userId) }, { $set: query });
    return dbOp
      .then((result) => {
        //console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = User;
