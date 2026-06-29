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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCaseStudyOpen, setMobileCaseStudyOpen] = useState(false);

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

  const isCaseStudyActive =
    pathname === "/case-study" || pathname.startsWith("/case-study/");

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileCaseStudyOpen(false);
    setSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--bc-border)] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-11 w-12 overflow-hidden rounded-xl bg-white">
            <Image
              src="/images/logo.png"
              alt="KKP Indonesia"
              width={48}
              height={44}
              className="h-auto w-auto"
              priority
            />
          </div>

          <div>
            <div className="text-sm font-semibold text-[var(--bc-accent)]">
              Blue Carbon Portal
            </div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--bc-primary)]">
              KEMENTERIAN KELAUTAN DAN PERIKANAN REPUBLIK INDONESIA
            </div>
          </div>
        </Link>

        {/* Desktop menu */}
        <nav className="hidden items-center gap-2 md:flex">
          {pages.map((page) => {
            const active =
              page.href === "/"
                ? pathname === "/"
                : pathname === page.href || pathname.startsWith(`${page.href}/`);

            return (
              <Link
                key={page.href}
                href={page.href}
                className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-[var(--bc-primary)] !text-white shadow hover:!text-white"
                    : "text-[var(--bc-muted)] hover:bg-[rgba(11,60,93,0.06)]"
                }`}
              >
                <span className="text-inherit">{page.label}</span>
              </Link>
            );
          })}

          <div className="relative z-50">
            <button
              type="button"
              onClick={() => setOpenDropdown(!openDropdown)}
              className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                isCaseStudyActive
                  ? "bg-slate-900 text-white shadow"
                  : "bg-white text-slate-600 hover:bg-slate-200"
              }`}
            >
              Case Study
              <span className="ml-2">▼</span>
            </button>

            {openDropdown && (
              <div className="absolute left-0 z-50 mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-lg">
                {caseStudyItems.length === 0 ? (
                  <div className="px-4 py-2 text-sm text-slate-500">
                    Loading...
                  </div>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {caseStudyItems.map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={`/case-study/${item.slug}`}
                          className="block px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
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
              className="bc-input w-56 text-sm"
            />

            {searchOpen && search.trim() && (
              <div className="absolute right-0 z-50 mt-2 w-80 rounded-xl border bg-white shadow-lg">
                <div className="border-b px-4 py-2 text-xs font-semibold uppercase text-slate-400">
                  Interventions
                </div>

                {interventionResults.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-slate-500">
                    No intervention results
                  </div>
                ) : (
                  interventionResults.map((item) => (
                    <Link
                      key={item.slug}
                      href="/interventions"
                      className="block px-4 py-3 text-sm hover:bg-slate-50"
                      onClick={() => setSearchOpen(false)}
                    >
                      <div className="font-medium text-slate-800">
                        {item.title}
                      </div>
                      <div className="text-xs text-slate-500">
                        {item.summary}
                      </div>
                    </Link>
                  ))
                )}

                <div className="border-b border-t px-4 py-2 text-xs font-semibold uppercase text-slate-400">
                  Case Studies
                </div>

                {filteredSites.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-slate-500">
                    No case study results
                  </div>
                ) : (
                  filteredSites.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/case-study/${item.slug}`}
                      className="block px-4 py-3 text-sm hover:bg-slate-50"
                      onClick={() => setSearchOpen(false)}
                    >
                      <div className="font-medium text-slate-800">
                        {item.title}
                      </div>
                      <div className="text-xs text-slate-500">
                        {item.summary}
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
        </nav>

        {/* Mobile burger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--bc-border)] text-slate-700 transition hover:bg-slate-100 md:hidden"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <span className="relative block h-5 w-5">
              <span className="absolute left-1/2 top-1/2 h-0.5 w-5 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded bg-slate-700" />
              <span className="absolute left-1/2 top-1/2 h-0.5 w-5 -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded bg-slate-700" />
            </span>
          ) : (
            <span className="flex flex-col gap-1.5">
              <span className="block h-0.5 w-5 rounded bg-slate-700" />
              <span className="block h-0.5 w-5 rounded bg-slate-700" />
              <span className="block h-0.5 w-5 rounded bg-slate-700" />
            </span>
          )}
        </button>
      </div>

      {/* Mobile menu panel */}
      {mobileMenuOpen && (
        <div className="border-t border-[var(--bc-border)] bg-white px-4 pb-4 pt-3 shadow-lg md:hidden">
          <nav className="mx-auto max-w-7xl space-y-2">
            {pages.map((page) => {
              const active =
                page.href === "/"
                  ? pathname === "/"
                  : pathname === page.href ||
                    pathname.startsWith(`${page.href}/`);

              return (
                <Link
                  key={page.href}
                  href={page.href}
                  onClick={closeMobileMenu}
                  className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-[var(--bc-primary)] !text-white shadow hover:!text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {page.label}
                </Link>
              );
            })}

            <button
              type="button"
              onClick={() => setMobileCaseStudyOpen(!mobileCaseStudyOpen)}
              className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                isCaseStudyActive
                  ? "bg-slate-900 text-white shadow "
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span>Case Study</span>
              <span>{mobileCaseStudyOpen ? "▲" : "▼"}</span>
            </button>

            {mobileCaseStudyOpen && (
              <div className="space-y-1 rounded-2xl border border-slate-100 bg-slate-50 p-2">
                {caseStudyItems.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-slate-500">
                    Loading...
                  </div>
                ) : (
                  caseStudyItems.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/case-study/${item.slug}`}
                      onClick={closeMobileMenu}
                      className="block rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-white"
                    >
                      {item.title}
                    </Link>
                  ))
                )}
              </div>
            )}

            <div className="relative pt-2">
              <input
                type="text"
                value={search}
                onFocus={() => setSearchOpen(true)}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="bc-input w-full text-sm"
              />

              {searchOpen && search.trim() && (
                <div className="mt-2 max-h-[60vh] overflow-y-auto rounded-2xl border bg-white shadow-lg">
                  <div className="border-b px-4 py-2 text-xs font-semibold uppercase text-slate-400">
                    Interventions
                  </div>

                  {interventionResults.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-slate-500">
                      No intervention results
                    </div>
                  ) : (
                    interventionResults.map((item) => (
                      <Link
                        key={item.slug}
                        href="/interventions"
                        className="block px-4 py-3 text-sm hover:bg-slate-50"
                        onClick={closeMobileMenu}
                      >
                        <div className="font-medium text-slate-800">
                          {item.title}
                        </div>
                        <div className="text-xs text-slate-500">
                          {item.summary}
                        </div>
                      </Link>
                    ))
                  )}

                  <div className="border-b border-t px-4 py-2 text-xs font-semibold uppercase text-slate-400">
                    Case Studies
                  </div>

                  {filteredSites.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-slate-500">
                      No case study results
                    </div>
                  ) : (
                    filteredSites.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/case-study/${item.slug}`}
                        className="block px-4 py-3 text-sm hover:bg-slate-50"
                        onClick={closeMobileMenu}
                      >
                        <div className="font-medium text-slate-800">
                          {item.title}
                        </div>
                        <div className="text-xs text-slate-500">
                          {item.summary}
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}