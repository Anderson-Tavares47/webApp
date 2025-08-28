"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MotoristaOptionsModal from "../../../components/ModalMotorista";
import { FaSearch } from "react-icons/fa";

export default function MotoristaPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [selecionarTodos, setSelecionarTodos] = useState(false);
  const [checkboxesSelecionados, setCheckboxesSelecionados] = useState({});
  const [operadores, setOperadores] = useState([]);

  const handleAddOperator = () => {
    router.push("/cadastro/motorista/novoMotorista");
  };

  const fetchMotoristas = async () => {
    try {
      const response = await fetch("http://191.101.71.157:3334/api/v1/motorista/listar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filtros: {
            nome: searchTerm,
            status: statusFilter === "todos" ? "" : statusFilter,
          },
          pagina: 1,
          porPagina: 100,
        }),
      });

      const data = await response.json();
      if (response.ok && data.dados) {
        setOperadores(data.dados);
      } else {
        setOperadores([]);
      }
    } catch (e) {
      console.error("Erro ao buscar motoristas:", e);
      setOperadores([]);
    }
  };

  useEffect(() => {
    fetchMotoristas();
  }, [searchTerm, statusFilter]);

  const filteredOperadores = operadores.filter((operador) => {
    return (
      (statusFilter === "todos" || operador.status === statusFilter) &&
      operador.nome?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="mx-auto my-10 w-full max-w-[1042px] px-4">
      {/* Cabeçalho */}
      <div className="relative mb-12 flex flex-col items-start gap-3">
        <h1 className="m-0 font-['Roboto_Slab'] text-[clamp(22px,3vw,35px)] font-bold text-[#3B447B]">
          Motorista
        </h1>

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

        {/* Botão incluir */}
        <button
          onClick={handleAddOperator}
          className="md:absolute md:right-0 md:top-8 inline-flex h-[38px] w-[172px] items-center justify-center rounded-full bg-[#3B447B] px-4 text-[16px] font-bold text-white transition-colors hover:bg-[#2E365F] focus:outline-none focus:ring-2 focus:ring-[#3B447B]/30"
        >
          Incluir Motorista
        </button>
      </div>

      {/* Filtros de status */}
      <div className="mb-4 flex flex-wrap gap-10 pl-[60px] text-[20px]">
        {[
          { key: "todos", label: "todos" },
          { key: "ativo", label: "ativos", icon: "/icons/ativo.svg" },
          { key: "inativo", label: "inativos", icon: "/icons/inativo.svg" },
          { key: "excluido", label: "excluídos", icon: "/icons/excluido.svg" },
        ].map((item) => {
          const active = statusFilter === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setStatusFilter(item.key)}
              className={`flex items-center gap-2 rounded px-2 py-1 font-['Roboto_Slab'] font-bold capitalize transition-colors
                ${active ? "text-[#3B447B]" : "text-[#676363] hover:text-[#3B447B]"}`}
            >
              {item.icon && <img src={item.icon} alt={item.key} className="h-5 w-5" />}
              {item.label}
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
              <th className="w-[5%] px-3 py-2 text-left font-['Roboto_Slab'] text-[18px] font-normal text-[#676363]">
                <input
                  type="checkbox"
                  className="h-[19px] w-[21px] accent-[#07ABA0]"
                  checked={selecionarTodos}
                  onChange={(e) => {
                    const marcado = e.target.checked;
                    setSelecionarTodos(marcado);
                    const novo = {};
                    filteredOperadores.forEach((m) => {
                      novo[m.id] = marcado;
                    });
                    setCheckboxesSelecionados(novo);
                  }}
                />
              </th>
              <th className="w-[75%] px-3 py-2 text-left font-['Roboto_Slab'] text-[18px] font-normal text-[#676363]">
                Nome
              </th>
              <th className="w-[10%] px-3 py-2 text-left font-['Roboto_Slab'] text-[18px] font-normal text-[#676363]">
                {/* status */}
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
                      const novo = { ...checkboxesSelecionados, [operador.id]: e.target.checked };
                      setCheckboxesSelecionados(novo);
                      const todos = filteredOperadores.length > 0 && filteredOperadores.every((op) => novo[op.id]);
                      setSelecionarTodos(todos);
                    }}
                  />
                </td>

                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <MotoristaOptionsModal motorista={operador} />
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
                  Nenhum motorista encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
