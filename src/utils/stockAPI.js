const axios = require('axios');

// Fetch stock data from Alpha Vantage API
async function getStockData(symbol) {
  const API_KEY = 'D1IAGSQZI8E0GZ70';
  const url = `https://www.alphavantage.co/query`;

  try {
    const response = await axios.get(url, {
      params: {
        function: 'TIME_SERIES_INTRADAY',
        symbol: symbol,
        interval: '5min',
        apikey: API_KEY,
      }
    });

    return response.data['Time Series (5min)'];
  } catch (error) {
    throw new Error('Error fetching stock data');
  }
}

module.exports = { getStockData };
