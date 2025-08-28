// src/app/home/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { MdFormatListBulleted } from "react-icons/md";
import { FiX } from "react-icons/fi";
import { FaBuilding, FaUser, FaSignOutAlt } from "react-icons/fa";

export default function HomePage() {
  const [userName, setUserName] = useState("Usuário");
  const [greeting, setGreeting] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/"); return; }
    try {
      const decoded = jwtDecode(token);
      const nome = decoded?.Nome || decoded?.username || decoded?.email || "Usuário";
      setUserName(String(nome).toUpperCase());
    } catch {
      router.push("/"); return;
    }
    const update = () => {
      const h = new Date().getHours();
      setGreeting(h >= 5 && h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite");
    };
    update(); const i = setInterval(update, 60000);
    setLoading(false); return () => clearInterval(i);
  }, [router]);

  const handleLogout = () => { localStorage.removeItem("token"); router.push("/"); };
  const toggleModal = () => setIsModalOpen((v) => !v);

  if (loading) return <div className="p-6 text-center">Carregando...</div>;

  return (
    <>
      {/* Header da página (botão da modal, não do sidebar) */}
      <div className="w-full flex items-center justify-end p-3">
        <button
          onClick={toggleModal}
          className="inline-flex h-[45px] w-[45px] items-center justify-center rounded-lg border
                     bg-[#3B447B] text-white transition-transform hover:scale-105"
          aria-label="Abrir opções"
        >
          <MdFormatListBulleted size={20} />
        </button>
      </div>

      {/* Conteúdo principal (o layout já adiciona md:ml-64) */}
      {!isModalOpen && (
        <div className="flex w-full flex-col items-center">
          <div className="w-full max-w-5xl px-5 pb-2 text-center">
            <h1 className="mb-1 font-['Roboto_Slab'] text-[clamp(22px,5vw,32px)] font-bold text-[#3B447B] text-center">
              {greeting}, {userName}
            </h1>
            <p className="font-['Roboto_Slab'] text-[clamp(14px,2vw,16px)] font-bold text-[#07ABA0] text-center">
              Seja Bem-Vindo ao Sistema de Controle de Produção da <span>EMPRESA CLIENTE</span>.
            </p>
          </div>

          <hr className="mt-2 h-[2px] w-full bg-gradient-to-r from-[#07ABA0] via-[#CCCCCC] to-[#999999] border-0" />

          <section className="mx-auto w-full max-w-[900px] px-5 py-10 text-center">
            <h2 className="mb-1 font-['Roboto_Slab'] text-[clamp(20px,3vw,26px)] font-bold text-[#3B447B] text-center">
              Precisa de ajuda?
            </h2>
            <div className="flex w-full flex-col items-center gap-3 p-5 sm:flex-row sm:justify-center sm:gap-5">
              <div className="mx-2 my-2 flex w-full max-w-[450px] flex-col items-center justify-center rounded-2xl p-6">
                <img src="/logo-help.svg" alt="Fale conosco" className="mb-5 h-auto w-full max-w-full" />
              </div>
              <div className="mx-2 my-2 flex w-full max-w-[450px] flex-col items-center justify-center rounded-2xl p-6">
                <img src="/logo-video.svg" alt="Vídeos tutoriais" className="mb-5 h-auto w-full max-w-full" />
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Modal (igual antes) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2" role="dialog" aria-modal="true">
          <div className="relative flex h-[clamp(180px,30vh,213px)] w-[clamp(250px,40vw,309px)] flex-col items-center justify-center rounded-2xl border border-[#3B447B] bg-[#3B447B] p-5 text-white">
            <button onClick={toggleModal} className="absolute right-2 top-2 text-white hover:opacity-80" aria-label="Fechar">
              <FiX size={18} />
            </button>
            <ul className="flex w-full flex-col items-center justify-center gap-3">
              <li className="flex w-full cursor-pointer items-center justify-center gap-2 py-1 text-[clamp(16px,2vw,18px)] hover:opacity-80">
                <FaBuilding /> Dados da Empresa
              </li>
              <li className="flex w-full cursor-pointer items-center justify-center gap-2 py-1 text-[clamp(16px,2vw,18px)] hover:opacity-80">
                <FaUser /> Dados do Usuário
              </li>
              <li onClick={handleLogout} className="flex w-full cursor-pointer items-center justify-center gap-2 py-1 text-[clamp(16px,2vw,18px)] hover:opacity-80">
                <FaSignOutAlt /> Sair
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
