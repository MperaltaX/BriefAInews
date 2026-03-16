require('dotenv').config();
const OpenAI = require('openai');
const client = new OpenAI({ apiKey: process.env.OPEN_AI_SECRET_KEY });
const fs = require('fs');

(async () => {
    try {
        const assistantId = process.env.OPEN_AI_ASSISTANT;
        const run = await client.beta.threads.createAndRunPoll({
            assistant_id: assistantId,
            thread: { messages: [{ role: 'user', content: 'hello' }] }
        });
        
        let messageText = null;
        if (run.status === 'completed') {
            const messages = await client.beta.threads.messages.list(run.thread_id);
            const assistantMessage = messages.data.find(msg => msg.role === 'assistant');
            messageText = assistantMessage.content[0].text.value;
        }

        fs.writeFileSync('run_output.json', JSON.stringify({ 
            status: run.status,
            message: messageText
        }, null, 2));
    } catch (e) {
        fs.writeFileSync('run_output.json', JSON.stringify({ error: e.message, stack: e.stack }));
    }
})();
