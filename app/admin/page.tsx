import AdminPageHeader from "@/components/admin/shared/AdminPageHeader";

export default function Page() {
  return (
    <div>
      <AdminPageHeader title="Dashboard" description="Blue Carbon internal content management" />
      <div className="rounded-3xl border bg-white p-6 shadow-sm text-sm text-slate-600">
        Admin dashboard starter. Next steps: connect totals and recent items.
      </div>
    </div>
  );
}