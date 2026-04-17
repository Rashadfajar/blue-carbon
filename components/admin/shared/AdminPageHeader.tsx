import Link from "next/link";

interface Props {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  action?: React.ReactNode;
}

export default function AdminPageHeader({
  title,
  description,
  backHref,
  backLabel = "Back",
  action,
}: Props) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        {backHref ? (
          <Link
            href={backHref}
            className="mb-3 inline-flex rounded-xl border px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            ← {backLabel}
          </Link>
        ) : null}

        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>

        {description ? (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        ) : null}
      </div>

      {action ? <div>{action}</div> : null}
    </div>
  );
}