const axios = require('axios');

// Analyze sentiment using Hugging Face API
async function analyzeSentiment(newsContent) {
  const HUGGINGFACE_API_KEY = 'YOUR_HUGGINGFACE_API_KEY';
  const url = 'https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english';

  try {
    const response = await axios.post(url, {
      inputs: newsContent
    }, {
      headers: {
        'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`
      }
    });

    // Assuming the response returns sentiment as "LABEL_1" for negative and "LABEL_2" for positive
    const sentiment = response.data[0].label === 'LABEL_1' ? 'negative' : 'positive';
    return sentiment;
  } catch (error) {
    throw new Error('Error analyzing sentiment');
  }
}

module.exports = { analyzeSentiment };
