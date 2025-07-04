/// <reference types="chrome" />
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import MarkdownViewer from "./components/MarkdownViewer";

// Modal component for content script
const ReviewModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  review: string;
  loading: boolean;
}> = ({ isOpen, onClose, review, loading }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "24px",
          maxWidth: "700px",
          maxHeight: "80vh",
          overflow: "auto",
          width: "90%",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: "600",
              color: "#1f2937",
            }}
          >
            🔍 AI Code Review
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "#e11d48",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            Close
          </button>
        </div>

        {loading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              color: "#6b7280",
            }}
          >
            <div
              style={{
                border: "2px solid #e5e7eb",
                borderTop: "2px solid #3b82f6",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                animation: "spin 1s linear infinite",
                marginRight: "8px",
              }}
            ></div>
            <span>Loading review...</span>
          </div>
        )}

        {review && (
          <div style={{ maxHeight: "60vh", overflow: "auto" }}>
            <MarkdownViewer content={review} />
          </div>
        )}

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

// Main content script component
const ContentScript: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReview = async () => {
    const prUrl = window.location.href;
    setIsModalOpen(true);
    setLoading(true);
    setReview("");

    try {
      // Fetch diff
      const diffRes = await fetch(
        `http://localhost:3000/api/github-diff?url=${encodeURIComponent(prUrl)}`
      );
      const diffData = await diffRes.json();

      if (!diffRes.ok || !diffData.diff) {
        throw new Error("Failed to fetch diff");
      }

      // Get AI review
      const reviewRes = await fetch(`http://localhost:3000/api/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diff: diffData.diff }),
      });

      const reviewData = await reviewRes.json();

      if (!reviewRes.ok || !reviewData.review) {
        throw new Error("Failed to get review");
      }

      setReview(reviewData.review);
    } catch (err) {
      setReview(
        `❌ Error: ${err instanceof Error ? err.message : "An error occurred"}`
      );
    } finally {
      setLoading(false);
    }
  };

  // Start review when component mounts
  React.useEffect(() => {
    handleReview();
  }, []);

  return (
    <ReviewModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      review={review}
      loading={loading}
    />
  );
};

// Inject button into GitHub PR page
function injectButton() {
  if (document.getElementById("ai-review-button")) return;

  const target = document.querySelector("div.gh-header-actions");
  if (!target) return;

  const button = document.createElement("button");
  button.id = "ai-review-button";
  button.innerText = "💡 Review with AI";
  button.style.cssText = `
    margin-left: 10px; 
    padding: 6px 12px; 
    background-color: #2c974b; 
    color: white; 
    border: none; 
    border-radius: 4px; 
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
  `;

  button.onclick = () => {
    // Create modal container and render React component
    const modalContainer = document.createElement("div");
    modalContainer.id = "ai-review-modal-container";
    document.body.appendChild(modalContainer);

    const root = createRoot(modalContainer);
    root.render(<ContentScript />);
  };

  target.appendChild(button);
}

function injectStyle(href: string) {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = chrome.runtime.getURL(href);
  document.head.appendChild(link);
}

// Inject all needed CSS
injectStyle("assets/MarkdownViewer-*.css"); // Use the actual filename from your build
injectStyle("assets/KaTeX_*.css"); // For KaTeX
injectStyle("assets/highlight*.css"); // For highlight.js

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(injectButton, 1500);
  });
} else {
  setTimeout(injectButton, 1500);
}
