import 'dotenv/config';
import express from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import getEkahiMcpServer from "./mcpServer.js";
// Express server setup
const app = express();
const port = process.env.PORT || 6969;
app.use(express.json());
app.post("/mcp", async (req, res) => {
    try {
        const mcpServer = getEkahiMcpServer();
        const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: undefined,
        });
        res.on("close", () => {
            console.log("Client disconnected");
            transport.close();
            mcpServer.close();
        });
        await mcpServer.connect(transport);
        await transport.handleRequest(req, res, req.body);
    }
    catch (error) {
        console.error("Error in SSE handler:", error);
        if (!res.headersSent) {
            res.status(500).json({
                jsonrpc: "2.0",
                error: {
                    code: -32603,
                    message: "Internal Server Error",
                },
                id: null,
            });
        }
    }
});
app.listen(port, () => {
    console.log(`Express server running on port ${port}`);
    console.log(`MCP server initialized with Ekahi tools`);
});
//# sourceMappingURL=index.js.map