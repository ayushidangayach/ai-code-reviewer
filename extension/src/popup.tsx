import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import MarkdownViewer from "./components/MarkdownViewer";

// Inject required CSS for KaTeX and highlight.js at runtime
function injectPopupStyles() {
  const cssLinks = [
    "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css",
    "https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github.min.css",
  ];
  cssLinks.forEach((href) => {
    if (!document.querySelector(`link[href='${href}']`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.type = "text/css";
      link.href = href;
      document.head.appendChild(link);
    }
  });
}

// Inline styles to avoid external CSS dependencies
const styles = {
  container: {
    width: "384px",
    maxHeight: "384px",
    overflowY: "auto" as const,
    padding: "16px",
    backgroundColor: "white",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  title: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "16px",
    margin: "0 0 16px 0",
  },
  textarea: {
    width: "100%",
    height: "80px",
    padding: "8px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    resize: "none" as const,
    fontFamily: "inherit",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    marginTop: "12px",
    padding: "8px 16px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
  },
  buttonDisabled: {
    backgroundColor: "#9ca3af",
    cursor: "not-allowed",
  },
  error: {
    marginTop: "16px",
    padding: "12px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "6px",
    color: "#dc2626",
    fontSize: "14px",
  },
  loading: {
    marginTop: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#6b7280",
    fontSize: "14px",
  },
  spinner: {
    border: "2px solid #e5e7eb",
    borderTop: "2px solid #2563eb",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    animation: "spin 1s linear infinite",
    marginRight: "8px",
  },
  reviewContainer: {
    marginTop: "16px",
  },
};

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
    <div style={styles.container}>
      <h3 style={styles.title}>AI Review for PR</h3>

      <textarea
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Paste GitHub PR URL here..."
        style={styles.textarea}
      />

      <button
        onClick={handleReview}
        disabled={loading}
        style={{
          ...styles.button,
          ...(loading ? styles.buttonDisabled : {}),
        }}
      >
        {loading ? "Reviewing..." : "Review with AI"}
      </button>

      {error && <div style={styles.error}>❌ {error}</div>}

      {loading && (
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <span>Loading...</span>
        </div>
      )}

      {review && (
        <div style={styles.reviewContainer}>
          <MarkdownViewer content={review} />
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

// Create container and render the popup
const createPopupContainer = () => {
  // Remove any existing container
  const existingContainer = document.getElementById("popup-root");
  if (existingContainer) {
    existingContainer.remove();
  }

  // Create new container
  const container = document.createElement("div");
  container.id = "popup-root";
  document.body.appendChild(container);

  return container;
};

// Initialize popup when script loads
const container = createPopupContainer();
const root = createRoot(container);
injectPopupStyles(); // Inject required CSS
root.render(<Popup />);
