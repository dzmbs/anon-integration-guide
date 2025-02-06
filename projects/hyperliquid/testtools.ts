import * as dotenv from 'dotenv';
dotenv.config();
const { OpenAI } = require('openai');
import { tools } from './tools';
const openai = new OpenAI();

function transformToOpenAITools(aiTools: any[]) {
    return aiTools.map((tool) => ({
        type: 'function', // OpenAI requires this field
        function: {
            name: tool.name,
            description: tool.description,
            parameters: {
                type: 'object',
                properties: tool.props.reduce((acc: any, prop: any) => {
                    acc[prop.name] = {
                        type: prop.type,
                        description: prop.description,
                    };
                    if (prop.enum) {
                        acc[prop.name].enum = prop.enum;
                    }
                    return acc;
                }, {}),
                required: tool.required,
            },
        },
    }));
}

(async () => {
    const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: 'I need you to transfer 55.5 USD from perps to spot on Hyperliquid' }],
        tools: transformToOpenAITools(tools),
        store: true,
    });

    console.log(completion.choices[0].message.tool_calls);
})();
