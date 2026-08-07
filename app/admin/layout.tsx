import "./admin.css";
import "./admin-extra.css";
import { AdminLocaleProvider } from "./components/AdminLocale";
export default function AdminRootLayout({ children }: { children: React.ReactNode }) { return <AdminLocaleProvider>{children}</AdminLocaleProvider>; }
