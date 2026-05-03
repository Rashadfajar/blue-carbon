interface Props {
  title: string;
  value: string | number;
  helper?: string;
}

export default function DashboardStatCard({ title, value, helper }: Props) {
  return (
    <div className="bc-card-strong p-5">
      <div className="text-xs uppercase tracking-wide text-[var(--bc-muted)]">{title}</div>
      <div className="mt-2 text-3xl font-semibold tracking-tight text-[var(--bc-primary)]">{value}</div>
      {helper ? <div className="mt-2 text-sm text-[var(--bc-muted)]">{helper}</div> : null}
    </div>
  );
}