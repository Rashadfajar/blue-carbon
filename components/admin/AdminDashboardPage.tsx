import Link from "next/link";
import DashboardStatCard from "@/components/admin/DashboardStatCard";

interface Props {
  stats: {
    sites: number;
    interventions: number;
    resources: number;
    layers: number;
  };
}

export default function AdminDashboardPage({ stats }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage portal content, GIS layers, and homepage configuration.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard title="Sites" value={stats.sites} helper="Case studies and landscapes" />
        <DashboardStatCard title="Interventions" value={stats.interventions} helper="Library entries" />
        <DashboardStatCard title="Resources" value={stats.resources} helper="Reports, manuals, and files" />
        <DashboardStatCard title="Map Layers" value={stats.layers} helper="Base, reference, and uploaded layers" />
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="rounded-3xl border bg-white p-5 shadow-sm lg:col-span-7">
          <h2 className="text-lg font-semibold">Quick actions</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Link href="/admin/sites/new" className="rounded-2xl border px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Create Site
            </Link>
            <Link href="/admin/interventions/new" className="rounded-2xl border px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Create Intervention
            </Link>
            <Link href="/admin/resources/new" className="rounded-2xl border px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Create Resource
            </Link>
            <Link href="/admin/maps" className="rounded-2xl border px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Manage Maps
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border bg-white p-5 shadow-sm lg:col-span-5">
          <h2 className="text-lg font-semibold">Modules</h2>
          <div className="mt-4 space-y-3 text-sm">
            <Link href="/admin/sites" className="block rounded-2xl bg-slate-50 px-4 py-3 hover:bg-slate-100">
              Site Manager
            </Link>
            <Link href="/admin/interventions" className="block rounded-2xl bg-slate-50 px-4 py-3 hover:bg-slate-100">
              Intervention Manager
            </Link>
            <Link href="/admin/resources" className="block rounded-2xl bg-slate-50 px-4 py-3 hover:bg-slate-100">
              Resource Manager
            </Link>
            <Link href="/admin/maps" className="block rounded-2xl bg-slate-50 px-4 py-3 hover:bg-slate-100">
              GIS Manager
            </Link>
            <Link href="/admin/home" className="block rounded-2xl bg-slate-50 px-4 py-3 hover:bg-slate-100">
              Home Config
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}