import axios from 'axios';

const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines';

export const fetchNews = async () => {
  try {
    const res = await axios.get(NEWS_API_URL, {
      params: {
        country: 'us', // You can change this to your desired country
        apiKey: process.env.NEXT_PUBLIC_NEWS_API_KEY,
      },
    });

    return res.data.articles; // Returns an array of articles
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};
