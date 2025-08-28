// src/app/cadastro/maquinas/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import MaquinasOptionsModal from "@/components/ModalMaquinas";

export default function MaquinasPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [selecionarTodos, setSelecionarTodos] = useState(false);
  const [checkboxesSelecionados, setCheckboxesSelecionados] = useState({});
  const [maquinas, setMaquinas] = useState([]);

  const fetchMaquinas = async () => {
    try {
      const response = await fetch("http://191.101.71.157:3334/api/v1/maquina/listar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filtros: { id: 0, nome: searchTerm || "" },
          pagina: 1,
          porPagina: 50,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        // a API do seu exemplo retornava { maquinas: [...] }
        const list = Array.isArray(data?.maquinas) ? data.maquinas : Array.isArray(data) ? data : [];
        setMaquinas(list);
      } else {
        console.error("Erro ao buscar máquinas:", data);
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
    }
  };

  useEffect(() => {
    fetchMaquinas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const filteredMaquinas = useMemo(() => {
    return maquinas.filter(
      (maq) =>
        (statusFilter === "todos" || maq.status === statusFilter) &&
        String(maq.nome).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [maquinas, statusFilter, searchTerm]);

  // Sincroniza seleção total sem loops
  useEffect(() => {
    if (filteredMaquinas.length === 0) {
      if (selecionarTodos) setSelecionarTodos(false);
      if (Object.keys(checkboxesSelecionados).length > 0) setCheckboxesSelecionados({});
      return;
    }
    const allChecked = filteredMaquinas.every((m) => !!checkboxesSelecionados[m.id]);
    if (allChecked !== selecionarTodos) setSelecionarTodos(allChecked);
  }, [filteredMaquinas, checkboxesSelecionados, selecionarTodos]);

  return (
    <div className="mx-auto my-10 w-full max-w-[1042px] px-4">
      {/* Cabeçalho */}
      <div className="relative mb-12 flex flex-col items-start gap-3">
        <h1 className="m-0 text-[35px] font-bold text-[#3B447B]">Maquinas</h1>

        {/* Busca */}
        <div className="relative h-[46px] w-full max-w-[500px] rounded bg-[#D9D9D9]/70 px-3">
          <input
            type="text"
            placeholder="Pesquise por Modelo"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-full w-full bg-transparent pr-9 text-[16px] text-gray-800 placeholder-black/60 outline-none"
          />
          <FaSearch className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[16px] text-gray-500" />
        </div>

        {/* Botão incluir (Link) */}
        <Link
          href="/cadastro/maquinas/novaMaquina"
          className="md:absolute md:right-0 md:top-8 inline-flex h-[38px] w-[172px] items-center justify-center rounded-full bg-[#3B447B] px-4 text-[16px] font-bold text-white transition-colors hover:bg-[#2E365F] focus:outline-none focus:ring-2 focus:ring-[#3B447B]/30"
        >
          Incluir Máquina
        </Link>
      </div>

      {/* Filtros de status */}
      <div className="mb-4 flex flex-wrap gap-10 pl-[60px] text-[20px]">
        {["todos", "ativo", "inativo", "excluido"].map((status) => {
          const active = statusFilter === status;
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`flex items-center gap-2 rounded px-2 py-1 font-['Roboto_Slab'] font-bold capitalize transition-colors
                ${active ? "text-[#3B447B]" : "text-[#676363] hover:text-[#3B447B]"}`}
            >
              {status !== "todos" && (
                <img src={`/icons/${status}.svg`} alt={status} className="h-5 w-5" />
              )}
              {status}
            </button>
          );
        })}
      </div>

      {/* Linha gradiente */}
      <div className="mb-4 h-[2px] w-full bg-gradient-to-r from-[#07ABA0] via-[#CCCCCC] to-[#999999]" />

      {/* Tabela */}
      <div className="overflow-x-auto rounded-md border border-gray-200">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="w-[5%] px-3 py-2 text-left font-normal text-[18px] text-[#676363] font-['Roboto_Slab']">
                <input
                  type="checkbox"
                  className="h-[19px] w-[21px] accent-[#07ABA0]"
                  checked={selecionarTodos}
                  onChange={(e) => {
                    const marcado = e.target.checked;
                    const novo = { ...checkboxesSelecionados };
                    filteredMaquinas.forEach((maq) => {
                      novo[maq.id] = marcado;
                    });
                    setCheckboxesSelecionados(novo);
                    setSelecionarTodos(marcado);
                  }}
                />
              </th>
              <th className="w-[75%] px-3 py-2 text-left font-normal text-[18px] text-[#676363] font-['Roboto_Slab']">
                Modelo
              </th>
              <th className="w-[10%] px-3 py-2 text-left font-normal text-[18px] text-[#676363] font-['Roboto_Slab']">
                {/* status */}
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredMaquinas.map((maq) => (
              <tr key={maq.id} className="border-b border-gray-200">
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    className="h-[19px] w-[21px] accent-[#07ABA0]"
                    checked={checkboxesSelecionados[maq.id] || false}
                    onChange={(e) => {
                      const novo = { ...checkboxesSelecionados, [maq.id]: e.target.checked };
                      setCheckboxesSelecionados(novo);
                      // sincroniza “selecionarTodos” no efeito
                    }}
                  />
                </td>

                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <MaquinasOptionsModal maquinas={maq} />
                    <span className="text-[18px] leading-[23.74px] text-black font-['Roboto_Slab']">
                      {maq.nome}
                    </span>
                  </div>
                </td>

                <td className="px-3 py-2">
                  <img
                    src={`/icons/${maq.status}.svg`}
                    alt={maq.status}
                    className="mx-auto h-5 w-5"
                  />
                </td>
              </tr>
            ))}

            {filteredMaquinas.length === 0 && (
              <tr>
                <td colSpan={3} className="px-3 py-6 text-center text-gray-500">
                  Nenhuma máquina encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
