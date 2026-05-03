import { apiFetch } from "@/lib/api";
import HomeConfigForm from "@/components/admin/home/HomeConfigForm";
import type { HomeConfigFormData } from "@/types/admin";

export default async function Page() {
  const data = await apiFetch<HomeConfigFormData>("/admin/home");
  return <HomeConfigForm initialData={data} />;
}