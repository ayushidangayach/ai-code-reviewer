#!/bin/bash

echo "🚀 Building AI Code Reviewer Extension..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the extension
echo "🔨 Building extension..."
npm run build

echo "✅ Build complete! Extension files are in the dist/ folder"
echo "📁 You can now load the extension in Chrome from the extension/ folder" 