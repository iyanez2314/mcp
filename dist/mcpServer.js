import { McpServer, ResourceTemplate, } from "@modelcontextprotocol/sdk/server/mcp.js";
const EKAHI_API_URL = process.env.EKAHI_API_URL;
const CLOUD_FN_TOKEN = process.env.CLOUD_FN_TOKEN;
if (!EKAHI_API_URL || !CLOUD_FN_TOKEN) {
    throw new Error("EKAHI_API_URL and CLOUD_FN_TOKEN environment variables must be set");
}
export default function getEkahiMcpServer() {
    const mcpServer = new McpServer({
        name: "Ekahi MCP Server",
        version: "2.0.0",
        capabilities: {
            resources: {},
            tools: {},
            prompts: {},
        },
    });
    mcpServer.registerResource("ekahi_user", new ResourceTemplate("ekahi://users/{id}", { list: undefined }), {
        description: "Ekahi User",
        title: "Ekahi User",
        mimeType: "application/json",
    }, async (uri, { id }) => {
        const users = await fetchEkahiUser(id);
        return {
            contents: [
                {
                    uri: uri.href,
                    text: JSON.stringify(users, null, 2),
                },
            ],
        };
    });
    mcpServer.resource("ekahi_users", "ekahi://users", {
        description: "Ekahi All Ekahi Users",
        title: "Ekahi Users",
        mimeType: "application/json",
    }, async (uri) => {
        const users = await fetchEkahiUsers();
        return {
            contents: [
                {
                    uri: uri.href,
                    text: JSON.stringify(users, null, 2),
                },
            ],
        };
    });
    mcpServer.registerResource("ekahi_deliverables", "ekahi://deliverables", {
        description: "Ekahi All Ekahi Deliverables",
        title: "Ekahi Deliverables",
        mimeType: "application/json",
    }, async (uri) => {
        const deliverables = await fetchEkahiDeliverables();
        return {
            contents: [
                {
                    uri: uri.href,
                    text: JSON.stringify(deliverables, null, 2),
                },
            ],
        };
    });
    mcpServer.registerResource("ekahi_deliverable", new ResourceTemplate("ekahi://deliverable/{id}", { list: undefined }), {
        title: "Ekahi Deliverable",
        description: "Ekahi Deliverable by ID",
    }, async (uri, { id }) => {
        if (!id) {
            throw new Error("ID parameter is required");
        }
        const deliverable = await fetchEkahiDeliverable(id);
        if (!deliverable) {
            throw new Error(`Deliverable with ID ${id} not found`);
        }
        return {
            contents: [
                {
                    uri: uri.href,
                    text: JSON.stringify(deliverable, null, 2),
                },
            ],
        };
    });
    return mcpServer;
}
const fetchEkahiUsers = async () => {
    try {
        const response = await fetch(`${EKAHI_API_URL}/users`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${CLOUD_FN_TOKEN}`,
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error("Error fetching users:", error);
        return null;
    }
};
const fetchEkahiUser = async (id) => {
    try {
        const response = await fetch(`${EKAHI_API_URL}/users/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${CLOUD_FN_TOKEN}`,
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
};
const fetchEkahiDeliverable = async (id) => {
    try {
        const response = await fetch(`${EKAHI_API_URL}/deliverables/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${CLOUD_FN_TOKEN}`,
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error(`Error fetching deliverable with ID ${id}:`, error);
        return null;
    }
};
const fetchEkahiDeliverables = async () => {
    try {
        const response = await fetch(`${EKAHI_API_URL}/deliverables`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${CLOUD_FN_TOKEN}`,
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error("Error fetching deliverables:", error);
        return null;
    }
};
//# sourceMappingURL=mcpServer.js.map