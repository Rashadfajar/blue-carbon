import Link from "next/link";

export default function AdminTopbar() {
  return (
    <div className="flex items-center justify-between border-b border-[var(--bc-border)] bg-white px-6 py-4">
      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--bc-accent)]">
          Internal Workspace
        </div>
        <div className="text-sm font-semibold text-[var(--bc-primary)]">
          Blue Carbon Portal Admin
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="bc-btn-secondary px-3 py-2 text-xs"
        >
          ← Kembali ke Portal
        </Link>
      </div>
    </div>
  );
}