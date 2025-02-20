import { fetchNews } from '../../lib/fetchNews';
import { analyzeStockImpact } from '../../lib/aiAgent';
import cron from 'node-cron';

export default function handler(req, res) {
  // Cron job to run every 1 minute
  cron.schedule('* * * * *', async () => {
    console.log('Fetching latest news and analyzing impact...');

    try {
      // Step 1: Fetch the latest news articles
      const articles = await fetchNews();
      
      // Step 2: Analyze each article to check if it can affect stock prices
      const analysisResults = await Promise.all(
        articles.map(async (article) => {
          const analysis = await analyzeStockImpact(article.description || article.content);
          return {
            title: article.title,
            analysis,
          };
        })
      );

      // Log the analysis results (you can save these results in a database or process further)
      console.log('Analysis Results:', analysisResults);
    } catch (error) {
      console.error('Error fetching or analyzing news:', error);
    }
  });

  // Return a success message (you can remove this if you don't need to send a response)
  res.status(200).json({ message: 'Scheduler set up to fetch and analyze news every minute.' });
}
