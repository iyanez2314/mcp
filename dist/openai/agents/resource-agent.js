import OpenAI from "openai";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
const ResouceAgentOutputSchema = z.object({
    resource: z
        .enum(["deliverables", "acitivities", "issues", "tasks", "p3s"])
        .describe("These are the only resouces that can be queired"),
});
export const getResourceAgentResponse = async (nl) => {
    try {
        const resourceAgent = await client.responses.parse({
            model: "gpt-5",
            input: [
                {
                    role: "system",
                    content: `You are a resource agent that will check the natural lang `,
                },
                {
                    role: "user",
                    content: nl,
                },
            ],
            text: {
                format: zodTextFormat(ResouceAgentOutputSchema, "Resource Agent Output"),
            },
        });
        const response = resourceAgent.output_parsed;
        if (!response || !ResouceAgentOutputSchema.safeParse(response).success) {
            throw new Error("Invalid response format from resource agent");
        }
        return response;
    }
    catch (error) {
        console.error("Error in getResourceAgentResponse:", error);
        throw new Error("Failed to get resource agent response");
    }
};
//# sourceMappingURL=resource-agent.js.map