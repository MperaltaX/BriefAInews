require('dotenv').config();
const OpenAI = require('openai');
const client = new OpenAI({ apiKey: process.env.OPEN_AI_SECRET_KEY });
async function run() {
  try {
    const response = await client.responses.create({
      model: 'gpt-4o-mini',
      input: [{ role: 'user', content: 'hello' }]
    });
    console.log('Model response:', response.output[0].content[0].text);
  } catch(e) {
    console.error('Model err:', e.message);
  }
  
  try {
    const response2 = await client.responses.create({
      assistant_id: process.env.OPEN_AI_ASSISTANT,
      input: [{ role: 'user', content: 'hello from assistant' }]
    });
    console.log('Assistant response:', response2.output[0].content[0].text);
  } catch(e) {
    console.error('Assistant err:', e.message);
  }
}
run();
