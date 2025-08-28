"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaBars, FaTimes, FaHome, FaChartBar, FaClipboardList, FaUser, FaBox,
  FaIndustry, FaBoxes, FaClipboardCheck, FaFileAlt, FaChartLine, FaCheckSquare,
  FaSearch
} from "react-icons/fa";
import { FaHouse, FaTruckFront, FaBoxOpen } from "react-icons/fa6";
import { IoSettings, IoChevronDown } from "react-icons/io5";
import { SlPeople } from "react-icons/sl";
import { LiaPalletSolid } from "react-icons/lia";
import { GiVendingMachine } from "react-icons/gi";
import { AiFillCar } from "react-icons/ai";

const menuItems = [
  {
    title: "Dashboard",
    icon: <FaHome />,
    link: "/home",
    submenu: [
      { title: "Visão Geral", icon: <FaChartBar />, link: "#" },
      { title: "Relatórios Gráficos", icon: <FaClipboardList />, link: "#" },
    ],
  },
  {
    title: "Cadastros",
    icon: <FaUser />,
    link: "#",
    submenu: [
      { title: "Operador", icon: <FaUser />, link: "/cadastro/operadores" },
      { title: "Máquinas", icon: <GiVendingMachine />, link: "/cadastro/maquinas" },
      { title: "Produto", icon: <FaBox />, link: "/cadastro/produto" },
      { title: "Motorista", icon: <FaUser />, link: "/cadastro/motorista" },
      { title: "Clientes", icon: <SlPeople />, link: "/cadastro/clientes" },
      { title: "Paletizador", icon: <LiaPalletSolid />, link: "/cadastro/paletizador" },
      { title: "Veículos", icon: <AiFillCar />, link: "/cadastro/veiculos" },
    ],
  },
  {
    title: "Produções",
    icon: <FaIndustry />,
    link: "#",
    submenu: [{ title: "Listar Produções", icon: <FaFileAlt />, link: "/producao" }],
  },
  {
    title: "Suprimentos",
    icon: <FaBoxes />,
    link: "#",
    submenu: [
      { title: "Controle de Estoque", icon: <FaCheckSquare />, link: "/suprimentos" },
      { title: "Depósitos", icon: <FaBox />, link: "/suprimentos/deposito" },
    ],
  },
  {
    title: "Logística",
    icon: <FaTruckFront />,
    link: "#",
    submenu: [
      { title: "Entregas", icon: <FaBoxOpen />, link: "/logistica/entregas" },
      { title: "Manutenções", icon: <IoSettings />, link: "/logistica/manutencao" },
    ],
  },
  {
    title: "Relatórios",
    icon: <FaClipboardCheck />,
    link: "#",
    submenu: [
      { title: "Relatórios de Produção", icon: <FaFileAlt />, link: "#" },
      { title: "Análise de Desempenho", icon: <FaChartLine />, link: "#" },
      { title: "Controle de Qualidade", icon: <FaCheckSquare />, link: "#" },
    ],
  },
];

export default function Sidebar({ isOpen, toggleSidebar }) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [expanded, setExpanded] = useState(true);
  const [openMenus, setOpenMenus] = useState({});

  useEffect(() => {
    const next = {};
    menuItems.forEach((item, idx) => {
      if (item.title === "Dashboard") next[idx] = true;
      if (item.submenu?.some((s) => pathname.startsWith(s.link))) next[idx] = true;
    });
    setOpenMenus(next);
  }, [pathname]);

  const goHome = () => {
    if (pathname !== "/home") router.push("/home");
  };

  const filteredMenu = useMemo(() => {
    if (!searchQuery) return menuItems;
    const q = searchQuery.toLowerCase();
    return menuItems
      .map((item) => {
        const sub = item.submenu?.filter((s) =>
          s.title.toLowerCase().includes(q)
        ) ?? [];
        if (item.title.toLowerCase().includes(q) || sub.length) {
          return { ...item, submenu: sub };
        }
        return null;
      })
      .filter(Boolean);
  }, [searchQuery]);

  const toggleGroup = (idx) => setOpenMenus((p) => ({ ...p, [idx]: !p[idx] }));

  const shell =
    "fixed left-0 top-0 z-40 h-screen bg-[#3b447b] text-white shadow-xl transition-all duration-300";
  const widthDesktop = expanded ? "md:w-64" : "md:w-16";
  const mobileSlide = isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0";

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black/40 md:hidden transition-opacity ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={toggleSidebar}
      />

      <aside className={`${shell} w-64 ${widthDesktop} ${mobileSlide}`}>
        <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-3">
          <button
            onClick={toggleSidebar}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 md:hidden"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>

          <button
            onClick={goHome}
            className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm hover:text-[#07ABA0]"
          >
            <FaHouse />
            {expanded && <span className="hidden md:inline">Painel Principal</span>}
          </button>

          <button
            onClick={() => setExpanded((v) => !v)}
            className="hidden h-9 w-9 items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 md:inline-flex"
          >
            <FaBars className={`${expanded ? "rotate-90 transition-transform" : ""}`} />
          </button>
        </div>

        <div className="px-3 py-3">
          <div className="flex items-center rounded-lg bg-white/20 px-3">
            <FaSearch className="mr-2 shrink-0 opacity-80" />
            <input
              className="w-full bg-transparent py-2 text-sm placeholder-white/70 focus:outline-none"
              placeholder="Busca rápida..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <nav className="overflow-y-auto px-2 pb-6">
          <ul className="space-y-1">
            {filteredMenu.map((item, idx) => {
              const groupActive =
                pathname.startsWith(item.link) ||
                item.submenu?.some((s) => pathname.startsWith(s.link));
              const open = !!openMenus[idx];

              return (
                <li key={item.title}>
                  <button
                    onClick={() => toggleGroup(idx)}
                    className={`group flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition
                      ${groupActive ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/20 hover:text-white"}`}
                  >
                    <span className="text-base">{item.icon}</span>
                    {expanded && <span className="flex-1">{item.title}</span>}
                    {item.submenu && (
                      <IoChevronDown
                        className={`ml-auto transition-transform ${open ? "rotate-180" : "rotate-0"} ${expanded ? "opacity-100" : "opacity-0"} `}
                      />
                    )}
                  </button>

                  {item.submenu && (
                    <ul
                      className={`ml-4 overflow-hidden transition-[max-height,opacity] duration-300 ${open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}
                    >
                      {item.submenu.map((sub) => {
                        const active = pathname.startsWith(sub.link);
                        return (
                          <li key={sub.title}>
                            <Link
                              href={sub.link}
                              className={`mt-1 flex items-center gap-3 rounded-md px-3 py-2 text-sm transition
                                ${active ? "bg-[#07ABA0] text-white" : "text-white/70 hover:bg-white/20 hover:text-white"}`}
                            >
                              <span className="text-base">{sub.icon}</span>
                              {expanded && <span>{sub.title}</span>}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
