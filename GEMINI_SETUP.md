# Gemini API Setup Guide

## Quick Start

1. **Get your API key:**
   - Go to https://makersuite.google.com/app/apikey
   - Sign in with your Google account
   - Create a new API key

2. **Create a `.env` file in the project root:**
   ```bash
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Restart your dev server:**
   ```bash
   npm run dev
   ```

## Usage Examples

### Basic Usage (Simple Prompt)

```javascript
import { getGeminiResponse } from './utils/gemini';

// Simple question
const response = await getGeminiResponse('Что такое здоровое питание?');
console.log(response);
```

### Using in a React Component

```javascript
import { getGeminiResponse } from '../utils/gemini';

function MyComponent() {
  const [response, setResponse] = useState('');
  
  const askAI = async () => {
    const answer = await getGeminiResponse('Рекомендуй мне блюда для спортивного питания');
    setResponse(answer);
  };
  
  return <button onClick={askAI}>Спросить AI</button>;
}
```

### Chat Session (Conversational)

```javascript
import { startGeminiChat } from '../utils/gemini';

const chat = startGeminiChat();
const response1 = await chat.sendMessage('Привет!');
const response2 = await chat.sendMessage('Расскажи о веганском питании');
```

## Example Component

I've created `src/components/GeminiAssistant.jsx` as a ready-to-use example. You can import and use it in your app:

```javascript
import GeminiAssistant from './components/GeminiAssistant';

// Add to your App.jsx
<GeminiAssistant />
```

## Available Models

- `gemini-pro` (default) - Best for text generation
- `gemini-pro-vision` - For image understanding

## Security Note

⚠️ **Never commit your `.env` file to git!** The API key should remain private.

Make sure `.env` is in your `.gitignore` file.

