# AI Code Reviewer Extension

This Chrome extension uses React and your existing `MarkdownViewer` component to provide beautiful markdown rendering for AI code reviews.

## 🚀 Features

- **React-based UI** - Modern, responsive interface
- **Full Markdown Support** - Uses your existing `MarkdownViewer` component
- **Syntax Highlighting** - Beautiful code blocks with syntax highlighting
- **GitHub Integration** - Works directly on GitHub PR pages
- **Popup & Content Script** - Both popup and in-page modal support

## 🛠️ Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Your backend server running on `localhost:3000`

### Build Steps

1. **Install dependencies:**
   ```bash
   cd extension
   npm install
   ```

2. **Build the extension:**
   ```bash
   npm run build
   ```

3. **Load in Chrome:**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `extension/` folder

## 📁 Project Structure

```
extension/
├── src/
│   ├── components/
│   │   └── MarkdownViewer.tsx    # Your markdown component
│   ├── popup.tsx                 # React popup component
│   ├── content.tsx               # React content script
│   └── styles.css                # Tailwind CSS styles
├── dist/                         # Built files (generated)
├── popup.html                    # Popup HTML
├── manifest.json                 # Extension manifest
├── package.json                  # Dependencies
├── vite.config.ts               # Build configuration
└── tailwind.config.js           # Tailwind configuration
```

## 🎯 Usage

### Popup
1. Click the extension icon in Chrome toolbar
2. Paste a GitHub PR URL
3. Click "Review with AI"
4. See beautifully formatted markdown review

### Content Script
1. Go to any GitHub PR page
2. Look for "💡 Review with AI" button in the header
3. Click to see the review in a modal
4. Same beautiful markdown rendering

## 🔧 Development

### Watch Mode
```bash
npm run dev
```
This will rebuild automatically when you make changes.

### Customization
- Modify `src/popup.tsx` for popup changes
- Modify `src/content.tsx` for content script changes
- Modify `src/components/MarkdownViewer.tsx` for markdown rendering changes

## 🎨 Styling

The extension uses:
- **Tailwind CSS** for utility classes
- **Your existing MarkdownViewer styling** for consistency
- **Responsive design** for different screen sizes

## 🔒 Security

- All markdown content is sanitized
- No external scripts loaded
- Secure communication with your backend

## 🚀 Deployment

1. Build the extension: `npm run build`
2. Zip the `extension/` folder
3. Upload to Chrome Web Store (if publishing)

## 🐛 Troubleshooting

### Build Issues
- Make sure all dependencies are installed: `npm install`
- Check Node.js version (18+ required)
- Clear `dist/` folder and rebuild

### Extension Not Loading
- Check Chrome console for errors
- Verify manifest.json is valid
- Ensure all built files exist in `dist/`

### Backend Connection
- Make sure your backend is running on `localhost:3000`
- Check CORS settings if needed
- Verify API endpoints are working

## 📝 Notes

- The extension reuses your exact `MarkdownViewer` component
- All React features work (hooks, state, etc.)
- Tailwind CSS is included for styling
- Build process creates optimized bundles 