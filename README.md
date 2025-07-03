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
- OpenAI API Key
- GitHub Personal Access Token

### 🔐 Environment Variables

Create a `.env.local` file in the root directory and add the following:
(Get the GITHUB_TOKEN from [this link](https://github.com/settings/personal-access-tokens))

```env
OPENAI_API_KEY=your-openai-api-key-here
GITHUB_TOKEN=your-github-token-here
