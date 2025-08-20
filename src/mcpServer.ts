import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  fetchEkahiUser,
  fetchEkahiUsers,
  fetchEkahiDeliverable,
  fetchEkahiDeliverables,
  fetchEkahiDeliverablesWithFilters,
} from "./ekahi-fetches.js";
import { FilterCondition, FilterGroup } from "./queryFilters.js";

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

  mcpServer.registerResource(
    "ekahi_user",
    new ResourceTemplate("ekahi://users/{id}", { list: undefined }),
    {
      description: "Ekahi User",
      title: "Ekahi User",
      mimeType: "application/json",
    },
    async (uri, { id }) => {
      const users = await fetchEkahiUser(id as string);
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify(users, null, 2),
          },
        ],
      };
    },
  );

  mcpServer.resource(
    "ekahi_users",
    "ekahi://users",
    {
      description: "Ekahi All Ekahi Users",
      title: "Ekahi Users",
      mimeType: "application/json",
    },
    async (uri) => {
      const users = await fetchEkahiUsers();
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify(users, null, 2),
          },
        ],
      };
    },
  );

  mcpServer.registerResource(
    "ekahi_deliverables",
    "ekahi://deliverables",
    {
      description: "Ekahi All Ekahi Deliverables",
      title: "Ekahi Deliverables",
      mimeType: "application/json",
    },
    async (uri) => {
      const deliverables = await fetchEkahiDeliverables();
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify(deliverables, null, 2),
          },
        ],
      };
    },
  );

  mcpServer.registerResource(
    "ekahi_deliverable",
    new ResourceTemplate("ekahi://deliverable/{id}", { list: undefined }),
    {
      title: "Ekahi Deliverable",
      description: "Ekahi Deliverable by ID",
    },
    async (uri, { id }) => {
      if (!id) {
        throw new Error("ID parameter is required");
      }

      const deliverable = await fetchEkahiDeliverable(id as string);
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
    },
  );

  mcpServer.registerTool(
    "get_all_ekahi_users",
    {
      title: "Get All Ekahi Users",
      description: "Fetch all Ekahi users",
    },
    async () => {
      const users = await fetchEkahiUsers();
      return {
        content: [{ type: "text", text: JSON.stringify(users, null, 2) }],
      };
    },
  );

  mcpServer.registerTool(
    "get_ekahi_user",
    {
      title: "Get Ekahi User",
      description: "Fetch all Ekahi users",
      inputSchema: { id: z.string() },
    },
    async ({ id }) => {
      const users = await fetchEkahiUser(id);
      return {
        content: [{ type: "text", text: JSON.stringify(users, null, 2) }],
      };
    },
  );

  mcpServer.registerTool(
    "get_ekahi_deliverable",
    {
      title: "Get Ekahi Deliverable",
      description: "Fetch an Ekahi deliverable by ID",
      inputSchema: { id: z.string() },
    },
    async ({ id }) => {
      if (!id) {
        throw new Error("ID parameter is required");
      }

      const deliverable = await fetchEkahiDeliverable(id);
      if (!deliverable) {
        throw new Error(`Deliverable with ID ${id} not found`);
      }

      return {
        content: [{ type: "text", text: JSON.stringify(deliverable, null, 2) }],
      };
    },
  );

  mcpServer.registerTool(
    "get_ekahi_deliverable",
    {
      title: "Get Ekahi Deliverable",
      description: "Fetch an Ekahi deliverable by ID",
      inputSchema: { id: z.string() },
    },
    async ({ id }) => {
      if (!id) {
        throw new Error("ID parameter is required");
      }

      const deliverable = await fetchEkahiDeliverable(id);
      if (!deliverable) {
        throw new Error(`Deliverable with ID ${id} not found`);
      }

      return {
        content: [{ type: "text", text: JSON.stringify(deliverable, null, 2) }],
      };
    },
  );

  mcpServer.registerTool(
    "get_filtered_ekahi_deliverables",
    {
      title: "Get Filtered Ekahi Deliverables",
      description:
        "Fetch Ekahi deliverables with optional filters. Use filters to search by accountability (e.g., 'system and integration'), status, or other fields.",
      inputSchema: {
        filters: z
          .array(
            z.object({
              field: z
                .string()
                .describe(
                  "Field to filter on (e.g., 'accountableOu', 'status', 'title')",
                ),
              operator: z
                .enum([
                  "=",
                  "!=",
                  ">",
                  ">=",
                  "<",
                  "<=",
                  "in",
                  "not-in",
                  "array-contains",
                  "array-contains-any",
                ])
                .describe("Comparison operator"),
              value: z.any().describe("Value to filter by"),
            }),
          )
          .optional()
          .describe("Array of filter conditions"),
        logicalOperator: z
          .enum(["AND", "OR"])
          .default("AND")
          .describe("How to combine multiple filters"),
      },
    },
    async ({ filters, logicalOperator = "AND" }) => {
      // Convert the filters to the format your API expects
      const filterGroup: FilterGroup | undefined =
        filters && filters.length > 0
          ? {
              logicalOperator,
              conditions: filters.map((f) => ({
                field: f.field,
                operator: f.operator,
                value: f.value,
              })),
            }
          : undefined;

      const deliverables = await fetchEkahiDeliverablesWithFilters(filterGroup);
      if (!deliverables) {
        throw new Error("Unable to get Ekahi deliverables");
      }

      return {
        content: [
          { type: "text", text: JSON.stringify(deliverables, null, 2) },
        ],
      };
    },
  );

  return mcpServer;
}
