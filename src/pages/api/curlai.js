export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // 1. Forward the request to Curl AI (replace with your actual API endpoint and key)
      const curlaiApiKey = process.env.CURLAI_API_KEY; // Store API key securely!
      const curlaiApiUrl = 'YOUR_CURLAI_API_ENDPOINT'; // Replace with your Curl AI endpoint

      const curlaiResponse = await fetch(curlaiApiUrl, {
        method: 'POST', // Or GET, depending on your Curl AI API
        headers: {
          'Content-Type': 'application/json', // Adjust if needed
          'Authorization': `Bearer ${curlaiApiKey}`, // Or however Curl AI auth works
          // ... other headers as needed
        },
        body: JSON.stringify(req.body), // Forward the request body
      });

      if (!curlaiResponse.ok) {
        const errorData = await curlaiResponse.json(); // Get error details if available
        throw new Error(`Curl AI API error: ${curlaiResponse.status} - ${JSON.stringify(errorData)}`);
      }

      const curlaiData = await curlaiResponse.json();

      // 2. Send the Curl AI response back to the client
      res.status(200).json(curlaiData);

    } catch (error) {
      console.error("Error proxying Curl AI request:", error);
      res.status(500).json({ error: error.message }); // Send error response
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' }); // Only POST is allowed
  }
}