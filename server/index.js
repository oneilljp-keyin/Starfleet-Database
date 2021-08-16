const mongodb = require("mongodb");
const dotenv = require("dotenv");

if (process.env.NODE_ENV !== "production") {
  // load environment variables from .env file in non production environments
  dotenv.config();
}

const app = require("./server.js");
const PersonnelDAO = require("./dao/personnelDAO.js");
const StarshipsDAO = require("./dao/starshipsDAO.js");

const MongoClient = mongodb.MongoClient;

const port = process.env.PORT || 8000;

MongoClient.connect(process.env.MONGO_DB_CONNECTION_STRING, {
  maxPoolSize: 50,
  wtimeoutMS: 2500,
  useNewUrlParser: true,
})
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  })
  .then(async (client) => {
    await PersonnelDAO.injectDB(client);
    await StarshipsDAO.injectDB(client);
    app.listen(port, () => {
      console.log(`Listening on Port ${port}`);
    });
  });
