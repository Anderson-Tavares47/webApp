// src/app/cadastro/operadores/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import ModalOptionsOperador from "@/components/ModalOptionsOperador";
import axios from "axios";

export default function OperadoresPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [selecionarTodos, setSelecionarTodos] = useState(false);
  const [checkboxesSelecionados, setCheckboxesSelecionados] = useState({});
  const [operadores, setOperadores] = useState([]);

  // Busca operadores conforme a pesquisa
  useEffect(() => {
    const fetchOperadores = async () => {
      try {
        const res = await axios.get(
          "http://191.101.71.157:3334/api/v1/operador/listar",
          { params: { nome: searchTerm, pagina: 1, porPagina: 100 } }
        );
        setOperadores(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Erro ao buscar operadores:", error);
      }
    };
    fetchOperadores();
  }, [searchTerm]);

  // Filtra por status + busca
  const filteredOperadores = useMemo(() => {
    return operadores.filter(
      (operador) =>
        (statusFilter === "todos" || operador.status === statusFilter) &&
        String(operador.nome).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [operadores, statusFilter, searchTerm]);

  // Sincroniza “selecionar todos” e limpa seleção quando a lista fica vazia
  useEffect(() => {
    if (filteredOperadores.length === 0) {
      // só atualiza se necessário para não entrar em loop
      if (selecionarTodos) setSelecionarTodos(false);
      if (Object.keys(checkboxesSelecionados).length > 0) {
        setCheckboxesSelecionados({});
      }
      return;
    }

    const allChecked = filteredOperadores.every(
      (op) => !!checkboxesSelecionados[op.id]
    );

    // evita setState redundante
    if (allChecked !== selecionarTodos) {
      setSelecionarTodos(allChecked);
    }
  }, [filteredOperadores, checkboxesSelecionados, selecionarTodos]);

  // UI
  return (
    <div className="mx-auto my-10 w-full max-w-[1042px] px-4">
      {/* Cabeçalho */}
      <div className="relative mb-12 flex flex-col items-start gap-3">
        <h1 className="m-0 text-[35px] font-bold text-[#3B447B]">Operadores</h1>

        {/* Busca */}
        <div className="relative h-[46px] w-full max-w-[500px] rounded bg-[#D9D9D9]/70 px-3">
          <input
            type="text"
            placeholder="Pesquise por nome"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-full w-full bg-transparent pr-9 text-[16px] text-gray-800 placeholder-black/60 outline-none"
          />
          <FaSearch className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[16px] text-gray-500" />
        </div>

        {/* Botão Incluir operador (Link) */}
        <Link
          href="/cadastro/operadores/novoOperador"
          className="md:absolute md:right-0 md:top-8 z-20 inline-flex h-[38px] w-[172px] items-center justify-center rounded-full bg-[#3B447B] px-4 text-[16px] font-bold text-white transition-colors hover:bg-[#2E365F] focus:outline-none focus:ring-2 focus:ring-[#3B447B]/30"
        >
          Incluir operador
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
                <img
                  src={`/icons/${status}.svg`}
                  alt={status}
                  className="h-5 w-5"
                />
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
                    filteredOperadores.forEach((operador) => {
                      novo[operador.id] = marcado;
                    });
                    setCheckboxesSelecionados(novo);
                    setSelecionarTodos(marcado);
                  }}
                />
              </th>
              <th className="w-[75%] px-3 py-2 text-left font-normal text-[18px] text-[#676363] font-['Roboto_Slab']">
                Nome
              </th>
              <th className="w-[10%] px-3 py-2 text-left font-normal text-[18px] text-[#676363] font-['Roboto_Slab']">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredOperadores.map((operador) => (
              <tr key={operador.id} className="border-b border-gray-200">
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    className="h-[19px] w-[21px] accent-[#07ABA0]"
                    checked={checkboxesSelecionados[operador.id] || false}
                    onChange={(e) => {
                      const novoEstado = {
                        ...checkboxesSelecionados,
                        [operador.id]: e.target.checked,
                      };
                      setCheckboxesSelecionados(novoEstado);
                      // não mexe em selecionarTodos aqui; o efeito acima sincroniza
                    }}
                  />
                </td>

                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <ModalOptionsOperador className="cursor-pointer text-gray-600 hover:text-gray-800" />
                    <span className="text-[18px] leading-[23.74px] text-black font-['Roboto_Slab']">
                      {operador.nome}
                    </span>
                  </div>
                </td>

                <td className="px-3 py-2">
                  <img
                    src={`/icons/${operador.status}.svg`}
                    alt={operador.status}
                    className="mx-auto h-5 w-5"
                  />
                </td>
              </tr>
            ))}

            {filteredOperadores.length === 0 && (
              <tr>
                <td colSpan={3} className="px-3 py-6 text-center text-gray-500">
                  Nenhum operador encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
