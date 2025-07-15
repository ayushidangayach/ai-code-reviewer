#!/bin/bash

# Clean dist directory
rm -rf dist
mkdir -p dist

# Build content script
vite build --config vite.config.content.ts

# Copy files to final dist directory
cp dist-content/content.js dist/
cp dist-content/manifest.json dist/
cp dist-content/index.html dist/

# Clean up temporary directories
rm -rf dist-content

echo "Extension built successfully in dist/ folder" 