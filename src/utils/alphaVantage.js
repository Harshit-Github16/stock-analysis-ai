// utils/alphaVantage.js
import AlphaVantage from 'alpha-vantage';

const alphaVantage = new AlphaVantage({ key: "D1IAGSQZI8E0GZ70" }); // Store API key securely!

async function getStockPrice(symbol) {
  try {
    const data = await alphaVantage.timeSeries.dailyAdjusted({
      symbol: symbol,
      outputsize: 'compact', // or 'full' for more data
    });

    // Alpha Vantage's data structure is a bit nested.  You'll likely need to process it.
    const timeSeries = data['Time Series (Daily)'];
    const latestDate = Object.keys(timeSeries)[0]; // Get the latest date
    const latestPrice = timeSeries[latestDate]['4. close']; // Get the closing price

    return { date: latestDate, price: latestPrice }; // Return an object with date and price
  } catch (error) {
    console.error("Error fetching data from Alpha Vantage:", error);
    return null;
  }
}

async function getNewsSentiment(symbol) {
  try {
    const data = await alphaVantage.newsSentiment({
        symbol: symbol,
        //time_from: '2023-10-26T15:00:00', // Optional: Filter by time
        //time_to: '2023-10-27T15:00:00',   // Optional: Filter by time
        limit: 5, // Optional: Limit the number of news items
    });
    return data.feed; // Return the news feed
  } catch (error) {
    console.error("Error fetching news sentiment from Alpha Vantage:", error);
    return null;
  }
}

export { getStockPrice, getNewsSentiment };