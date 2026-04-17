import Header from "./Header";

export default function Shell({
  children,
  mapMode = false,
}: {
  children: React.ReactNode;
  mapMode?: boolean;
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className={mapMode ? "h-[calc(100vh-73px)]" : "mx-auto max-w-7xl px-4 py-6"}>{children}</main>
    </div>
  );
}