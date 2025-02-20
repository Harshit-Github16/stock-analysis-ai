'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
    const [articles, setArticles] = useState([]);
    const [analysis, setAnalysis] = useState({});
    const [error, setError] = useState(null);
    const NewsApiKey = "9537577f8e684c0dbdf791869fbbbea0"; 

    useEffect(() => {
        const fetchNews = async () => {
            const today = new Date();
            const twoDaysAgo = new Date(today);
            twoDaysAgo.setDate(today.getDate() - 25);

            const formattedTwoDaysAgo = twoDaysAgo.toISOString().split('T')[0];

            try {
                const response = await axios.get(
                    `https://newsapi.org/v2/everything?q=stocks+finance+IPO&from=${formattedTwoDaysAgo}&apiKey=${NewsApiKey}`
                );
                setArticles(response.data.articles);

                // Analyze each article after fetching
                response.data.articles.forEach((article) => analyzeImpact(article));
            } catch (err) {
                console.error('Error fetching news:', err);
                setError('Failed to fetch news. Please check your API key.');
            }
        };


// const fetchNewssecond = async () => {
//     try {
//       const res = await axios.get('https://newsdata.io/api/1/sources', {
//         params: {
//           apikey: 'YOUR_API_KEY', // Replace with your API key
//           q: 'finance, stock market,', // Searching for finance and stock market-related news
//           language: 'en',
//           country: 'us', // Optional: Set to your preferred country
//         },
//       });
  
//       setArticles(res.data)
//     } catch (error) {
//       console.error('Error fetching news:', error);
//       return { error: 'Error fetching news' };
//     }
//   };

        // Fetch news initially and every 5 minutes
        fetchNews();
        // fetchNewssecond()
        const intervalId = setInterval(fetchNews, 5 * 60 * 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    const analyzeImpact = async (article) => {
        if (analysis[article.url]) return;

        if(article.description){
            try {
                const response = await axios.post('/api/analyze', {
                    description: article.description
                });

                const { label, score, rating } = response.data;

                setAnalysis((prev) => ({
                    ...prev,
                    [article.url]: { sentiment: label, score, rating },
                }));
            } catch (err) {
                console.error('Error analyzing impact:', err);
                setError('Failed to analyze impact. Please check the article text and model.');
            }
        }
    };

    const truncateTitle = (title, length) => {
        return title.length > length ? title.substring(0, length) + '...' : title;
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container-fuild mx-auto px-4">
                <h1 className="text-4xl text-center font-bold text-gray-800 mb-8">Latest Financial News</h1>
                {error && <p className="text-center text-red-600">{error}</p>}
                <div className="articles-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {articles.map((article) => (
                        <div key={article.url} className="article-card bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <img
                                src={article.urlToImage}
                                alt={article.title}
                                className="article-image w-full h-48 object-cover rounded-md mb-4"
                            />
                            <div className="article-content">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-2">{truncateTitle(article.title, 30)}</h2>
                                <p className="text-gray-600 mb-4">{article.description}</p>
                                <p className="text-gray-500 text-sm mb-2">
                                    <strong>Source:</strong> {article.source.name}
                                </p>
                                <p className="text-gray-500 text-sm mb-4">
                                    <strong>Published At:</strong> {new Date(article.publishedAt).toLocaleDateString()}
                                </p>
                                <a
                                    href={article.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-700 mb-4 inline-block"
                                >
                                    Read full article
                                </a>
                                {analysis[article.url] && (
                                    <div className="mt-4 text-gray-700">
                                        <p>
                                            <strong>Sentiment:</strong> {analysis[article.url].sentiment}
                                        </p>
                                        <p>
                                            <strong>Score:</strong> {analysis[article.url].score}
                                        </p>
                                        <p>
                                            <strong>Rating:</strong> {analysis[article.url].rating}/10
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
