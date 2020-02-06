import mongoose from "mongoose";

const URL = process.env.URL_DB || "mongodb://localhost:27017/granger";

mongoose.Promise = global.Promise;
mongoose
  .connect(URL, {
    useMongoClient: true
  })
  .then(db => console.log("Database is connected"))
  .catch(err => console.log("err: ", err));
