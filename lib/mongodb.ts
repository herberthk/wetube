import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const DB_URL = process.env.MONGODB_URI;
const DB_NAME = 'movie_recommendation';

if (!DB_URL) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cachedClient: MongoClient | null = null;

export const connectToDatabase = async()=> {
  // try {
    if (cachedClient) {
      return {
        client: cachedClient,
        db: cachedClient.db(DB_NAME)
      };
    }
  
    const client = new MongoClient(DB_URL!);
    await client.connect();
    
    cachedClient = client;
    
    return {
      client: cachedClient,
      db: cachedClient.db(DB_NAME)
    };
  // } catch (error) {
  //   console.log('MongoDB connection error', error)
  // }
  
}