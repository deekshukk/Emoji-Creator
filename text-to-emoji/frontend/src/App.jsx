
import { useState } from "react";
import { Input, Button } from "@headlessui/react";
import "./App.css"

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
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500">
      <header className="flex flex-col items-center text-gray-100">
        <h1 className="pb-4 font-semibold text-5xl">AI Emoji Generator</h1>
        <p className="text-base">Create the emojis of your dreams.</p>
      </header>

      <div className="pb-5 pt-8">
        <Input
          className="mt-3 w-[500px] rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white/25 focus:ring-offset-0"
          placeholder="Describe your emoji..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generateEmoji()}
        />
      </div>

      <Button
        className="bg-white/5 px-3 py-1.5 text-sm text-white border-none rounded-lg transition-colors hover:bg-white/10 disabled:opacity-50"
        onClick={generateEmoji}
        disabled={isLoading || !prompt.trim()}
      >
        {isLoading ? "Generating..." : "Generate"}
      </Button>

      {error && (
        <div className="text-red-400 mt-4 px-4 py-2 bg-red-400/10 rounded-lg border border-red-400/30 text-center">
          {error}
        </div>
      )}

      {emojiUrl && (
        <div className="mt-8 flex flex-col justify-center items-center gap-4 relative z-10">
          <img
            src={emojiUrl}
            alt="Generated emoji"
            className="max-w-[200px] max-h-[200px] rounded-2xl shadow-2xl transition-transform hover:scale-105"
          />
          <Button 
            className="bg-white/10 px-4 py-2 text-sm text-white border border-white/20 rounded-lg cursor-pointer transition-all flex items-center gap-2 hover:bg-white/20 hover:border-white/40 hover:-translate-y-0.5" 
            onClick={saveImage}
          >
            Save Image
          </Button>
        </div>
      )}
    </div>
  );
}

export default App;
