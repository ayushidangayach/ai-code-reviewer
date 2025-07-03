# AI Code Reviewer with Comprehensive Markdown Viewer

A powerful AI-powered code review tool with a comprehensive markdown viewer that supports all modern markdown features.

## 🚀 Features

### AI Code Review
- Paste GitHub PR diffs for AI-powered code review
- Get detailed feedback and suggestions
- Clean, modern interface

### Comprehensive Markdown Viewer
Our markdown viewer supports all modern markdown features:

#### 📝 Basic Text Formatting
- **Bold text** and *italic text*
- ~~Strikethrough text~~
- `inline code`
- Headers (H1-H6)

#### 📋 Lists
- Unordered lists with bullets
- Ordered lists with numbers
- Nested lists
- Task lists with checkboxes

#### 💻 Code Blocks
- Syntax highlighting for 100+ programming languages
- Inline code formatting
- Beautiful code block styling
- Support for:
  - JavaScript/TypeScript
  - Python
  - CSS/SCSS
  - HTML
  - SQL
  - And many more!

#### 📊 Tables
- Full table support with headers
- Column alignment
- Hover effects
- Responsive design

#### 🧮 Mathematical Expressions
- Inline math: $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$
- Block math with KaTeX rendering
- Support for complex mathematical formulas

#### 🔗 Links and Media
- External links with proper styling
- Image support with responsive design
- Automatic link opening in new tabs

#### 📄 Advanced Features
- GitHub Flavored Markdown (GFM)
- Table of Contents generation
- Auto-linking headings
- Horizontal rules
- Blockquotes with styling
- Emoji support

## 🎨 Styling Features

- **Dark Mode Support** - Automatically adapts to system theme
- **Responsive Design** - Works perfectly on all screen sizes
- **Accessibility** - Screen reader friendly
- **Print Styles** - Optimized for printing
- **Custom Styling** - Beautiful, modern design with Tailwind CSS

## 🛠️ Technical Stack

### Core Libraries
- **react-markdown** - Core markdown parsing
- **remark-gfm** - GitHub Flavored Markdown support
- **remark-math** - Mathematical expression parsing
- **rehype-katex** - Math rendering with KaTeX
- **rehype-highlight** - Syntax highlighting
- **react-syntax-highlighter** - Beautiful code blocks
- **rehype-slug** - Heading ID generation
- **rehype-autolink-headings** - Auto-linking headings
- **remark-toc** - Table of contents generation

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **KaTeX** - Math typesetting
- **Custom CSS** - Enhanced markdown styling

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-code-reviewer
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Usage

1. **AI Code Review**:
   - Paste a GitHub PR diff in the textarea
   - Click "Review with AI" to get feedback

2. **Markdown Demo**:
   - Click "Show Markdown Demo" to see all features
   - Explore the comprehensive markdown support

## 📖 Markdown Examples

### Code Blocks
\`\`\`javascript
function greet(name) {
  return 'Hello, ' + name + '!';
}
\`\`\`

### Tables
| Feature | Support | Notes |
|---------|---------|-------|
| Headers | ✅ | Fully supported |
| Styling | ✅ | Hover effects |

### Math
Inline: $E = mc^2$

Block:
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

### Task Lists
- [x] Completed task
- [ ] Pending task

## 🎯 Use Cases

- **Documentation** - Perfect for technical documentation
- **Code Reviews** - Enhanced AI code review feedback
- **Blog Posts** - Rich content creation
- **Technical Writing** - Mathematical and code-heavy content
- **README Files** - Beautiful project documentation

## 🔧 Customization

The markdown viewer is highly customizable:

### Styling
- Modify `src/app/globals.css` for custom styles
- Update component styles in `src/components/MarkdownViewer.tsx`
- Add new themes or color schemes

### Plugins
- Add new remark/rehype plugins
- Customize syntax highlighting themes
- Extend math rendering options

### Components
- Override default component rendering
- Add custom markdown elements
- Implement new features

## 📱 Responsive Design

The markdown viewer is fully responsive:
- **Desktop** - Full feature set with optimal spacing
- **Tablet** - Adapted layout for medium screens
- **Mobile** - Optimized for small screens with readable text

## 🌙 Dark Mode

Automatic dark mode support:
- Follows system theme preferences
- Smooth transitions between themes
- Optimized colors for both light and dark modes

## 🎨 Available Themes

### Syntax Highlighting
- Tomorrow (default)
- Easily customizable with other Prism themes

### Math Rendering
- KaTeX with beautiful mathematical typesetting
- Support for complex formulas and symbols

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [react-markdown](https://github.com/remarkjs/react-markdown) for the core markdown parsing
- [KaTeX](https://katex.org/) for mathematical rendering
- [Prism](https://prismjs.com/) for syntax highlighting
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

**Built with ❤️ for developers who love beautiful documentation and code reviews.**
