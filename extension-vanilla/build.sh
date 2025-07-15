#!/bin/bash

# Clean dist directory
rm -rf dist
mkdir -p dist

# Build content script
vite build --config vite.config.content.ts

# Build popup
vite build --config vite.config.popup.ts

# Copy files to final dist directory
cp dist-content/content.js dist/
cp dist-popup/popup.js dist/
cp dist-popup/manifest.json dist/
cp dist-popup/index.html dist/

# Clean up temporary directories
rm -rf dist-content dist-popup

echo "Extension built successfully in dist/ folder" 