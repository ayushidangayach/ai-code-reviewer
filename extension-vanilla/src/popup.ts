import { MarkdownViewer } from "./components/MarkdownViewer";

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

class Popup {
  private urlInput: HTMLTextAreaElement;
  private reviewButton: HTMLButtonElement;
  private errorDiv: HTMLDivElement;
  private loadingDiv: HTMLDivElement;
  private reviewContainer: HTMLDivElement;
  private loading: boolean = false;

  constructor() {
    this.createUI();
    this.attachEventListeners();
    injectPopupStyles();
  }

  private createUI() {
    const container = document.createElement("div");
    Object.assign(container.style, styles.container);

    // Title
    const title = document.createElement("h3");
    title.textContent = "AI Review for PR";
    Object.assign(title.style, styles.title);
    container.appendChild(title);

    // Textarea
    this.urlInput = document.createElement("textarea");
    this.urlInput.placeholder = "Paste GitHub PR URL here...";
    Object.assign(this.urlInput.style, styles.textarea);
    container.appendChild(this.urlInput);

    // Button
    this.reviewButton = document.createElement("button");
    this.reviewButton.textContent = "Review with AI";
    Object.assign(this.reviewButton.style, styles.button);
    container.appendChild(this.reviewButton);

    // Error div
    this.errorDiv = document.createElement("div");
    Object.assign(this.errorDiv.style, styles.error);
    this.errorDiv.style.display = "none";
    container.appendChild(this.errorDiv);

    // Loading div
    this.loadingDiv = document.createElement("div");
    Object.assign(this.loadingDiv.style, styles.loading);
    this.loadingDiv.style.display = "none";

    const spinner = document.createElement("div");
    Object.assign(spinner.style, styles.spinner);
    this.loadingDiv.appendChild(spinner);

    const loadingText = document.createElement("span");
    loadingText.textContent = "Loading...";
    this.loadingDiv.appendChild(loadingText);

    container.appendChild(this.loadingDiv);

    // Review container
    this.reviewContainer = document.createElement("div");
    Object.assign(this.reviewContainer.style, styles.reviewContainer);
    container.appendChild(this.reviewContainer);

    // Add CSS animation
    const style = document.createElement("style");
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    container.appendChild(style);

    document.body.appendChild(container);
  }

  private attachEventListeners() {
    this.urlInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.handleReview();
      }
    });

    this.reviewButton.addEventListener("click", () => {
      this.handleReview();
    });
  }

  private async handleReview() {
    const url = this.urlInput.value.trim();

    if (!url) {
      this.showError("Please enter a GitHub PR URL");
      return;
    }

    this.setLoading(true);
    this.hideError();
    this.clearReview();

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

      this.showReview(reviewData.review);
    } catch (err) {
      this.showError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      this.setLoading(false);
    }
  }

  private setLoading(loading: boolean) {
    this.loading = loading;
    this.reviewButton.disabled = loading;
    this.reviewButton.textContent = loading ? "Reviewing..." : "Review with AI";

    if (loading) {
      Object.assign(this.reviewButton.style, styles.buttonDisabled);
      this.loadingDiv.style.display = "flex";
    } else {
      Object.assign(this.reviewButton.style, styles.button);
      this.loadingDiv.style.display = "none";
    }
  }

  private showError(message: string) {
    this.errorDiv.textContent = `❌ ${message}`;
    this.errorDiv.style.display = "block";
  }

  private hideError() {
    this.errorDiv.style.display = "none";
  }

  private clearReview() {
    this.reviewContainer.innerHTML = "";
  }

  private showReview(review: string) {
    this.clearReview();
    const markdownViewer = MarkdownViewer.create(this.reviewContainer);
    markdownViewer.render(review);
  }
}

// Initialize popup when script loads
new Popup();
