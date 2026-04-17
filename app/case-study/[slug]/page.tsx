import CaseStudyPage from "@/components/case-study/CaseStudyPage";
import { apiFetch } from "@/lib/api";
import type { SiteDetailResponse } from "@/types/api";

export default async function Page({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params; // ✅ WAJIB di-await

  const data = await apiFetch<SiteDetailResponse>(
    `/sites/${encodeURIComponent(slug)}`
  );

  return <CaseStudyPage data={data} />;
}