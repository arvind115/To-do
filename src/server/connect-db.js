const { MongoClient } = require("mongodb");
// const url = process.env.MONGODB_URI || `mongodb://localhost:27017/organizer`;
const url =
  "mongodb+srv://db_superuser:@Drexor1@to-do-cluster.cyvgt.mongodb.net/<dbname>?retryWrites=true&w=majority";
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
