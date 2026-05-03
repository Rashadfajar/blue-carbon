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

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-[var(--bc-border)] bg-white md:w-72 md:border-b-0 md:border-r">
      <div className="px-5 py-5">
        <div className="text-lg font-semibold tracking-tight">Admin Panel</div>
        <div className="mt-1 text-sm text-slate-500">Blue Carbon Portal management</div>
      </div>

      <nav className="flex flex-col gap-1 px-3 pb-4">
        {items.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
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
  );
}