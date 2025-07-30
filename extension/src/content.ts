import { BASE_URL } from "./constants";

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

class Modal {
  private modal!: HTMLDivElement;
  private isOpen: boolean = false;
  private onClose: () => void;
  private review: string = "";
  private loading: boolean = false;

  constructor(onClose: () => void) {
    this.onClose = onClose;
    this.createModal();
  }

  private createModal() {
    this.modal = document.createElement("div");
    this.modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 9999;
      display: none;
      align-items: center;
      justify-content: center;
    `;

    const modalContent = document.createElement("div");
    modalContent.style.cssText = `
      background-color: white;
      border-radius: 8px;
      padding: 24px;
      max-width: 700px;
      max-height: 80vh;
      overflow: auto;
      width: 90%;
      color: black;
    `;

    // Header
    const header = document.createElement("div");
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    `;

    const title = document.createElement("h3");
    title.textContent = "🔍 AI Code Review";
    title.style.cssText = `
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
    `;

    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.style.cssText = `
      background: #e11d48;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
    `;
    closeButton.onclick = () => this.close();

    header.appendChild(title);
    header.appendChild(closeButton);

    // Content container
    const contentContainer = document.createElement("div");
    contentContainer.style.cssText =
      "max-height: 60vh; overflow: auto; color: black;";
    contentContainer.id = "modal-content";

    modalContent.appendChild(header);
    modalContent.appendChild(contentContainer);

    // Add CSS animation
    const style = document.createElement("style");
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    modalContent.appendChild(style);

    this.modal.appendChild(modalContent);
    document.body.appendChild(this.modal);

    // Close on backdrop click
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });
  }

  open() {
    this.isOpen = true;
    this.modal.style.display = "flex";
  }

  close() {
    this.isOpen = false;
    this.modal.style.display = "none";
    this.onClose();
  }

  setLoading(loading: boolean) {
    this.loading = loading;
    this.updateContent();
  }

  setReview(review: string) {
    this.review = review;
    this.updateContent();
  }

  private updateContent() {
    const contentContainer = this.modal.querySelector("#modal-content");
    if (!contentContainer) return;

    contentContainer.innerHTML = "";

    if (this.loading) {
      const loadingDiv = document.createElement("div");
      loadingDiv.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        color: #6b7280;
      `;

      const spinner = document.createElement("div");
      spinner.style.cssText = `
        border: 2px solid #e5e7eb;
        border-top: 2px solid #3b82f6;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        animation: spin 1s linear infinite;
        margin-right: 8px;
      `;

      const loadingText = document.createElement("span");
      loadingText.textContent = "Loading review...";

      loadingDiv.appendChild(spinner);
      loadingDiv.appendChild(loadingText);
      contentContainer.appendChild(loadingDiv);
    } else if (this.review) {
      // Simple markdown rendering without heavy dependencies
      contentContainer.innerHTML = this.renderSimpleMarkdown(this.review);
    }
  }

  private renderSimpleMarkdown(text: string): string {
    // Simple markdown rendering without external libraries
    return text
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*)\*/gim, "<em>$1</em>")
      .replace(/```([\s\S]*?)```/gim, "<pre><code>$1</code></pre>")
      .replace(/`([^`]+)`/gim, "<code>$1</code>")
      .replace(/\n/gim, "<br>");
  }
}

class ReviewPopup {
  private modal: Modal;

  constructor() {
    this.modal = new Modal(() => {
      // Clean up modal container
      const container = document.getElementById("ai-review-modal-container");
      if (container) {
        container.remove();
      }
    });
    this.runReview();
  }

  private async runReview() {
    const url = window.location.href;

    this.modal.open();
    this.modal.setLoading(true);

    try {
      // Get the GitHub token from chrome storage
      const result = await new Promise<{ githubToken?: string }>((resolve) => {
        chrome.storage.sync.get(["githubToken"], resolve);
      });
      const githubToken = result.githubToken;

      if (!githubToken) {
        throw new Error(
          "GitHub token not found. Please set it in the extension popup."
        );
      }

      const res1 = await fetch(
        `${BASE_URL}api/github-diff?url=${encodeURIComponent(
          url
        )}&token=${encodeURIComponent(githubToken)}`
      );
      const json1 = await res1.json();

      if (!res1.ok || !json1.diff) throw new Error("Failed to fetch diff");

      const res2 = await fetch(`${BASE_URL}api/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diff: json1.diff }),
      });

      const json2 = await res2.json();
      if (!res2.ok || !json2.review) throw new Error("Failed to get review");

      this.modal.setReview(json2.review);
    } catch (err) {
      this.modal.setReview(
        `❌ Error: ${err instanceof Error ? err.message : "An error occurred"}`
      );
    } finally {
      this.modal.setLoading(false);
    }
  }
}

function injectReviewButton() {
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
    new ReviewPopup();
  };

  actionsBar.appendChild(button);
}

// Initialize content script
injectContentStyles();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () =>
    setTimeout(injectReviewButton, 1500)
  );
} else {
  setTimeout(injectReviewButton, 1500);
}
