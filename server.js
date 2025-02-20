const express = require('express');
const axios = require('axios');
const { analyzeSentiment } = require('./src/utils/sentimentAnalysis');
const { getStockData } = require('./src/utils/sentimentAnalysis');

const app = express();
const port = 3001;

app.use(express.json());

// Fetch latest news
app.get('/api/news', async (req, res) => {
  try {
    const news = await fetchNews();
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching news' });
  }
});

// Analyze sentiment of news
app.post('/api/analyze-sentiment', async (req, res) => {
  const { newsContent } = req.body;

  try {
    const sentiment = await analyzeSentiment(newsContent);
    res.json({ sentiment });
  } catch (err) {
    res.status(500).json({ error: 'Error analyzing sentiment' });
  }
});

// Get stock data
app.get('/api/stock', async (req, res) => {
  const { symbol } = req.query;

  try {
    const stockData = await getStockData(symbol);
    res.json(stockData);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching stock data' });
  }
});

// Decision-making based on sentiment and stock data
app.post('/api/make-trade-decision', async (req, res) => {
  const { sentiment, stockSymbol } = req.body;

  // Simple rule-based decision for demonstration
  let action = 'Hold';

  if (sentiment === 'positive') {
    action = 'Buy';
  } else if (sentiment === 'negative') {
    action = 'Sell';
  }

  res.json({ action });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
