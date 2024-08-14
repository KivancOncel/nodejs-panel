const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

module.exports = {
  async getTitleByID(levelId) {
    const db = await getDb();
    return await db
      .collection("content")
      .find({ level: levelId })
      .toArray()
      .then((content) => {
        if (levelId != 0) {
          return content.title;
        } else {
          return false;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
