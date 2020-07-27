const { MongoClient } = require("mongodb");
const url = process.env.MONGODB_URI || `mongodb://localhost:27017/organizer`;
let db = null;

module.exports = {
  connectDB: async function () {
    if (db) return db;
    let client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = client.db();
    return db;
  },
};
