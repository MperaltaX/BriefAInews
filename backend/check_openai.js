const OpenAI = require('openai');
const client = new OpenAI({ apiKey: 'dummy' });
console.log('Available modules on OpenAI Client:', Object.keys(client));
if (client.responses) {
  console.log('client.responses is present!');
} else {
  console.log('No client.responses module found.');
}
