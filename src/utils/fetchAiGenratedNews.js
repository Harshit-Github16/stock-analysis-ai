import axios from "axios";

// import axios from 'axios'
// const OPENAI_API_KEY = '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'; // Replace with your actual OpenAI API key



export const fetchAIGeneratedNews = async (topic) => {
    const prompt = `Generate a news article about ${topic}.`;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',  // Corrected URL
            {
                model: 'gpt-3.5-turbo',  // Using the correct model
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 150,
                temperature: 0.7,
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const article = response.data.choices[0].message.content.trim();
        return article;
    } catch (error) {
        console.error('Error fetching AI-generated news:', error);
        throw new Error('Failed to fetch AI-generated news.');
    }
};
