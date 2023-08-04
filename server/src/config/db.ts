import mongoose, { Connection } from "mongoose";

export default (uri: string): void => {
  mongoose.set("strictQuery", false);
  mongoose.connect(uri);
  const db: Connection = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", () => {
    console.log("Connected to MongoDB");
  });
};
