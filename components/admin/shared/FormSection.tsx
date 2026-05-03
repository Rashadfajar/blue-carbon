interface Props {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function FormSection({
  title,
  description,
  children,
}: Props) {
  return (
    <section className="bc-card-strong p-5 md:p-6">
      <div className="mb-4 border-b border-[var(--bc-border)] pb-4">
        <h2 className="text-lg font-semibold text-[var(--bc-primary)]">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-[var(--bc-muted)]">{description}</p>
        ) : null}
      </div>

      {children}
    </section>
  );
}