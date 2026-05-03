import Link from "next/link";
import Shell from "@/components/layout/Shell";
import Card from "@/components/ui/Card";
import SectionTitle from "@/components/ui/SectionTitle";
import type { ResourceItem } from "@/types/api";

export default function ResourceDetailPage({ data }: { data: ResourceItem }) {
  const fileHref = data.file_url
    ? data.file_url.startsWith("http")
      ? data.file_url
      : `${process.env.NEXT_PUBLIC_API_ROOT || "http://127.0.0.1:8000"}${data.file_url}`
    : null;

  return (
    <Shell>
      <div className="mb-6">
        <Link href="/" className="bc-kicker mt-4 text-sm text-[var(--bc-accent)]">
          ← Back to Home
        </Link>
        <h1 className="mt-3 text-3xl font-semibold text-[var(--bc-primary)] md:text-4xl">
          {data.title}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--bc-muted)]">
          {data.summary}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-8">
          <SectionTitle title="Resource information" />
          <div className="space-y-3 text-sm">
            <div className="rounded-2xl bg-slate-50 p-4">
              <strong>Category:</strong> {data.category}
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <strong>Published date:</strong> {data.published_date || "-"}
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-4">
          <SectionTitle title="Open resource" />
          <div className="space-y-3 text-sm">
            {fileHref ? (
              <a
                href={fileHref}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl bg-slate-900 px-4 py-3 font-medium !text-white"
              >
                Open file →
              </a>
            ) : null}

            {data.external_url ? (
              <a
                href={data.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl border px-4 py-3 font-medium text-slate-700 hover:bg-slate-50"
              >
                Open external link →
              </a>
            ) : null}

            {!fileHref && !data.external_url ? (
              <div className="rounded-2xl bg-slate-50 p-4 text-slate-500">
                No file or external link has been attached.
              </div>
            ) : null}
          </div>
        </Card>
      </div>
    </Shell>
  );
}