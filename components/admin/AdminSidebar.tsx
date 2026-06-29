"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/sites", label: "Sites" },
  { href: "/admin/interventions", label: "Interventions" },
  { href: "/admin/resources", label: "Resources" },
  { href: "/admin/maps", label: "Maps" },
  { href: "/admin/home", label: "Home Config" },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ open, onClose }: Props) {
  const pathname = usePathname();

  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label="Close admin menu overlay"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[1px] md:hidden"
        />
      ) : null}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 w-72 border-r border-[var(--bc-border)] bg-white shadow-xl transition-transform duration-300 md:static md:z-auto md:block md:min-h-screen md:translate-x-0 md:shadow-none",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="relative px-5 pb-5 pt-5">
          <div className="pr-12">
            <div className="text-lg font-semibold tracking-tight">
              Admin Panel
            </div>
            <div className="mt-1 text-sm text-slate-500">
              Blue Carbon Portal management
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close admin menu"
            className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--bc-border)] bg-white text-slate-600 transition hover:bg-slate-50 md:hidden"
          >
            <span className="relative block h-4 w-4">
              <span className="absolute left-1/2 top-1/2 h-0.5 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded bg-current" />
              <span className="absolute left-1/2 top-1/2 h-0.5 w-4 -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded bg-current" />
            </span>
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-3 pb-4">
          {items.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-[var(--bc-primary)] !text-white shadow hover:!text-white"
                    : "text-[var(--bc-muted)] hover:bg-[rgba(11,60,93,0.06)]"
                }`}
              >
                <span className="text-inherit">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}