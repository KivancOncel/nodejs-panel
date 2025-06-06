const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

module.exports = {
  async getTitleByID(levelId) {
    if (levelId == 0) {
      return false;
    }

    try {
      const db = await getDb();
      const content = await db
        .collection("content")
        .findOne({ level: levelId });
      return content ? content.title : false;
    } catch (err) {
      console.log(err);
    }
  },
};
