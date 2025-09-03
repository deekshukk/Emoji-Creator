import { useState } from "react";
import "./App.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [emojiUrl, setEmojiUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setEmojiUrl("");
    
    // Simulate API call delay
    setTimeout(() => {
      // For now, just show placeholder with a more interesting emoji
      setEmojiUrl("https://via.placeholder.com/150/00ffcc/000000?text=🎨");
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleGenerate();
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">EmojiMe</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Type emoji description... (e.g., 'happy cat with sunglasses')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={handleKeyPress}
          className="prompt-input"
          disabled={isLoading}
        />
        <button 
          onClick={handleGenerate} 
          className="generate-button"
          disabled={isLoading || !prompt.trim()}
        >
          {isLoading ? "Generating..." : "Generate"}
        </button>
      </div>
      <div className="emoji-display">
        {isLoading && (
          <div className="emoji-loading-placeholder">
            <div className="loading-spinner"></div>
            <p>Creating your emoji...</p>
          </div>
        )}
        {emojiUrl && !isLoading && (
          <img src={emojiUrl} alt="Generated Emoji" className="emoji-image" />
        )}
      </div>
    </div>
  );
}

export default App;
