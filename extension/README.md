# AI Code Reviewer Extension (Vanilla JS)

A Chrome extension for AI-powered code review, built with vanilla JavaScript instead of React.

## Features

- Review GitHub PRs with AI
- Markdown rendering with syntax highlighting
- Math expression support (KaTeX)
- Popup interface for manual URL input
- Content script integration for GitHub PR pages

## Development

1. Install dependencies:
```bash
npm install
```

2. Build the extension:
```bash
npm run build
```

3. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

## Project Structure

```
extension-vanilla/
├── src/
│   ├── components/
│   │   └── MarkdownViewer.ts    # Markdown rendering component
│   ├── popup.ts                 # Popup interface
│   └── content.ts               # Content script for GitHub
├── public/
│   └── manifest.json            # Extension manifest
├── index.html                   # Popup HTML
├── vite.config.ts              # Build configuration
├── package.json                # Dependencies
└── build.sh                    # Build script
```

## Key Differences from React Version

- Uses vanilla JavaScript classes instead of React components
- Markdown rendering with `marked` library instead of `react-markdown`
- DOM manipulation instead of virtual DOM
- No JSX or React dependencies
- Simpler build process

## Backend Requirements

The extension requires the backend server to be running on `https://ai-code-reviewer-phi-puce.vercel.app/` with the following endpoints:

- `GET /api/github-diff?url=<pr_url>` - Fetch PR diff
- `POST /api/review` - Get AI review

## Usage

1. Click the extension icon to open the popup
2. Paste a GitHub PR URL and click "Review with AI"
3. Or visit a GitHub PR page and click the "💡 Review with AI" button 