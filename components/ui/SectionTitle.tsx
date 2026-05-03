export default function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-5">
      <div className="h-1 w-14 rounded-full bg-[var(--bc-accent)]" />
      <h2 className="mt-3 text-xl font-semibold tracking-tight text-[var(--bc-primary)]">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-1 text-sm leading-6 text-[var(--bc-muted)]">{subtitle}</p>
      ) : null}
    </div>
  );
}
