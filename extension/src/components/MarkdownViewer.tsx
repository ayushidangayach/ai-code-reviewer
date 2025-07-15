import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

export default function MarkdownViewer({
  content,
  className = "",
}: MarkdownViewerProps) {
  return (
    <div className={`prose max-w-none dark:prose-invert ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
        components={{
          a(props) {
            return (
              <a
                {...props}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline dark:text-blue-400"
              />
            );
          },
          code(props) {
            const { inline, children } = props as {
              inline?: boolean;
              children: React.ReactNode;
            };
            return inline ? (
              <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono">
                {children}
              </code>
            ) : (
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-x-auto">
                <code className="text-sm whitespace-pre-wrap font-mono">
                  {children}
                </code>
              </pre>
            );
          },
          blockquote(props) {
            return (
              <blockquote
                {...props}
                className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic"
              />
            );
          },
          h1(props) {
            return (
              <h1
                {...props}
                className="text-3xl font-bold mb-4 mt-8 first:mt-0"
              />
            );
          },
          h2(props) {
            return (
              <h2
                {...props}
                className="text-2xl font-semibold mb-3 mt-6 first:mt-0"
              />
            );
          },
          h3(props) {
            return (
              <h3
                {...props}
                className="text-xl font-semibold mb-2 mt-4 first:mt-0"
              />
            );
          },
          p(props) {
            return <p {...props} className="mb-4 leading-relaxed" />;
          },
          ul(props) {
            return (
              <ul {...props} className="list-disc list-inside mb-4 space-y-1" />
            );
          },
          ol(props) {
            return (
              <ol
                {...props}
                className="list-decimal list-inside mb-4 space-y-1"
              />
            );
          },
          table(props) {
            return (
              <div className="overflow-x-auto mb-4">
                <table
                  {...props}
                  className="min-w-full border border-gray-300 dark:border-gray-600"
                />
              </div>
            );
          },
          th(props) {
            return (
              <th
                {...props}
                className="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-50 dark:bg-gray-700 font-semibold"
              />
            );
          },
          td(props) {
            return (
              <td
                {...props}
                className="border border-gray-300 dark:border-gray-600 px-4 py-2"
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
