"use client";

import { useState } from "react";
import MarkdownViewer from "@/components/MarkdownViewer";

export default function Home() {
  const [prUrl, setPrUrl] = useState("");
  const [diff, setDiff] = useState("");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPRDiff = async () => {
    try {
      setError("");
      const res = await fetch(
        `/api/github-diff?url=${encodeURIComponent(prUrl)}`
      );
      const data = await res.json();

      if (!res.ok || !data.diff) {
        setError(data.error || "Failed to fetch diff");
        return;
      }

      setDiff(data.diff);
      setReview("");
    } catch {
      setError("Error fetching PR diff");
    }
  };

  const handleReview = async () => {
    if (!diff.trim()) {
      setError("Please enter a diff to review");
      return;
    }

    setLoading(true);
    setError("");
    setReview("");

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diff }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to get review");
        return;
      }

      setReview(data.review);
    } catch {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const renderMarkdownSections = () => {
    const sections = review.split(
      /(?=1\. Provide a high-level summary|2\. Identify any potential issues|3\. Suggest inline comments)/gi
    );

    return sections.map((section, i) => (
      <div
        key={i}
        className="my-4 border-l-4 border-blue-600 bg-white dark:bg-gray-900 p-4 shadow-sm rounded-md"
      >
        <MarkdownViewer content={section.trim()} />
      </div>
    ));
  };

  return (
    <main className="p-6 max-w-4xl mx-auto text-gray-800 dark:text-gray-100">
      <h1 className="text-3xl font-extrabold mb-8 text-center text-blue-700 dark:text-blue-400">
        🚀 AI Code Reviewer
      </h1>

      {/* PR Input Section */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">
          🔗 Load GitHub Pull Request
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Paste GitHub PR URL here..."
            value={prUrl}
            onChange={(e) => setPrUrl(e.target.value)}
            className="flex-1 p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-700"
          />
          <button
            onClick={fetchPRDiff}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-md transition"
          >
            Load Diff
          </button>
        </div>
      </section>

      {/* Diff Editor */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">📝 PR Diff Editor</h2>
        <textarea
          value={diff}
          onChange={(e) => setDiff(e.target.value)}
          rows={12}
          className="w-full p-3 border rounded font-mono text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-700"
          placeholder="Paste or load a GitHub PR diff here..."
        />
      </section>

      {/* Review Button */}
      <div className="mb-6">
        <button
          onClick={handleReview}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold disabled:bg-gray-400 transition shadow-lg"
        >
          {loading ? "Reviewing..." : "🔍 Review with AI"}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded shadow">
          {error}
        </div>
      )}

      {/* AI Review Output */}
      {review && (
        <section className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-300">
            🧠 AI Review Output
          </h2>
          {renderMarkdownSections()}
        </section>
      )}
    </main>
  );
}
