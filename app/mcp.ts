import { z } from "zod";
import { initializeMcpApiHandler } from "../lib/mcp-api-handler";
import { createPublicClient, http } from "viem";
import { monadTestnet } from "viem/chains";
import { formatUnits } from "viem";

const publicClient = createPublicClient({
  chain: monadTestnet,
  transport: http(),
});

export const mcpHandler = initializeMcpApiHandler(
  (server) => {
    // Add more tools, resources, and prompts here
    server.tool(
      // Tool ID
      "get-mon-balance",
      // Description of what the tool does
      "Get MON balance for an address on Monad testnet",
      // Input schema
      {
        address: z
          .string()
          .describe("Monad testnet address to check balance for"),
      },
      // Tool implementation
      async ({ address }) => {
        try {
          // Check MON balance for the input address
          const balance = await publicClient.getBalance({
            address: address as `0x${string}`,
          });

          // Return a human friendly message indicating the balance.
          return {
            content: [
              {
                type: "text",
                text: `Balance for ${address}: ${formatUnits(balance, 18)} MON`,
              },
            ],
          };
        } catch (error) {
          // If the balance check process fails, return a graceful message back to the MCP client indicating a failure.
          return {
            content: [
              {
                type: "text",
                text: `Failed to retrieve balance for address: ${address}. Error: ${
                  error instanceof Error ? error.message : String(error)
                }`,
              },
            ],
          };
        }
      }
    );
  },
  {
    capabilities: {
      tools: {
        echo: {
          description: "Echo a message",
        },
      },
    },
  }
);
