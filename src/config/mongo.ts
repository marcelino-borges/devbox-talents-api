import mongoose from "mongoose";
import log from "../utils/logs";

const connect = async () => {
  const connString = process.env.MONGO_CONNECTION_STRING;

  if (!connString) {
    log.error("Error finding MONGO_CONNECTION_STRING on env.");
    return;
  }

  log.info("Connecting to mongo...");
  log.info("MONGO_CONNECTION_STRING: ", connString);

  try {
    await mongoose.connect(connString, {
      ignoreUndefined: true,
    });

    const db = mongoose.connection;

    db.on("error", console.error.bind(console, "connection error:"));
    db.on("open", () => {
      log.success("MongoDB connected!");
    });
  } catch (error: any) {
    log.error("Error connecting to mongo: ", error);
    throw error;
  }
};

export default connect;
