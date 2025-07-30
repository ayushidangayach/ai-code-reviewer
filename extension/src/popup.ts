// Popup script for the extension
document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("app");
  if (!container) return;

  // Create the popup UI
  container.innerHTML = `
    <div style="padding: 16px; min-width: 300px;">
      <h2 style="margin: 0 0 16px 0; font-size: 18px; color: #1f2937;">
        🔍 AI Code Reviewer
      </h2>
      
      <div style="margin-bottom: 16px;">
        <label for="github-token" style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151;">
          GitHub Personal Access Token:
        </label>
        <input 
          type="password" 
          id="github-token" 
          placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
          style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-family: monospace; font-size: 14px; box-sizing: border-box;"
        >
        <p style="margin: 8px 0 0 0; font-size: 12px; color: #6b7280;">
          <a href="https://github.com/settings/tokens" target="_blank" style="color: #3b82f6; text-decoration: none;">
            Create a token here
          </a>
          <span> (requires 'repo' scope for private repos)</span>
        </p>
      </div>

      <div style="margin-bottom: 16px;">
        <button id="save-token" style="background: #2c974b; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 500; margin-right: 8px;">
          Save Token
        </button>
        <button id="test-token" style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 500;">
          Test Token
        </button>
      </div>

      <div id="status" style="margin-top: 12px; padding: 8px; border-radius: 4px; display: none;"></div>

      <div style="border-top: 1px solid #e5e7eb; margin-top: 16px; padding-top: 16px;">
        <h3 style="margin: 0 0 8px 0; font-size: 14px; color: #374151;">How to use:</h3>
        <ol style="margin: 0; padding-left: 16px; font-size: 12px; color: #6b7280; line-height: 1.5;">
          <li>Enter your GitHub token above and click "Save Token"</li>
          <li>Go to any GitHub PR page</li>
          <li>Click the "💡 Review with AI" button</li>
          <li>Wait for the AI review to complete</li>
        </ol>
      </div>
    </div>
  `;

  // Load existing token
  chrome.storage.sync.get(
    ["githubToken"],
    function (result: { githubToken?: string }) {
      const tokenInput = document.getElementById(
        "github-token"
      ) as HTMLInputElement;
      if (tokenInput && result.githubToken) {
        tokenInput.value = result.githubToken;
      }
    }
  );

  // Save token button
  document.getElementById("save-token")?.addEventListener("click", function () {
    const tokenInput = document.getElementById(
      "github-token"
    ) as HTMLInputElement;
    const token = tokenInput.value.trim();

    if (!token) {
      showStatus("Please enter a GitHub token", "error");
      return;
    }

    chrome.storage.sync.set({ githubToken: token }, function () {
      showStatus("Token saved successfully!", "success");
    });
  });

  // Test token button
  document.getElementById("test-token")?.addEventListener("click", function () {
    const tokenInput = document.getElementById(
      "github-token"
    ) as HTMLInputElement;
    const token = tokenInput.value.trim();

    if (!token) {
      showStatus("Please enter a GitHub token first", "error");
      return;
    }

    showStatus("Testing token...", "info");

    // Test the token by making a simple API call
    fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Invalid token");
        }
      })
      .then((data) => {
        showStatus(`Token is valid! Logged in as: ${data.login}`, "success");
      })
      .catch(() => {
        showStatus(
          "Invalid token. Please check your token and try again.",
          "error"
        );
      });
  });

  function showStatus(message: string, type: "success" | "error" | "info") {
    const statusDiv = document.getElementById("status");
    if (!statusDiv) return;

    statusDiv.style.display = "block";
    statusDiv.textContent = message;

    // Set color based on type
    switch (type) {
      case "success":
        statusDiv.style.backgroundColor = "#d1fae5";
        statusDiv.style.color = "#065f46";
        statusDiv.style.border = "1px solid #a7f3d0";
        break;
      case "error":
        statusDiv.style.backgroundColor = "#fee2e2";
        statusDiv.style.color = "#991b1b";
        statusDiv.style.border = "1px solid #fca5a5";
        break;
      case "info":
        statusDiv.style.backgroundColor = "#dbeafe";
        statusDiv.style.color = "#1e40af";
        statusDiv.style.border = "1px solid #93c5fd";
        break;
    }
  }
});
