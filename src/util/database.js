const { configDotenv } = require("dotenv");
const { ServerApiVersion, MongoClient } = require("mongodb");
configDotenv();

let _db;

const { MONGODB_USER, MONGODB_PASS } = process.env;

const mongoUrl = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASS}@fovizo.woi54ib.mongodb.net/panel?retryWrites=true&w=majority`;

const getDb = async () => {
  if (!_db) {
    const client = new MongoClient(mongoUrl, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    await client.connect();
    _db = client.db();
  }

  return _db;
};

exports.getDb = getDb;
