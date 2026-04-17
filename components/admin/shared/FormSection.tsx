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
    <section className="rounded-3xl border bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        ) : null}
      </div>

      {children}
    </section>
  );
}