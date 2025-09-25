// Add this at the top of the file
"use server";

import mongoose from "mongoose";

// The MONGODB_URI from your .env.local file
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

// Extend global type to include mongoose cache
// We use `mongoose.Mongoose` here to avoid a separate named import
declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: mongoose.Mongoose | null;
    promise: Promise<mongoose.Mongoose> | null;
  } | undefined;
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase(): Promise<mongoose.Mongoose> {
  if (cached!.conn) {
    console.log("✅ Using cached MongoDB connection");
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached!.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
      console.log("✅ New MongoDB connection established");
      return mongooseInstance;
    }).catch((error) => {
      console.error("❌ MongoDB connection error:", error);
      // Set promise to null on error to allow retry
      cached!.promise = null; 
      throw error;
    });
  }
  
  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    // If the promise was rejected, clear it so we can try again
    cached!.promise = null;
    throw e;
  }
  
  return cached!.conn;
}

export default connectToDatabase;