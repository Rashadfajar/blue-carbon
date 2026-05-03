export default function SmallTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[rgba(17,138,138,0.14)] bg-[rgba(17,138,138,0.08)] px-2.5 py-1 text-xs font-medium text-[var(--bc-accent)]">
      {children}
    </span>
  );
}
