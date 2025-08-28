"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PaletizadorOptionsModal from "../../../components/PaletizadorModal";
import { FaSearch } from "react-icons/fa";

export default function PaletizadorPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [selecionarTodos, setSelecionarTodos] = useState(false);
  const [checkboxesSelecionados, setCheckboxesSelecionados] = useState({});
  const [paletizadores, setPaletizadores] = useState([]);
  const [pagina, setPagina] = useState(1);
  const porPagina = 10;

  useEffect(() => {
    const fetchPaletizadores = async () => {
      try {
        const response = await fetch(
          `http://191.101.71.157:3334/api/v1/paletizador/listar?nome=${searchTerm}&pagina=${pagina}&porPagina=${porPagina}`
        );
        const data = await response.json();
        setPaletizadores(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erro ao buscar paletizadores:", error);
        setPaletizadores([]);
      }
    };
    fetchPaletizadores();
  }, [searchTerm, pagina]);

  const filteredPaletizador = paletizadores.filter(
    (item) =>
      (statusFilter === "todos" || item.status === statusFilter) &&
      String(item.nome || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => router.push("/cadastro/paletizador/novoPaletizador");

  return (
    <div className="mx-auto my-10 w-full max-w-[1042px] px-4">
      {/* Cabeçalho */}
      <div className="relative mb-12 flex flex-col items-start gap-3">
        <h1 className="m-0 text-[35px] font-bold text-[#3B447B]">Paletizadores</h1>

        {/* Busca padronizada */}
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

        {/* Botão incluir */}
        <button
          onClick={handleAdd}
          className="md:absolute md:right-0 md:top-8 inline-flex h-[38px] w-[172px] items-center justify-center rounded-full bg-[#3B447B] px-4 text-[16px] font-bold text-white transition-colors hover:bg-[#2E365F] focus:outline-none focus:ring-2 focus:ring-[#3B447B]/30"
        >
          Incluir Paletizador
        </button>
      </div>

      {/* Filtros de status */}
      <div className="mb-4 flex flex-wrap gap-10 pl-[60px] text-[20px]">
        {["todos", "ativo", "inativo", "excluido"].map((status) => {
          const active = statusFilter === status;
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`flex items-center gap-2 rounded px-2 py-1 font-['Roboto_Slab'] font-bold capitalize transition-colors ${
                active ? "text-[#3B447B]" : "text-[#676363] hover:text-[#3B447B]"
              }`}
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
                    filteredPaletizador.forEach((it) => {
                      novo[it.id] = marcado;
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
                {/* status */}
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredPaletizador.map((paletizador) => (
              <tr key={paletizador.id} className="border-b border-gray-200">
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    className="h-[19px] w-[21px] accent-[#07ABA0]"
                    checked={checkboxesSelecionados[paletizador.id] || false}
                    onChange={(e) => {
                      const novo = {
                        ...checkboxesSelecionados,
                        [paletizador.id]: e.target.checked,
                      };
                      setCheckboxesSelecionados(novo);
                      const todos = filteredPaletizador.length > 0 &&
                        filteredPaletizador.every((it) => novo[it.id]);
                      setSelecionarTodos(todos);
                    }}
                  />
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <PaletizadorOptionsModal motorista={paletizador} />
                    <span className="font-['Roboto_Slab'] text-[18px] leading-[23.74px] text-[#676363]">
                      {paletizador.nome}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2">
                  <img
                    src={`/icons/${paletizador.status}.svg`}
                    alt={paletizador.status}
                    className="mx-auto h-5 w-5"
                  />
                </td>
              </tr>
            ))}

            {filteredPaletizador.length === 0 && (
              <tr>
                <td colSpan={3} className="px-3 py-6 text-center text-[#676363]">
                  Nenhum paletizador encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* (Opcional) paginação futura */}
      {/* <div className="mt-4 flex items-center justify-end gap-2 text-sm text-[#676363]">
        <button
          disabled={pagina === 1}
          onClick={() => setPagina((p) => Math.max(1, p - 1))}
          className="rounded px-2 py-1 disabled:opacity-40 hover:bg-gray-100"
        >
          Anterior
        </button>
        <span className="px-2">Página {pagina}</span>
        <button
          onClick={() => setPagina((p) => p + 1)}
          className="rounded px-2 py-1 hover:bg-gray-100"
        >
          Próxima
        </button>
      </div> */}
    </div>
  );
}
