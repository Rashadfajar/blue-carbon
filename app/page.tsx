import HomePage from "@/components/home/HomePage";
import { apiFetch } from "@/lib/api";
import type { HomeResponse } from "@/types/api";

export default async function Page() {
  const data = await apiFetch<HomeResponse>("/home");
  return <HomePage data={data} />;
}