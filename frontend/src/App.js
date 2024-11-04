import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [generating, setGenerating] = useState(false);
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

  const invokeUrl = 'http://localhost:3001/generate-our-image-brotha';

  const generateImage = async () => {
    if (!text.trim()) {
      setError('Please enter a description');
      return;
    }

    const payload = {
      text_prompts: [
        {
          text: text,
          weight: 1
        },
        {
          text: "",
          weight: -1
        }
      ],
      cfg_scale: 5,
      sampler: "K_EULER_ANCESTRAL",
      seed: 0,
      steps: 25
    };

    try {
      setError('');
      setGenerating(true);
      setImage(null);
      
      const res = await axios.post(invokeUrl, payload);
      const imageData = res.data.artifacts[0].base64;
      setImage(`data:image/jpeg;base64,${imageData}`);
    } catch (error) {
      setError('Failed to generate image. Please try again.');
      console.error("Error generating image:", error);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image;
    link.download = `generated-image-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="app">
      <div className="container">
        <header>
          <h1>AI Image Generator</h1>
          <p>Transform your imagination into reality</p>
        </header>

        <div className="input-group">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Describe what you want to see..."
            className="text-input"
          />
          <button
            onClick={generateImage}
            disabled={generating}
            className={`generate-btn ${generating ? 'generating' : ''}`}
          >
            {generating ? (
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            ) : (
              'Generate Image'
            )}
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="image-section">
          {generating ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Creating your masterpiece...</p>
            </div>
          ) : image ? (
            <div className="image-container">
              <img src={image} alt="Generated artwork" className="generated-image" />
              <button onClick={handleDownload} className="download-btn">
                <svg 
                  className="download-icon" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download Image
              </button>
            </div>
          ) : (
            <div className="placeholder">
              <svg 
                className="placeholder-icon" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              <p>Your creation will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;