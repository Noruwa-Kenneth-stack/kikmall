// src/lib/mongodb.ts
import mongoose, { Mongoose } from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI ?? ''

if (!MONGODB_URI) {
  throw new Error('⚠️ Please define the MONGODB_URI in your .env.local file')
}

interface MongooseCache {
  conn: Mongoose | null
  promise: Promise<Mongoose> | null
}

declare global {
  // eslint-disable-next-line no-var
  var __mongoose_cache: MongooseCache | undefined
}

const globalCache = global as typeof globalThis & {
  __mongoose_cache?: MongooseCache
}

if (!globalCache.__mongoose_cache) {
  globalCache.__mongoose_cache = { conn: null, promise: null }
}

const cached = globalCache.__mongoose_cache

export async function connectDB (): Promise<Mongoose> {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    // start connection and keep the promise so concurrent callers wait on it
    cached.promise = mongoose
      .connect(MONGODB_URI)
      .then(m => m)
      .catch(err => {
        // clear the failed promise so next attempt can retry
        cached.promise = null
        console.error('❌ MongoDB connection failed (initial connect):', err)
        throw err
      })
  }

  try {
    cached.conn = await cached.promise
    globalCache.__mongoose_cache = cached
    console.log('✅ MongoDB Connected')
    return cached.conn
  } catch (err) {
    // ensure state is clean for future retries
    cached.promise = null
    throw err
  }
}
