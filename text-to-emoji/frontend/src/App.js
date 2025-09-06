import { useState } from "react";
import "./App.css";
import { Input, Button } from "@headlessui/react";

function App() {
  const [prompt, setPrompt] = useState("");
  const [emojiUrl, setEmojiUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const generateEmoji = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError("");
    setEmojiUrl("");

    try {
      const response = await fetch("http://127.0.0.1:5000/generate-emoji", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setEmojiUrl(data.image);
      } else {
        setError(data.error || "Failed to generate emoji");
      }
    } catch (err) {
      console.error("Error:", err);
      setError(
        "Failed to connect to server. Make sure the backend is running on port 5000."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const saveImage = () => {
    if (!emojiUrl) return;

    const link = document.createElement("a");
    link.href = emojiUrl;
    link.download = `emoji-${prompt.replace(/\s+/g, "-").toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="App">
      <header className="header">
        <h1 className="h1">AI Emoji Generator</h1>
        <p className="p">Create the emojis of your dreams.</p>
      </header>

      <div className="box">
        <Input
          className="custom-input"
          placeholder="Describe your emoji..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generateEmoji()}
        />
      </div>

      <Button
        className="custom-button"
        onClick={generateEmoji}
        disabled={isLoading || !prompt.trim()}
      >
        {isLoading ? "Generating..." : "Generate"}
      </Button>

      {error && <div className="error-message">{error}</div>}

      {emojiUrl && (
        <div className="emoji-result">
          <img
            src={emojiUrl}
            alt="Generated emoji"
            className="generated-emoji"
          />
          <Button className="save-button" onClick={saveImage}>
            Save Image
          </Button>
        </div>
      )}
    </div>
  );
}

export default App;
