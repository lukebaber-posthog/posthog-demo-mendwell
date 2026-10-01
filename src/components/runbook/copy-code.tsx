"use client";

import { useState } from "react";
import { LuCheck, LuCopy } from "react-icons/lu";

function useCopy(text: string) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return { copied, copy };
}

function CopyButton({ text, className }: { text: string; className?: string }) {
  const { copied, copy } = useCopy(text);
  return (
    <button
      type="button"
      onClick={copy}
      title={copied ? "Copied" : "Copy"}
      aria-label={copied ? "Copied" : `Copy ${text}`}
      className={`inline-flex cursor-pointer rounded p-0.5 transition-colors ${className ?? ""}`}
    >
      {copied ? <LuCheck className="size-3.5 text-forest" /> : <LuCopy className="size-3.5" />}
    </button>
  );
}

// Inline code with a copy button on its right. Used for every `code` span in the runbook.
export function CopyCode({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-0.5 align-baseline whitespace-nowrap">
      <code className="rounded-md bg-sand/70 px-1.5 py-0.5 font-mono text-[0.85em] whitespace-normal">{text}</code>
      <CopyButton text={text} className="text-ink/40 hover:text-ink" />
    </span>
  );
}

// Fenced code block (for example the SQL queries) with a copy button in its top-right corner.
export function CopyBlock({ text }: { text: string }) {
  return (
    <div className="relative mb-3">
      <pre className="overflow-x-auto rounded-2xl bg-ink p-4 pr-12 font-mono text-[13px] leading-relaxed text-cream">
        <code>{text}</code>
      </pre>
      <CopyButton text={text} className="absolute top-3 right-3 p-1.5 text-cream/60 hover:text-cream" />
    </div>
  );
}
