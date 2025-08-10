// server/src/providers/llm.provider.js
import { CohereClient } from 'cohere-ai';
import axios from 'axios';
import config from '../config/index.js';

// Initialize Cohere client
const cohere = new CohereClient({
  token: config.cohereKey,
});

/**
 * Generates text from the configured LLM provider.
 * Supports Cohere (via SDK) and OpenAI (via REST API).
 */
export const generateFromPrompt = async (prompt) => {
  const provider = config.llmProvider;

  // ---- Mock mode for missing keys ----
  if (provider === 'cohere' && !config.cohereKey) {
    console.warn('Cohere key missing — returning mock response');
    return JSON.stringify({
      questions: [
        { id: 'q1', question: 'Mock: What is 2 + 2?', options: ['1', '2', '3', '4'], answer: '4' },
        { id: 'q2', question: 'Mock: Select the color of sky', options: ['Blue', 'Green', 'Red', 'Black'], answer: 'Blue' },
      ],
    });
  }
  if (provider === 'openai' && !config.openaiKey) {
    console.warn('OpenAI key missing — returning mock response');
    return JSON.stringify({
      questions: [
        { id: 'q1', question: 'Mock: Who wrote Hamlet?', options: ['Shakespeare', 'Austen', 'Dickens', 'Tolkien'], answer: 'Shakespeare' },
      ],
    });
  }

  // ---- Cohere via SDK ----
  if (provider === 'cohere') {
    try {
      const response = await cohere.generate({
        model: config.cohereModel,
        prompt,
        maxTokens: config.maxTokens || 500,
        temperature: 0.2,
      });

      return response.generations?.[0]?.text?.trim() || '';
    } catch (err) {
      console.error('Cohere generation error:', err.message);
      throw err;
    }
  }

  // ---- OpenAI via REST ----
  if (provider === 'openai') {
    try {
      const url = 'https://api.openai.com/v1/chat/completions';
      const body = {
        model: config.openaiModel,
        messages: [
          { role: 'system', content: 'You are a quiz generator.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: config.maxTokens,
        temperature: 0.2,
      };
      const res = await axios.post(url, body, {
        headers: {
          Authorization: `Bearer ${config.openaiKey}`,
          'Content-Type': 'application/json',
        },
      });
      return res.data?.choices?.[0]?.message?.content || '';
    } catch (err) {
      console.error('OpenAI generation error:', err.message);
      throw err;
    }
  }

  throw new Error(`Unsupported LLM provider: ${provider}`);
};
