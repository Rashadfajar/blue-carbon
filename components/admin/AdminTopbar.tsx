"use client";

import Link from "next/link";

interface Props {
  onMenuClick: () => void;
}

export default function AdminTopbar({ onMenuClick }: Props) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[var(--bc-border)] bg-white px-4 py-4 md:px-6">
      <div className="min-w-0">
        <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--bc-accent)]">
          Internal Workspace
        </div>
        <div className="truncate text-sm font-semibold text-[var(--bc-primary)]">
          Blue Carbon Portal Admin
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Link href="/" className="bc-btn-secondary px-3 py-2 text-xs">
          ← Kembali ke Portal
        </Link>

        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open admin menu"
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--bc-border)] bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 md:hidden"
        >
          <span className="relative block h-4 w-5">
            <span className="absolute left-0 top-0 h-0.5 w-5 rounded bg-current" />
            <span className="absolute left-0 top-1.5 h-0.5 w-5 rounded bg-current" />
            <span className="absolute left-0 top-3 h-0.5 w-5 rounded bg-current" />
          </span>
        </button>
      </div>
    </div>
  );
}