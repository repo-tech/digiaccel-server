import mongoose from 'mongoose';

export async function connectDB() {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is required to connect to MongoDB');
  const cached = global._mongoose || (global._mongoose = { conn: null, promise: null });
  if (cached.conn) return cached.conn;
  if (!cached.promise) cached.promise = mongoose.connect(process.env.MONGO_URI, { bufferCommands: false, serverSelectionTimeoutMS: 8000 });
  cached.conn = await cached.promise;
  return cached.conn;
}

export const connectDb = connectDB;
export async function disconnectDb() { await mongoose.connection.close(); global._mongoose = { conn: null, promise: null }; }
