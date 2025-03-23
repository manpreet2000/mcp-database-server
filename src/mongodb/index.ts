import { MongoClient, Db } from "mongodb";

export class MongoDBConnection {
  private client: MongoClient | null = null;
  private db: Db | null = null;

  async connect(databaseUrl: string) {
    try {
      this.client = new MongoClient(databaseUrl);
      await this.client.connect();
      this.db = this.client.db();
      return this.db;
    } catch (error) {
      console.error("MongoDB connection error:", error);
      throw error;
    }
  }

  async close() {
    await this.client?.close();
  }

  getClient(): MongoClient | null {
    return this.client;
  }

  getDb(): Db | null {
    return this.db;
  }
}

export const mongodbConnection = new MongoDBConnection();
