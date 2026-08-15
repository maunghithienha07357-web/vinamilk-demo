import type { ReactNode } from "react";

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const re = /(\*\*[^*]+?\*\*|__[^_]+?__)/g;
  let last = 0;
  let i = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text))) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const token = match[0];
    const inner = token.startsWith("**") ? token.slice(2, -2) : token.slice(2, -2);
    parts.push(
      <strong key={`${keyPrefix}-b-${i}`} className="font-semibold text-slate-900">
        {inner}
      </strong>,
    );
    i += 1;
    last = match.index + token.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function ChatMarkdown({ text }: { text: string }) {
  const lines = text.split("\n");
  const blocks: ReactNode[] = [];
  let listItems: string[] | null = null;
  let listType: "ul" | "ol" | null = null;

  function flushList() {
    if (!listItems || !listType) return;
    const items = listItems;
    const type = listType;
    listItems = null;
    listType = null;
    const cls = type === "ul" ? "list-disc pl-4 space-y-0.5" : "list-decimal pl-4 space-y-0.5";
    const Tag = type === "ul" ? "ul" : "ol";
    blocks.push(
      <Tag key={`list-${blocks.length}`} className={cls}>
        {items.map((item, idx) => (
          <li key={idx}>{renderInline(item, `li-${blocks.length}-${idx}`)}</li>
        ))}
      </Tag>,
    );
  }

  for (const raw of lines) {
    const line = raw.replace(/\s+$/, "");
    const ul = line.match(/^\s*(?:[-*•]|\u2022)\s+(.*)$/);
    const ol = line.match(/^\s*\d+[.)]\s+(.*)$/);
    const heading = line.match(/^\s*#{1,3}\s+(.*)$/);

    if (ul) {
      if (listType !== "ul") {
        flushList();
        listItems = [];
        listType = "ul";
      }
      listItems!.push(ul[1]);
      continue;
    }
    if (ol) {
      if (listType !== "ol") {
        flushList();
        listItems = [];
        listType = "ol";
      }
      listItems!.push(ol[1]);
      continue;
    }

    flushList();
    if (!line.trim()) {
      blocks.push(<div key={`sp-${blocks.length}`} className="h-1.5" />);
      continue;
    }
    if (heading) {
      blocks.push(
        <p key={`h-${blocks.length}`} className="font-semibold text-slate-900">
          {renderInline(heading[1], `h-${blocks.length}`)}
        </p>,
      );
      continue;
    }
    blocks.push(
      <p key={`p-${blocks.length}`}>{renderInline(line, `p-${blocks.length}`)}</p>,
    );
  }
  flushList();

  return <div className="space-y-1 leading-relaxed">{blocks}</div>;
}
