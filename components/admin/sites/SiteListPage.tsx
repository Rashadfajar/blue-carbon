import Link from "next/link";
import Shell from "@/components/layout/Shell";
import Card from "@/components/ui/Card";
import type { SiteListResponse } from "@/types/api";

export default function SiteListPage({ data }: { data: SiteListResponse }) {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Site Manager</h1>
          <p className="mt-1 text-sm text-slate-500">Manage case-study and study-area content.</p>
        </div>
        <Link
          href="/admin/sites/new"
          className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium !text-white shadow"
        >
          New Site
        </Link>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="bc-table w-full text-left text-sm">
            <thead>
              <tr className="border-b text-slate-500">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Subtitle</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((site) => (
                <tr key={site.slug} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{site.title}</td>
                  <td className="px-4 py-3 text-slate-500">{site.slug}</td>
                  <td className="px-4 py-3 text-slate-500">{site.subtitle || "-"}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/sites/${site.slug}`}
                      className="rounded-xl border border-red-200 px-3 py-2 text-xs text-red-700 hover:bg-red-50"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}