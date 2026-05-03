"use client";

import type { TextBlockItem } from "@/types/api";

interface Props {
  items: TextBlockItem[];
  emptyText?: string;
}

export default function ExpandableList({
  items,
  emptyText = "No content available.",
}: Props) {
  if (!items.length) {
    return (
      <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <details
          key={item.title}
          className="group rounded-2xl border border-[var(--bc-border)] bg-white px-4 py-3 text-sm"
        >
          <summary className="cursor-pointer list-none font-medium text-[var(--bc-primary)]">
            <span>{item.title}</span>
            <span className="float-right text-slate-400 group-open:rotate-90">→</span>
          </summary>
          <p className="mt-3 leading-6 text-slate-600">
            {item.description}
          </p>
        </details>
      ))}
    </div>
  );
}