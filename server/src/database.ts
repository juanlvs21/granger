import mongoose from "mongoose";

mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://localhost/granger", {
    useMongoClient: true
  })
  .then(db => console.log("Database is connected"))
  .catch(err => console.log("err: ", err));
