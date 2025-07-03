import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkToc from "remark-toc";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({
  content,
  className = "",
}) => {
  return (
    <div className={`markdown-viewer ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            // Always render code as string
            const codeString =
              typeof children === "string"
                ? children
                : Array.isArray(children)
                ? children
                    .map((child) =>
                      typeof child === "string"
                        ? child
                        : JSON.stringify(child, null, 2)
                    )
                    .join("")
                : JSON.stringify(children, null, 2);

            return (
              <code
                {...props}
                className={`rounded bg-gray-100 px-1 py-0.5 font-mono text-sm ${
                  className || ""
                }`}
              >
                {codeString}
              </code>
            );
          },
          pre({ children, ...props }) {
            return (
              <pre
                {...props}
                className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto my-4"
              >
                {children}
              </pre>
            );
          },
          a({ children, ...props }) {
            return (
              <a
                {...props}
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            );
          },
          blockquote({ children, ...props }) {
            return (
              <blockquote
                {...props}
                className="border-l-4 border-blue-500 pl-4 italic bg-gray-50 p-2 my-4 rounded"
              >
                {children}
              </blockquote>
            );
          },
          ul({ children, ...props }) {
            return (
              <ul {...props} className="list-disc list-inside my-3 ml-3 pl-2">
                {children}
              </ul>
            );
          },
          ol({ children, ...props }) {
            return (
              <ol
                {...props}
                className="list-decimal list-inside my-3 ml-3 pl-2"
              >
                {children}
              </ol>
            );
          },
          h1({ children, ...props }) {
            return (
              <h1
                {...props}
                className="text-4xl font-extrabold tracking-tight mt-8 mb-4"
              >
                {children}
              </h1>
            );
          },
          h2({ children, ...props }) {
            return (
              <h2
                {...props}
                className="text-3xl font-bold border-b pb-2 mt-8 mb-3"
              >
                {children}
              </h2>
            );
          },
          h3({ children, ...props }) {
            return (
              <h3 {...props} className="text-2xl font-semibold mt-6 mb-2">
                {children}
              </h3>
            );
          },
          h4({ children, ...props }) {
            return (
              <h4 {...props} className="text-xl font-semibold mt-6 mb-2">
                {children}
              </h4>
            );
          },
          p({ children, ...props }) {
            return (
              <p {...props} className="mb-4 leading-relaxed">
                {children}
              </p>
            );
          },
          img({ src, alt, ...props }) {
            return (
              <img
                src={src || ""}
                alt={alt || ""}
                className="max-w-full rounded my-4"
                {...props}
              />
            );
          },
          table({ children, ...props }) {
            return (
              <div className="overflow-x-auto my-4">
                <table
                  {...props}
                  className="min-w-full border border-gray-300 rounded-lg"
                >
                  {children}
                </table>
              </div>
            );
          },
          thead({ children, ...props }) {
            return (
              <thead className="bg-gray-100" {...props}>
                {children}
              </thead>
            );
          },
          tbody({ children, ...props }) {
            return (
              <tbody className="divide-y divide-gray-300" {...props}>
                {children}
              </tbody>
            );
          },
          tr({ children, ...props }) {
            return (
              <tr className="hover:bg-gray-50" {...props}>
                {children}
              </tr>
            );
          },
          th({ children, ...props }) {
            return (
              <th
                className="px-4 py-2 text-left font-semibold border-b border-gray-300"
                {...props}
              >
                {children}
              </th>
            );
          },
          td({ children, ...props }) {
            return (
              <td className="px-4 py-2 border-b border-gray-300" {...props}>
                {children}
              </td>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownViewer;
