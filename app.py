from flask import Flask, request, jsonify
from transformers import pipeline

app = Flask(__name__)
classifier = pipeline('sentiment-analysis')

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    description = data.get('description', '')
    if not description:
        return jsonify({'error': 'Description is required'}), 400

    result = classifier(description)
    return jsonify(result[0])

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)