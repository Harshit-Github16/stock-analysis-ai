import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const analyzeStockImpact = async (newsContent) => {
  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4', // Using GPT-4 model for analysis
      messages: [
        { role: 'system', content: 'You are a financial news analyst.' },
        { role: 'user', content: `Can this news affect stock prices? Analyze: ${newsContent}` },
      ],
    });

    return response.data.choices[0].message.content; // Return the AI analysis
  } catch (error) {
    console.error('Error analyzing stock impact:', error);
    return 'Unable to analyze at this moment.';
  }
};
