import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as dotenv from "dotenv";
import { z } from "zod";
import { mongodbConnection } from "./mongodb/index.js";
dotenv.config();

class DatabaseMCPServer {
  private mcpServer: McpServer;
  private readonly MONGODB_URI: string;

  constructor() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI environment variable is required");
    }
    this.MONGODB_URI = uri;
    this.mcpServer = new McpServer({
      name: "database-mcp",
      version: "1.0.0",
    });
    this.initializeTools();
  }

  private initializeTools() {
    this.mcpServer.tool("getCollections", async () => {
      try {
        let db = mongodbConnection.getDb();
        if (!db) {
          await mongodbConnection.connect(this.MONGODB_URI);
          db = mongodbConnection.getDb();
          if (!db) throw new Error("Failed to connect to database");
        }
        const collections = await db.listCollections().toArray();
        return {
          content: [
            { type: "text", text: collections.map((c) => c.name).join(", ") },
          ],
        };
      } catch (error) {
        console.error(error);
        return {
          content: [{ type: "text", text: "Error: " + error }],
        };
      }
    });

    this.mcpServer.tool(
      "getCollection",
      {
        collectionName: z.string(),
        limit: z.number().min(1).max(1000).optional().default(10),
        query: z.object({}).optional(),
        projection: z.object({}).optional(),
      },
      async ({
        collectionName,
        limit,
        query,
        projection,
      }: {
        collectionName: string;
        limit?: number;
        query?: any;
        projection?: any;
      }) => {
        try {
          let db = mongodbConnection.getDb();
          if (!db) {
            await mongodbConnection.connect(this.MONGODB_URI);
            db = mongodbConnection.getDb();
            if (!db) throw new Error("Failed to connect to database");
          }
          const collection = db.collection(collectionName);
          const documents = await collection
            .find(query ?? {})
            .limit(limit ?? 100)
            .project(projection ?? {})
            .toArray();
          return {
            content: [
              {
                type: "text",
                text: documents.map((d) => JSON.stringify(d)).join("\n"),
              },
            ],
          };
        } catch (error) {
          console.error(error);
          return {
            content: [{ type: "text", text: "Error: " + error }],
          };
        }
      }
    );

    this.mcpServer.tool(
      "insertOne",
      {
        collectionName: z.string(),
        document: z.object({}),
      },
      async ({ collectionName, document }) => {
        try {
          let db = mongodbConnection.getDb();
          if (!db) {
            await mongodbConnection.connect(this.MONGODB_URI);
            db = mongodbConnection.getDb();
            if (!db) throw new Error("Failed to connect to database");
          }
          const collection = db.collection(collectionName);
          await collection.insertOne(document);
          return {
            content: [{ type: "text", text: "Document inserted successfully" }],
          };
        } catch (error) {
          console.error(error);
          return {
            content: [{ type: "text", text: "Error: " + error }],
          };
        }
      }
    );
    this.mcpServer.tool(
      "deleteOne",
      {
        collectionName: z.string(),
        query: z.object({}),
      },
      async ({ collectionName, query }) => {
        try {
          let db = mongodbConnection.getDb();
          if (!db) {
            await mongodbConnection.connect(this.MONGODB_URI);
            db = mongodbConnection.getDb();
            if (!db) throw new Error("Failed to connect to database");
          }
          const collection = db.collection(collectionName);
          await collection.deleteOne(query);
          return {
            content: [{ type: "text", text: "Document deleted successfully" }],
          };
        } catch (error) {
          console.error(error);
          return {
            content: [{ type: "text", text: "Error: " + error }],
          };
        }
      }
    );
    this.mcpServer.tool(
      "aggregate",
      {
        collectionName: z.string(),
        pipeline: z.array(
          z
            .object({
              $match: z.record(z.any()).optional(),
              $group: z.record(z.any()).optional(),
              $project: z.record(z.any()).optional(),
              $sort: z.record(z.any()).optional(),
              $limit: z.number().optional(),
              $skip: z.number().optional(),
              $unwind: z.string().optional(),
              $lookup: z
                .object({
                  from: z.string(),
                  localField: z.string(),
                  foreignField: z.string(),
                  as: z.string(),
                })
                .optional(),
              $count: z.string().optional(),
              $addFields: z.record(z.any()).optional(),
              $replaceRoot: z.record(z.any()).optional(),
              $facet: z.record(z.any()).optional(),
              $bucket: z.record(z.any()).optional(),
              $geoNear: z.record(z.any()).optional(),
              $indexStats: z.record(z.any()).optional(),
              $listLocalSessions: z.record(z.any()).optional(),
              $listSessions: z.record(z.any()).optional(),
              $merge: z.record(z.any()).optional(),
              $out: z.string().optional(),
              $planCacheStats: z.record(z.any()).optional(),
              $redact: z.record(z.any()).optional(),
              $replaceWith: z.record(z.any()).optional(),
              $sample: z.object({ size: z.number() }).optional(),
              $search: z.record(z.any()).optional(),
              $searchMeta: z.record(z.any()).optional(),
              $set: z.record(z.any()).optional(),
              $setWindowFields: z.record(z.any()).optional(),
              $unionWith: z.record(z.any()).optional(),
              $unset: z.string().optional(),
            })
            .refine(
              (obj) => {
                // Count the number of defined fields
                const definedFields = Object.keys(obj).filter(
                  (key) => obj[key as keyof typeof obj] !== undefined
                );
                return definedFields.length === 1;
              },
              {
                message: "Each pipeline stage must contain exactly one field",
              }
            )
        ),
        options: z.object({}).optional(),
      },
      async ({ collectionName, pipeline, options }) => {
        try {
          let db = mongodbConnection.getDb();
          if (!db) {
            await mongodbConnection.connect(this.MONGODB_URI);
            db = mongodbConnection.getDb();
            if (!db) throw new Error("Failed to connect to database");
          }
          const collection = db.collection(collectionName);
          const result = await collection
            .aggregate(pipeline, { maxTimeMS: 30000, ...options })
            .toArray();
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result),
              },
            ],
          };
        } catch (error) {
          console.error(error);
          return {
            content: [{ type: "text", text: "Error: " + error }],
          };
        }
      }
    );
  }

  async connect(transport: StdioServerTransport) {
    await this.mcpServer.connect(transport);
  }

  async close() {
    await mongodbConnection.close();
  }
}

async function main() {
  const server = new DatabaseMCPServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("Database MCP Server running on stdio");
}

process.on("SIGINT", async () => {
  try {
    console.error("SIGINT received");
    await mongodbConnection.close();
  } finally {
    process.exit(0);
  }
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
  process.exit(1);
});

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
