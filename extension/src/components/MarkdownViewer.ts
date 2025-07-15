import { marked } from "marked";
import hljs from "highlight.js";
import katex from "katex";

// Configure marked
marked.setOptions({
  breaks: true,
  gfm: true,
});

// Custom renderer for math expressions
const renderer = new marked.Renderer();

// Handle inline math
renderer.text = function (text: string) {
  // Replace inline math expressions
  text = text.replace(/\$([^$]+)\$/g, (match: string, math: string) => {
    try {
      return katex.renderToString(math, { displayMode: false });
    } catch (err) {
      console.error("KaTeX inline error:", err);
      return match;
    }
  });

  // Replace block math expressions
  text = text.replace(/\$\$([^$]+)\$\$/g, (match: string, math: string) => {
    try {
      return katex.renderToString(math, { displayMode: true });
    } catch (err) {
      console.error("KaTeX block error:", err);
      return match;
    }
  });

  return text;
};

// Custom code block renderer
renderer.code = function (code: string) {
  const highlighted = hljs.highlightAuto(code).value;
  return `<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-x-auto"><code class="text-sm whitespace-pre-wrap font-mono">${highlighted}</code></pre>`;
};

// Custom inline code renderer
renderer.codespan = function (code: string) {
  return `<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono">${code}</code>`;
};

// Custom link renderer
renderer.link = function (href: string, title: string, text: string) {
  return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline dark:text-blue-400">${text}</a>`;
};

// Custom heading renderers
renderer.heading = function (text: string, level: number) {
  const classes: { [key: number]: string } = {
    1: "text-3xl font-bold mb-4 mt-8 first:mt-0",
    2: "text-2xl font-semibold mb-3 mt-6 first:mt-0",
    3: "text-xl font-semibold mb-2 mt-4 first:mt-0",
    4: "text-lg font-semibold mb-2 mt-4 first:mt-0",
    5: "text-base font-semibold mb-2 mt-4 first:mt-0",
    6: "text-sm font-semibold mb-2 mt-4 first:mt-0",
  };
  return `<h${level} class="${classes[level]}">${text}</h${level}>`;
};

// Custom paragraph renderer
renderer.paragraph = function (text: string) {
  return `<p class="mb-4 leading-relaxed">${text}</p>`;
};

// Custom list renderers
renderer.list = function (body: string, ordered: boolean) {
  const tag = ordered ? "ol" : "ul";
  const classes = ordered
    ? "list-decimal list-inside mb-4 space-y-1"
    : "list-disc list-inside mb-4 space-y-1";
  return `<${tag} class="${classes}">${body}</${tag}>`;
};

// Custom blockquote renderer
renderer.blockquote = function (quote: string) {
  return `<blockquote class="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic">${quote}</blockquote>`;
};

// Custom table renderer (optional)
renderer.table = function (header: string, body: string) {
  return `<div class="overflow-x-auto mb-4"><table class="min-w-full border border-gray-300 dark:border-gray-600">${header}${body}</table></div>`;
};

marked.use({ renderer });

export class MarkdownViewer {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  render(content: string): void {
    try {
      const html = marked.parse(content) as string;
      this.container.innerHTML = html;
    } catch (error) {
      console.error("Markdown rendering error:", error);
      this.container.innerHTML = `<p class="text-red-500">Error rendering markdown: ${error}</p>`;
    }
  }

  static create(container: HTMLElement): MarkdownViewer {
    return new MarkdownViewer(container);
  }
}
