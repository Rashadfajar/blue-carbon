import Header from "./Header";

export default function Shell({
  children,
  mapMode = false,
}: {
  children: React.ReactNode;
  mapMode?: boolean;
}) {
  return (
    <div className="min-h-screen bg-transparent text-[var(--bc-ink)]">
      <Header />
      <main
        className={
          mapMode
            ? "h-[calc(100vh-78px)]"
            : "mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8"
        }
      >
        {children}
      </main>
    </div>
  );
}
