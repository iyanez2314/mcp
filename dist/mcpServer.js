import { McpServer, ResourceTemplate, } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { fetchEkahiUser, fetchEkahiUsers, fetchEkahiDeliverable, fetchEkahiDeliverables, fetchEkahiDeliverablesWithFilters, fetchOuByName,
// fetchComposeQueryFetch,
 } from "./ekahi-fetches.js";
import resourceCapabilities from "./resourceCapabilities.json" with { type: "json" };
// Helper function to search for value within an object
function containsValue(obj, searchValue) {
    console.log(`    containsValue called with:`, typeof obj, Array.isArray(obj) ? `array[${obj.length}]` : obj);
    if (!obj) {
        console.log(`    -> false (null/undefined)`);
        return false;
    }
    const searchLower = searchValue.toLowerCase();
    // If it's an array, search within each item
    if (Array.isArray(obj)) {
        console.log(`    -> searching array with ${obj.length} items`);
        return obj.some((item) => containsValue(item, searchValue));
    }
    // If it's an object, search in ALL fields recursively
    if (typeof obj === "object") {
        console.log(`    -> searching object with fields:`, Object.keys(obj));
        return Object.values(obj).some(value => {
            if (value === null || value === undefined)
                return false;
            // For nested objects/arrays, recurse
            if (typeof value === "object") {
                return containsValue(value, searchValue);
            }
            // For primitives, do string comparison
            const valueStr = value.toString().toLowerCase();
            const matches = valueStr.includes(searchLower);
            if (matches) {
                console.log(`    -> FOUND MATCH: "${valueStr}" contains "${searchLower}"`);
            }
            return matches;
        });
    }
    // If it's a string/primitive, do direct comparison
    const objStr = obj.toString().toLowerCase();
    const matches = objStr.includes(searchLower);
    console.log(`    -> primitive comparison: "${objStr}" contains "${searchLower}" = ${matches}`);
    return matches;
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
    mcpServer.registerTool("get_all_ekahi_users", {
        title: "Get All Ekahi Users",
        description: "Fetch all Ekahi users",
    }, async () => {
        const users = await fetchEkahiUsers();
        return {
            content: [{ type: "text", text: JSON.stringify(users, null, 2) }],
        };
    });
    mcpServer.registerTool("get_ekahi_user", {
        title: "Get Ekahi User",
        description: "Fetch all Ekahi users",
        inputSchema: { id: z.string() },
    }, async ({ id }) => {
        const users = await fetchEkahiUser(id);
        return {
            content: [{ type: "text", text: JSON.stringify(users, null, 2) }],
        };
    });
    mcpServer.registerTool("get_ekahi_deliverable", {
        title: "Get Ekahi Deliverable",
        description: "Fetch an Ekahi deliverable by ID",
        inputSchema: { id: z.string() },
    }, async ({ id }) => {
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
    });
    // mcpServer.registerTool(
    //   "get_filtered_ekahi_deliverables_nl",
    //   {
    //     title: "Get Filtered Ekahi Deliverables",
    //     description:
    //       "Takes in the natural language query and returns the deliverables that match the query",
    //     inputSchema: {
    //       resource: z
    //         .enum(["deliverables", "users", "issues", "activities", "tasks"])
    //         .describe("These are the resouces that can be queried"),
    //       natrualLanguge: z
    //         .string()
    //         .describe(
    //           "The query the user wants to make to preform the search on the deliverables",
    //         ),
    //     },
    //   },
    //   async ({ resource, natrualLanguge }) => {
    //     if (
    //       !natrualLanguge ||
    //       natrualLanguge.trim() === "" ||
    //       natrualLanguge.length < 3 ||
    //       !resource
    //     ) {
    //       throw new Error("One of the parameters is missing or invalid");
    //     }
    //
    //     const deliverables = await fetchComposeQueryFetch(
    //       natrualLanguge,
    //       resource,
    //     );
    //
    //     if (!deliverables) {
    //       throw new Error("Unable to get Ekahi deliverables");
    //     }
    //
    //     return {
    //       content: [
    //         { type: "text", text: JSON.stringify(deliverables, null, 2) },
    //       ],
    //     };
    //   },
    // );
    // mcpServer.registerTool(
    //   "get_filtered_ekahi_deliverables",
    //   {
    //     title: "Get Filtered Ekahi Deliverables",
    //     description:
    //       "Fetch Ekahi deliverables with optional filters. Use filters to search by accountability (e.g., 'system and integration'), status, or other fields.",
    //     inputSchema: {
    //       filters: z
    //         .array(
    //           z.object({
    //             field: z
    //               .string()
    //               .describe(
    //                 "Field to filter on (e.g., 'accountableOu', 'status', 'title')",
    //               ),
    //             operator: z
    //               .enum([
    //                 "=",
    //                 "!=",
    //                 ">",
    //                 ">=",
    //                 "<",
    //                 "<=",
    //                 "in",
    //                 "not-in",
    //                 "array-contains",
    //                 "array-contains-any",
    //               ])
    //               .describe("Comparison operator"),
    //             value: z.any().describe("Value to filter by"),
    //           }),
    //         )
    //         .optional()
    //         .describe("Array of filter conditions"),
    //       logicalOperator: z
    //         .enum(["AND", "OR"])
    //         .default("AND")
    //         .describe("How to combine multiple filters"),
    //       join: z
    //         .array(z.string())
    //         .optional()
    //         .describe(
    //           "Fields to populate from document references (e.g., ['accountableOu', 'createdBy', 'assignedTo'])",
    //         ),
    //     },
    //   },
    //   async ({ filters, logicalOperator = "AND", join }) => {
    //     // Convert the filters to the format your API expects
    //     const filterGroup: FilterGroup | undefined =
    //       filters && filters.length > 0
    //         ? {
    //             logicalOperator,
    //             conditions: filters.map((f) => ({
    //               field: f.field,
    //               operator: f.operator,
    //               value: f.value,
    //             })),
    //           }
    //         : undefined;
    //
    //     console.log("Fetching Ekahi deliverables with filters:", filterGroup);
    //
    //     const deliverables = await fetchEkahiDeliverablesWithFilters(
    //       filterGroup,
    //       join,
    //     );
    //     if (!deliverables) {
    //       throw new Error("Unable to get Ekahi deliverables");
    //     }
    //
    //     return {
    //       content: [
    //         { type: "text", text: JSON.stringify(deliverables, null, 2) },
    //       ],
    //     };
    //   },
    // );
    const deliverableConfig = resourceCapabilities.deliverables;
    mcpServer.registerTool("search_ekahi_deliverables", {
        title: "Search Ekahi Deliverables",
        description: "Search deliverables within joined reference fields",
        inputSchema: {
            searchInFields: z
                .array(z.enum(deliverableConfig.refFields))
                .min(1)
                .describe("Which reference fields to search within (e.g., ['accountableOu'] for accountability)"),
            searchValue: z
                .string()
                .describe("Value to search for in the selected fields"),
        },
    }, async ({ searchInFields, searchValue }) => {
        // Step 1: Find the OU ID for the search value
        if (searchInFields.includes("accountableOu")) {
            const ous = await fetchOuByName(searchValue);
            if (!ous || ous.length === 0) {
                return {
                    content: [{ type: "text", text: "No organizational units found matching: " + searchValue }],
                };
            }
            // Use the first matching OU
            const targetOu = ous[0];
            // Step 2: Filter deliverables by OU ID
            const filterGroup = {
                logicalOperator: "AND",
                conditions: [{
                        field: "accountableOu",
                        operator: "=",
                        value: targetOu.id
                    }]
            };
            // No joins needed for filtering - much more efficient!
            const deliverables = await fetchEkahiDeliverablesWithFilters(filterGroup, []);
            return {
                content: [{ type: "text", text: JSON.stringify(deliverables, null, 2) }],
            };
        }
        // Fallback for other fields (not implemented yet)
        return {
            content: [{ type: "text", text: "Search not implemented for fields: " + searchInFields.join(", ") }],
        };
    });
    return mcpServer;
}
//# sourceMappingURL=mcpServer.js.map