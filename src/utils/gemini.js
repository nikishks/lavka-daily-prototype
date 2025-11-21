import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
// Get your API key from: https://makersuite.google.com/app/apikey
// Store it in a .env file as VITE_GEMINI_API_KEY=your_key_here
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('⚠️ Gemini API key not found. Please set VITE_GEMINI_API_KEY in your .env file');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

/**
 * Get a response from Gemini AI
 * @param {string} prompt - The prompt/question to send to Gemini
 * @param {string} model - The model to use (default: 'gemini-pro')
 * @returns {Promise<string>} The AI response text
 */
export async function getGeminiResponse(prompt, model = 'gemini-pro') {
  if (!genAI) {
    throw new Error('Gemini API key not configured. Please set VITE_GEMINI_API_KEY in your .env file');
  }

  try {
    const modelInstance = genAI.getGenerativeModel({ model });
    const result = await modelInstance.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
}

/**
 * Get a chat session with Gemini (for conversational AI)
 * @param {string} model - The model to use (default: 'gemini-pro')
 * @returns {Object} Chat session object with sendMessage method
 */
export function startGeminiChat(model = 'gemini-pro') {
  if (!genAI) {
    throw new Error('Gemini API key not configured. Please set VITE_GEMINI_API_KEY in your .env file');
  }

  const modelInstance = genAI.getGenerativeModel({ model });
  return modelInstance.startChat({
    history: [],
    generationConfig: {
      maxOutputTokens: 1000,
    },
  });
}

