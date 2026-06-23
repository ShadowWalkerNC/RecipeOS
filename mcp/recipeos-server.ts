import 'dotenv/config';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

import { recipeTools, handleRecipeTool } from './tools/recipes.js';
import { pantryTools, handlePantryTool } from './tools/pantry.js';
import { prepTools, handlePrepTool } from './tools/prep.js';
import { convertTools, handleConvertTool } from './tools/convert.js';

const ALL_TOOLS = [...recipeTools, ...pantryTools, ...prepTools, ...convertTools];

const server = new Server(
  { name: 'recipeos-mcp', version: '2.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: ALL_TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const a = args as Record<string, any>;

  try {
    let data: unknown;

    if (recipeTools.some(t => t.name === name)) {
      data = await handleRecipeTool(name, a);
    } else if (pantryTools.some(t => t.name === name)) {
      data = await handlePantryTool(name, a);
    } else if (prepTools.some(t => t.name === name)) {
      data = await handlePrepTool(name, a);
    } else if (convertTools.some(t => t.name === name)) {
      data = await handleConvertTool(name, a);
    } else {
      throw new Error(`Unknown tool: ${name}`);
    }

    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  } catch (err: any) {
    return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error('RecipeOS MCP server v2.0.0 running on stdio');
