import Link from "next/link";
import Shell from "@/components/layout/Shell";
import Card from "@/components/ui/Card";
import AdminPageHeader from "@/components/admin/shared/AdminPageHeader";
import type { InterventionListResponse } from "@/types/api";

export default function InterventionListPage({
  data,
}: {
  data: InterventionListResponse;
}) {
  return (
    <div>
      <AdminPageHeader
        title="Intervention Manager"
        description="Manage intervention library content."
        action={
          <Link
            href="/admin/interventions/new"
            className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium !text-white shadow"
          >
            New Intervention
          </Link>
        }
      />

      <Card>
        <div className="overflow-x-auto">
          <table className="bc-table w-full text-left text-sm">
            <thead>
              <tr className="border-b text-slate-500">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Ecosystem</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item) => (
                <tr key={item.slug} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{item.title}</td>
                  <td className="px-4 py-3 text-slate-500">{item.slug}</td>
                  <td className="px-4 py-3 text-slate-500">{item.ecosystem}</td>
                  <td className="px-4 py-3 text-slate-500">{item.type}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/interventions/${item.slug}`}
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