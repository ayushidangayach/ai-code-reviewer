#!/bin/bash

# Clean dist directory
rm -rf dist
mkdir -p dist

# Build content script
echo "Building content script..."
npx vite build --config vite.config.content.ts

# Build popup
echo "Building popup..."
npx vite build --config vite.config.popup.ts.ts

# Copy manifest to root of dist
cp public/manifest.json dist/

# Create index.html for popup in dist root
cat > dist/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Code Reviewer</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="./popup/popup.js"></script>
</body>
</html>
EOF

echo "Build completed! Check dist/ directory for the extension files."
