document.getElementById("reviewBtn").addEventListener("click", async () => {
    const url = document.getElementById("urlInput").value.trim();
    const output = document.getElementById("output");
    output.innerText = "⏳ Fetching diff...";
  
    try {
      const diffRes = await fetch(`http://localhost:3000/api/github-diff?url=${encodeURIComponent(url)}`);
      const diffData = await diffRes.json();
  
      if (!diffRes.ok || !diffData.diff) {
        output.innerText = "❌ Failed to fetch diff";
        return;
      }
  
      output.innerText = "🤖 Sending to AI...";
  
      const reviewRes = await fetch(`http://localhost:3000/api/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diff: diffData.diff }),
      });
  
      const reviewData = await reviewRes.json();
  
      if (!reviewRes.ok || !reviewData.review) {
        output.innerText = "❌ Failed to get review";
        return;
      }
  
      output.innerText = reviewData.review;
    } catch (err) {
      output.innerText = "🚨 Error: " + err.message;
    }
  });
  