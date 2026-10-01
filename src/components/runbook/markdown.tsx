import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { CopyBlock, CopyCode } from "./copy-code";

// Brand styling for the runbook's Markdown. Raw HTML in the file is ignored.
const components: Components = {
  p: ({ children }) => <p className="mb-3 leading-relaxed last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="mb-3 flex list-disc flex-col gap-1.5 pl-5 marker:text-ink/40">{children}</ul>,
  ol: ({ children }) => <ol className="mb-3 flex list-decimal flex-col gap-2 pl-5 marker:font-semibold">{children}</ol>,
  li: ({ children }) => <li className="pl-1 leading-relaxed [&>ol]:mt-2 [&>ul]:mt-1.5">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  h3: ({ children }) => <h3 className="mt-5 mb-2 font-sans text-base font-semibold">{children}</h3>,
  a: ({ href, children }) => (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      className="font-medium underline decoration-forest/40 underline-offset-4 hover:decoration-forest"
    >
      {children}
    </a>
  ),
  // Fenced blocks arrive as <pre><code class="language-…">; unwrap the <pre> and let `code` pick the layout.
  pre: ({ children }) => <>{children}</>,
  code: ({ className, children }) => {
    const text = String(children);
    return className?.startsWith("language-") || text.includes("\n") ? (
      <CopyBlock text={text.replace(/\n$/, "")} />
    ) : (
      <CopyCode text={text} />
    );
  },
  table: ({ children }) => (
    <div className="mb-3 overflow-x-auto rounded-2xl border border-sand">
      <table className="w-full text-left text-[15px]">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="bg-sand/60 px-4 py-2.5 font-semibold">{children}</th>,
  td: ({ children }) => <td className="border-t border-sand px-4 py-2.5 align-top">{children}</td>,
};

export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components} skipHtml>
      {children}
    </ReactMarkdown>
  );
}
