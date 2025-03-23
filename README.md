# MCP Database Server

A Model Context Protocol (MCP) server implementation for MongoDB that allows Large Language Models (LLMs) to interact with MongoDB databases through natural language.

## Features

- MongoDB collection operations:
  - List all collections
  - Query documents with filtering and projection
  - Insert documents
  - Delete documents
  - Aggregate pipeline operations

## Prerequisites

- Node.js v20.12.2 or higher
- MongoDB database (local or Atlas)
- Claude Desktop Application

## Installation

1. Clone the repository:

```bash
git clone https://github.com/manpreet2000/mcp-database-server.git
cd mcp-database-server
```

2. Install dependencies:

```bash
npm install
```

3. Build the TypeScript code:

```bash
npm run build
```

## Configuration

To get started, you need to configure the MongoDB connection in your Claude Desktop configuration file:

### MacOS

```bash
~/Library/Application\ Support/Claude/claude_desktop_config.json
```

### Windows

```bash
%APPDATA%/Claude/claude_desktop_config.json
```

Add the following configuration to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "database": {
      "command": "/path/to/node",
      "args": ["/path/to/mcp-database/dist/index.js"],
      "env": {
        "MONGODB_URI": "your-mongodb-connection-string"
      }
    }
  }
}
```

Replace:

- `/path/to/node` with your Node.js executable path
- `/path/to/mcp-database` with the absolute path to this repository
- `your-mongodb-connection-string` with your MongoDB connection URL

## Available Tools

### 1. getCollections

Lists all collections in the connected database.

### 2. getCollection

Retrieves documents from a collection with optional query parameters:

- `collectionName`: Name of the collection
- `limit`: Maximum number of documents to return (default: 10, max: 1000)
- `query`: MongoDB query object
- `projection`: Fields to include/exclude

### 3. insertOne

Inserts a single document into a collection:

- `collectionName`: Name of the collection
- `document`: Document object to insert

### 4. deleteOne

Deletes a single document from a collection:

- `collectionName`: Name of the collection
- `query`: Query to match the document to delete

### 5. aggregate

Executes an aggregation pipeline:

- `collectionName`: Name of the collection
- `pipeline`: Array of aggregation stages
- `options`: Optional aggregation options

## Security

- Never commit your MongoDB connection string to version control
- Use environment variables for sensitive information
- Follow MongoDB's security best practices

## License

MIT License - See [LICENSE](LICENSE) for details
