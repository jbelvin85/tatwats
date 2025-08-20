require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE") {
  console.error('GEMINI_API_KEY environment variable is not set or is still the placeholder value.');
  console.error('Please create a .env file in the scripts directory and set your GEMINI_API_KEY.');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

async function getHelperResponse(helperName, messageContent) {
  try {
    // Read the helper's persona from their .md file
    const personaPath = path.join(__dirname, `../../${helperName}/${helperName.replace('the_', 'the.').toUpperCase()}.md`);
    let persona = '';
    try {
      persona = fs.readFileSync(personaPath, 'utf8');
    } catch (err) {
      console.warn(`Could not read persona for ${helperName} from ${personaPath}. Using generic persona.`);
      persona = `You are a helpful assistant named ${helperName}.`;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro"});

    const prompt = `You are ${helperName}. Your persona is:
${persona}

Based on your persona, respond to the following message:
"${messageContent}"

Your response:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;

  } catch (error) {
    console.error(`Error generating response for ${helperName}:`, error);
    return `(Error: Could not generate response for ${helperName})`;
  }
}

module.exports = { getHelperResponse };
