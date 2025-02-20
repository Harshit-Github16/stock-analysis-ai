import { Configuration, OpenAIApi } from "openai";
import axios from 'axios';

// Setup OpenAI API
const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY
}));

// Function to fetch stock data (replace this with your preferred stock API)
async function fetchStockData(stockSymbol) {
  const response = await axios.get(`https://api.example.com/stock/${stockSymbol}/prices`);
  return response.data;  // Returns stock prices data
}

async function analyzeSentiment(newsText) {
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Analyze the sentiment of this news: "${newsText}"`,
      max_tokens: 60,
    });

    return completion.data.choices[0].text.trim();
  } catch (error) {
    console.error("Error in analyzing sentiment:", error);
    return null;
  }
}

async function checkStockImpact(req, res) {
  if (req.method === "POST") {
    const { newsText, stockSymbol } = req.body;

    if (!newsText || !stockSymbol) {
      return res.status(400).json({ error: "Please provide both newsText and stockSymbol" });
    }

    try {
      // Analyze news sentiment
      const sentiment = await analyzeSentiment(newsText);

      // Fetch historical stock data before and after the news
      const stockData = await fetchStockData(stockSymbol);

      // Here we can compare stock data over time, e.g., checking the price before and after the news was published
      const stockImpact = evaluateStockImpact(stockData, sentiment);
      
      return res.status(200).json({
        sentiment,
        stockImpact,
      });

    } catch (error) {
      console.error("Error in checkStockImpact:", error);
      return res.status(500).json({ error: "Error processing the request" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}

// Function to evaluate stock impact based on sentiment and stock data
function evaluateStockImpact(stockData, sentiment) {
  // Implement logic to evaluate the stock impact, for example:
  if (sentiment.includes("positive") && stockData.priceChange > 0) {
    return "Stock price increased due to positive news.";
  } else if (sentiment.includes("negative") && stockData.priceChange < 0) {
    return "Stock price decreased due to negative news.";
  } else {
    return "No significant stock price change detected.";
  }
}

export default checkStockImpact;
