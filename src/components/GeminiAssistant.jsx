import React, { useState } from 'react';
import { getGeminiResponse } from '../utils/gemini';

/**
 * Example component showing how to use Gemini AI in your app
 * This could be used for meal recommendations, FAQ answers, etc.
 */
export default function GeminiAssistant() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError('');
    setResponse('');

    try {
      // Example: Ask Gemini about meal recommendations
      const fullPrompt = `Ты помощник для сервиса доставки еды "Lavka Daily". 
Пользователь спрашивает: "${prompt}"
Ответь дружелюбно и по делу на русском языке.`;
      
      const aiResponse = await getGeminiResponse(fullPrompt);
      setResponse(aiResponse);
    } catch (err) {
      setError(err.message || 'Произошла ошибка при обращении к AI');
      console.error('Gemini error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 m-4 border border-blue-100 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-3">AI Помощник</h3>
      
      <form onSubmit={handleSubmit} className="mb-3">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Спроси что-нибудь о питании..."
          className="w-full px-4 py-2 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#02ADFF] text-sm"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="w-full mt-2 bg-[#02ADFF] text-white font-bold py-2 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Думаю...' : 'Спросить'}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-xl text-sm mb-3">
          {error}
        </div>
      )}

      {response && (
        <div className="bg-[#F0F9FF] border border-blue-100 rounded-xl p-4 text-sm text-slate-700">
          <p className="whitespace-pre-wrap">{response}</p>
        </div>
      )}

      {!response && !error && (
        <p className="text-xs text-slate-400 text-center">
          Напишите вопрос, и AI помощник ответит вам
        </p>
      )}
    </div>
  );
}

