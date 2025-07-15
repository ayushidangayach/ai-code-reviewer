import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import MarkdownViewer from "./components/MarkdownViewer";

// Inject required CSS for KaTeX and highlight.js at runtime
function injectContentStyles() {
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

const Modal = ({
  isOpen,
  onClose,
  review,
  loading,
}: {
  isOpen: boolean;
  onClose: () => void;
  review: string;
  loading: boolean;
}) => {
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
        {/* Header */}
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
              fontWeight: 600,
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
              fontWeight: 500,
            }}
          >
            Close
          </button>
        </div>

        {/* Loader */}
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
            />
            <span>Loading review...</span>
          </div>
        )}

        {/* Markdown Output */}
        {review && (
          <div style={{ maxHeight: "60vh", overflow: "auto" }}>
            <MarkdownViewer content={review} />
          </div>
        )}

        {/* CSS animation */}
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </div>
  );
};

const ReviewPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  const runReview = async () => {
    const url = window.location.href;

    setIsOpen(true);
    setLoading(true);
    setReview("");

    try {
      const res1 = await fetch(
        `http://localhost:3000/api/github-diff?url=${encodeURIComponent(url)}`
      );
      const json1 = await res1.json();

      if (!res1.ok || !json1.diff) throw new Error("Failed to fetch diff");

      const res2 = await fetch("http://localhost:3000/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diff: json1.diff }),
      });

      const json2 = await res2.json();
      if (!res2.ok || !json2.review) throw new Error("Failed to get review");

      setReview(json2.review);
    } catch (err) {
      setReview(
        `❌ Error: ${err instanceof Error ? err.message : "An error occurred"}`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    injectContentStyles();
    runReview();
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      review={review}
      loading={loading}
    />
  );
};

const injectReviewButton = () => {
  if (document.getElementById("ai-review-button")) return;

  const actionsBar = document.querySelector("div.gh-header-actions");
  if (!actionsBar) return;

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
    const container = document.createElement("div");
    container.id = "ai-review-modal-container";
    document.body.appendChild(container);
    ReactDOM.createRoot(container).render(<ReviewPopup />);
  };

  actionsBar.appendChild(button);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () =>
    setTimeout(injectReviewButton, 1500)
  );
} else {
  setTimeout(injectReviewButton, 1500);
}
