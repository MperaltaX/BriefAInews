const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
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

/**
 * Service to generate audio daily summary using OpenAI TTS
 * @param {string} newsText - A concatenation of top daily news
 * @param {boolean} force - Whether to force regeneration
 * @returns {Promise<string>} The generated public audio URL
 */
const generateDailyAudio = async (newsText, force = false) => {
    try {
        const audioDir = path.join(__dirname, '../public/audio');
        const audioFile = path.join(audioDir, 'daily-summary.mp3');

        // Ensure directory exists
        if (!fs.existsSync(audioDir)) {
            fs.mkdirSync(audioDir, { recursive: true });
        }

        // If not forced and file exists, return the path
        if (!force && fs.existsSync(audioFile)) {
            return '/public/audio/daily-summary.mp3';
        }

        // Generate text summary with GPT-4o-mini
        const textCompletion = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'Eres un presentador de noticias de IA del futuro. Resume estas noticias principales en aproximadamente un minuto de lectura, de forma dinámica, moderna y muy fluida. Empieza con un saludo futurista de Brief AI News.' },
                { role: 'user', content: `Noticias:\n${newsText}` }
            ]
        });

        const summaryText = textCompletion.choices[0].message.content;

        // Generate Audio with TTS
        const mp3 = await client.audio.speech.create({
            model: 'tts-1',
            voice: 'alloy',
            input: summaryText,
        });

        const buffer = Buffer.from(await mp3.arrayBuffer());
        fs.writeFileSync(audioFile, buffer);

        return '/public/audio/daily-summary.mp3';
    } catch (error) {
        console.error('[AI Audio Service Error]', error);
        throw error;
    }
};

module.exports = {
    generateSummary,
    generateDailyAudio
};
