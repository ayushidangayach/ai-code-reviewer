import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import MarkdownViewer from "./components/MarkdownViewer";
import "./styles.css";

const Popup: React.FC = () => {
  const [url, setUrl] = useState("");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReview = async () => {
    if (!url.trim()) {
      setError("Please enter a GitHub PR URL");
      return;
    }

    setLoading(true);
    setError("");
    setReview("");

    try {
      // Fetch diff
      const diffRes = await fetch(
        `http://localhost:3000/api/github-diff?url=${encodeURIComponent(url)}`
      );
      const diffData = await diffRes.json();

      if (!diffRes.ok || !diffData.diff) {
        throw new Error(
          "Failed to fetch diff. Make sure the URL is valid and the backend is running."
        );
      }

      // Get AI review
      const reviewRes = await fetch(`http://localhost:3000/api/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diff: diffData.diff }),
      });

      const reviewData = await reviewRes.json();

      if (!reviewRes.ok || !reviewData.review) {
        throw new Error("Failed to get review. Please try again.");
      }

      setReview(reviewData.review);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleReview();
    }
  };

  return (
    <div className="w-96 max-h-96 overflow-y-auto p-4 bg-white">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        AI Review for PR
      </h3>

      <textarea
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Paste GitHub PR URL here..."
        className="w-full h-20 p-2 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      <button
        onClick={handleReview}
        disabled={loading}
        className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Reviewing..." : "Review with AI"}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
          ❌ {error}
        </div>
      )}

      {loading && (
        <div className="mt-4 flex items-center justify-center text-gray-600">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
          <span>Loading...</span>
        </div>
      )}

      {review && (
        <div className="mt-4">
          <MarkdownViewer content={review} />
        </div>
      )}
    </div>
  );
};

// Render the popup
const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<Popup />);
}
