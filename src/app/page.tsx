"use client";
import { useState } from "react";
import MarkdownDemo from "../components/MarkdownDemo";
import MarkdownViewer from "@/components/MarkdownViewer";

export default function Home() {
  const [diff, setDiff] = useState("");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDemo, setShowDemo] = useState(false);

  const mockDiffs: Record<string, string> = {
    mathUtils: `diff --git a/utils/math.js b/utils/math.js
index e69de29..b6fc4c2 100644
--- a/utils/math.js
+++ b/utils/math.js
@@ -0,0 +1,10 @@
+export function add(a, b) {
+  return a + b;
+}
+
+export function subtract(a, b) {
+  return a - b;
+}
+
+export function divide(a, b) {
+  return a / b;
+}`,
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
    const parts = review.split(
      /(?=1\. Provide a high-level summary|2\. Identify any potential issues|3\. Suggest inline comments)/gi
    );

    return parts.map((part, i) => (
      <div key={i} className="my-4 border-l-4 border-blue-500 p-4 rounded">
        <MarkdownViewer content={part.trim()} />
      </div>
    ));
  };

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">AI Code Reviewer</h1>

      <div className="mb-4 flex gap-2 items-center">
        <button
          onClick={() => setShowDemo(!showDemo)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {showDemo ? "Hide Demo" : "Show Markdown Demo"}
        </button>

        <select
          onChange={(e) => setDiff(mockDiffs[e.target.value] || "")}
          className="border rounded p-2"
        >
          <option value="">Select a dummy PR</option>
          <option value="mathUtils">Math Utils PR</option>
        </select>
      </div>

      {showDemo && <MarkdownDemo />}

      <textarea
        value={diff}
        onChange={(e) => setDiff(e.target.value)}
        rows={12}
        className="w-full border p-3 rounded mb-4 font-mono text-sm"
        placeholder="Paste your GitHub PR diff here..."
      />

      <button
        onClick={handleReview}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {loading ? "Reviewing..." : "Review with AI"}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {review && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">AI Review Output:</h2>
          {renderMarkdownSections()}
        </div>
      )}
    </main>
  );
}
