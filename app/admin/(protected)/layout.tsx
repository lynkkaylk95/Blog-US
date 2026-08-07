import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "../../admin-auth";
import { AdminShell } from "../components/AdminShell";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  if (!await isAdminAuthenticated()) redirect("/admin/login");
  return <AdminShell>{children}</AdminShell>;
}
