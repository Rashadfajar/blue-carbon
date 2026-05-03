import CaseStudyPage from "@/components/case-study/CaseStudyPage";
import { apiFetch } from "@/lib/api";
import type { SiteDetailResponse } from "@/types/api";

export default async function Page({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const data = await apiFetch<SiteDetailResponse>(
    `/sites/${slug}`
  );

  return <CaseStudyPage data={data} />;
}