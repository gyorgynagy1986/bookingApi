import mongoose from "mongoose";

const connect = async () => {
  const mongoUri = process.env.MONGO_URI || "";

  if (!mongoUri) {
    throw new Error("MONGO_URI environment variable is not set.");
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB successfully");
  } catch (connectionError) {
    if (connectionError instanceof Error) {
      throw new Error("Connection failed: " + connectionError.message);
    } else {
      throw new Error("An unknown error occurred during MongoDB connection");
    }
  }
};

export default connect;
