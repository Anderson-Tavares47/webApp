"use client";

import { useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import "../styles/globals.css";
import Sidebar from "../components/Sidebar";
import { FaBars } from "react-icons/fa";

export default function RootLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Rotas em que o Sidebar NÃO deve aparecer
  const HIDE_SIDEBAR_ROUTES = ["/login", "/auth/login", "/sign-in"];

  const hideSidebar = useMemo(() => {
    if (!pathname) return false;
    return HIDE_SIDEBAR_ROUTES.some(
      (base) => pathname === base || pathname.startsWith(`${base}/`)
    );
  }, [pathname]);

  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-white">
        {!hideSidebar && (
          <Sidebar
            isOpen={sidebarOpen}
            toggleSidebar={() => setSidebarOpen((v) => !v)}
          />
        )}

        {!hideSidebar && (
          <button
            aria-label="Abrir menu"
            onClick={() => setSidebarOpen(true)}
            className="fixed left-3 top-3 z-50 inline-flex h-10 w-10 items-center justify-center
                       rounded-lg bg-[#3B447B] text-white shadow-md md:hidden"
          >
            <FaBars />
          </button>
        )}

        <main className={`transition-all ${!hideSidebar ? "md:ml-64" : ""}`}>
          {children}
        </main>
      </body>
    </html>
  );
}
