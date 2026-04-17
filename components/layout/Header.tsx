"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import type {
  InterventionListResponse,
  SiteListItem,
  SiteListResponse,
} from "@/types/api";

const pages = [
  { href: "/", label: "Home" },
  { href: "/interventions", label: "Intervention Library" },
  { href: "/map", label: "Map Explorer" },
];

export default function Header() {
  const pathname = usePathname();
  const [caseStudyItems, setCaseStudyItems] = useState<SiteListItem[]>([]);
  const [openDropdown, setOpenDropdown] = useState(false);

  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [interventionResults, setInterventionResults] = useState<
    InterventionListResponse["items"]
  >([]);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const response = await apiFetch<SiteListResponse>("/sites");
        setCaseStudyItems(Array.isArray(response.items) ? response.items : []);
      } catch (error) {
        console.error("Error fetching case study items:", error);
      }
    };

    fetchSites();
  }, []);

  useEffect(() => {
    const run = async () => {
      if (!search.trim()) {
        setInterventionResults([]);
        return;
      }

      try {
        const response = await apiFetch<InterventionListResponse>(
          `/interventions?search=${encodeURIComponent(search)}`
        );
        setInterventionResults(response.items);
      } catch (error) {
        console.error("Search failed:", error);
      }
    };

    const timeout = setTimeout(run, 250);
    return () => clearTimeout(timeout);
  }, [search]);

  const filteredSites = useMemo(() => {
    if (!search.trim()) return [];
    return caseStudyItems.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, caseStudyItems]);

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur ">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
            <div className="relative h-11 w-12">
              <Image
                src="/images/logo.png"
                alt="KKP Indonesia"
                fill
                className="object-cover"
                priority
              />
            </div>
          <div>
            <div className="text-sm font-semibold">Blue Carbon Portal</div>
            {/* <div className="text-xs text-slate-500">Next.js frontend prototype</div> */}
          </div>
        </div>

        <nav className="hidden items-center gap-2 md:flex">
          {pages.map((page) => {
            const active = pathname === page.href;
            return (
              <Link
                key={page.href}
                href={page.href}
                className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-slate-900 text-white shadow"
                    : "bg-white text-slate-600 hover:bg-slate-200"
                }`}
              >
                {page.label}
              </Link>
            );
          })}

          <div className="relative z-50 ">
            <button
              onClick={() => setOpenDropdown((prev) => !prev)}
              className="rounded-2xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200"
              type="button"
            >
              Case Study
              <span className="ml-2">▼</span>
            </button>

            {openDropdown && (
              <div className="absolute left-0 z-9999 mt-2 w-56 rounded-xl border bg-white shadow-lg">
                {caseStudyItems.length === 0 ? (
                  <div className="px-4 py-2 text-sm text-slate-500">Loading...</div>
                ) : (
                  <ul>
                    {caseStudyItems.map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={`/case-study/${item.slug}`}
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                          onClick={() => setOpenDropdown(false)}
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <div className="relative ml-2">
            <input
              type="text"
              value={search}
              onFocus={() => setSearchOpen(true)}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="w-48  rounded-xl border px-3 py-2 text-sm text-slate-700"
            />

            {searchOpen && search.trim() && (
              <div className="absolute right-0 z-50 mt-2 w-80 rounded-xl border bg-white shadow-lg">
                <div className="border-b px-4 py-2 text-xs font-semibold uppercase text-slate-400">
                  Interventions
                </div>
                {interventionResults.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-slate-500">No intervention results</div>
                ) : (
                  interventionResults.map((item) => (
                    <Link
                      key={item.slug}
                      href="/interventions"
                      className="block px-4 py-3 text-sm hover:bg-slate-50"
                      onClick={() => setSearchOpen(false)}
                    >
                      <div className="font-medium text-slate-800">{item.title}</div>
                      <div className="text-xs text-slate-500">{item.summary}</div>
                    </Link>
                  ))
                )}

                <div className="border-b border-t px-4 py-2 text-xs font-semibold uppercase text-slate-400">
                  Case Studies
                </div>
                {filteredSites.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-slate-500">No case study results</div>
                ) : (
                  filteredSites.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/case-study/${item.slug}`}
                      className="block px-4 py-3 text-sm hover:bg-slate-50"
                      onClick={() => setSearchOpen(false)}
                    >
                      <div className="font-medium text-slate-800">{item.title}</div>
                      <div className="text-xs text-slate-500">{item.summary}</div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}