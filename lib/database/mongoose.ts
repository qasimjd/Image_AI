import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL as string;

if (!MONGODB_URL) {
  throw new Error("❌ Missing MONGODB_URL in environment variables.");
}

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Use globalThis to prevent multiple connections in development
declare global {
  var mongooseConn: MongooseConnection | undefined;
}

let cached: MongooseConnection = globalThis.mongooseConn || { conn: null, promise: null };

export const connectToDatabase = async (): Promise<Mongoose> => {
  if (cached.conn) return cached.conn; // Return existing connection
  console.log("Database connected successfully");


  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URL, {
      dbName: "image-ai", 
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  globalThis.mongooseConn = cached; // Store connection globally

  console.log("Database connected successfully");
  return cached.conn;
};