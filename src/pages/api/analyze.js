import { pipeline } from '@huggingface/transformers';

let classifier;

const loadModel = async () => {
    if (!classifier) {
        classifier = await pipeline('sentiment-analysis');
    }
    return classifier;
};

const getRating = (score) => {
    // Map score (0-1) to a 0-10 scale
    return Math.round(score * 10);
};

export default async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    const { description } = req.body;

    if (!description) {
        return res.status(400).json({ error: 'Description is required' });
    }

    try {
        const classifier = await loadModel();
        const result = await classifier(description);
        const rating = getRating(result[0].score); // Calculate rating
        res.status(200).json({ ...result[0], rating });
    } catch (error) {
        console.error('Error analyzing sentiment:', error);
        res.status(500).json({ error: 'Failed to analyze sentiment' });
    }
};