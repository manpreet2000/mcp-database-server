# MCP Database Server

A Model Context Protocol (MCP) server implementation that allows Large Language Models (LLMs) to interact with various databases through natural language. Currently supports MongoDB, with plans to support:

- PostgreSQL
- CockroachDB
- Redis
- And more...

## Features

- Database operations through natural language
- Currently supports MongoDB with features:
  - List all collections
  - Query documents with filtering and projection
  - Insert documents
  - Delete documents
  - Aggregate pipeline operations
- Future support for other databases:
  - PostgreSQL: SQL queries, table operations
  - CockroachDB: Distributed SQL operations
  - Redis: Key-value operations, caching

## Prerequisites

- Node.js v20.12.2 or higher
- Database (currently MongoDB, other databases coming soon)
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

To get started, you need to configure your database connection in your Claude Desktop configuration file:

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

- `/path/to/node` with your Node.js executable path or just use `node`
- `/path/to/mcp-database` with the absolute path to this repository
- `your-mongodb-connection-string` with your MongoDB connection URL

## Usage Examples

### MongoDB Examples

1. List all collections in your database:

```
Can you show me all the collections in my database?
```

2. Get specific records from a collection:

```
Give me 2 records from the chargers collection
```

3. Query with filters:

```
Show me all documents in the users collection where status is active
```

4. Insert a document:

```
Add a new user to the users collection with name John and email john@example.com
```

5. Delete a document:

```
Remove the user with email john@example.com from the users collection
```

6. Aggregate data:

```
Show me the total count of users by status in the users collection
```

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

## Future Database Support

### PostgreSQL

- SQL query execution
- Table operations
- Schema management
- Transaction support

### CockroachDB

- Distributed SQL operations
- Multi-region support
- Transaction management
- Schema operations

### Redis

- Key-value operations
- Caching mechanisms
- Pub/sub operations
- Data structure operations

## Security

- Never commit your database connection strings to version control
- Use environment variables for sensitive information
- Follow database-specific security best practices

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

MIT License - See [LICENSE](LICENSE) for details
