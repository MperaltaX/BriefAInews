const OpenAI = require('openai');

const client = new OpenAI({
    apiKey: process.env.OPEN_AI_SECRET_KEY,
});

/**
 * Service to generate AI summary using OpenAI Assistant
 * Utilizes the thread.createAndRunPoll or manual poll to get the response.
 * @param {string} content - The article content
 * @returns {Promise<string>} The generated summary
 */
const generateSummary = async (content) => {
    try {
        const assistantId = process.env.OPEN_AI_ASSISTANT;

        if (!assistantId) {
            throw new Error("OPEN_AI_ASSISTANT is not defined in environment variables");
        }

        // Create a thread and attach the message, then run the assistant
        const run = await client.beta.threads.createAndRunPoll({
            assistant_id: assistantId,
            thread: {
                messages: [
                    { role: 'user', content: `Por favor resume el siguiente contenido en exactamente dos párrafos:\n\n${content}` }
                ]
            }
        });

        if (run.status !== 'completed') {
            throw new Error(`Run ended with non-completed status: ${run.status}`);
        }

        // Get the messages
        const messages = await client.beta.threads.messages.list(run.thread_id);

        // Find the latest assistant message
        const assistantMessage = messages.data.find(msg => msg.role === 'assistant');

        if (assistantMessage && assistantMessage.content && assistantMessage.content[0].text) {
            return assistantMessage.content[0].text.value;
        }

        throw new Error('No content in assistant response');
    } catch (error) {
        console.error('[AI Service Error]', error);
        throw error;
    }
};

module.exports = {
    generateSummary
};
