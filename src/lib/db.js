import mongoose from "mongoose";

const connect = async () => {
  const mongoUri = process.env.MONGO_URI || "";

  if (!mongoUri) {
    throw new Error("MONGO_URI environment variable is not set.");
  }

  // readyState === 0: disconnected 
  // readyState === 1: connected 
  // readyState === 2: connecting 
  // readyState === 3: disconnecting 

  // Ellenőrzés, hogy a kapcsolat állapota már 'connected' (1) vagy 'connecting' (2) állapotban van-e
  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
    console.log("Already connected to MongoDB or connection is in progress.");
    return;
  }

// Indexek frissítése

try {
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
   // await mongoose.connection.db.collection('User').ensureIndex({ email: 1 }, { unique: true });
    console.log("Connected to MongoDB successfully");
  } catch (connectionError) {
    console.error("Connection failed: ", connectionError);
    throw connectionError;
  }
};

export default connect;
