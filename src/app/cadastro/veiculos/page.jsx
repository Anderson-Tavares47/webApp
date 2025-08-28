"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import VeiculosOptionsModal from "../../../components/ModalVeiculos";
import { FaSearch } from "react-icons/fa";

export default function VeiculoPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [selecionarTodos, setSelecionarTodos] = useState(false);
  const [checkboxesSelecionados, setCheckboxesSelecionados] = useState({});
  const [veiculos, setVeiculos] = useState([]);

  const handleNovoVeiculo = () => router.push("/cadastro/veiculos/novoVeiculo");

  const fetchVeiculos = async () => {
    try {
      const params = new URLSearchParams({
        modelo: searchTerm,
        pagina: "1",
        porPagina: "10",
      });
      const response = await fetch(
        `http://191.101.71.157:3334/api/v1/veiculo/listar?${params.toString()}`
      );
      const data = await response.json();
      if (Array.isArray(data)) setVeiculos(data);
      else setVeiculos([]);
    } catch (error) {
      console.error("Erro de conexão:", error);
    }
  };

  useEffect(() => {
    fetchVeiculos();
  }, [searchTerm]);

  const filteredVeiculos = veiculos.filter(
    (v) => statusFilter === "todos" || v.status === statusFilter
  );

  return (
    <div className="mx-auto my-10 w-full max-w-[1042px] px-4 text-left">
      {/* Header */}
      <div className="relative mb-12 flex flex-col items-start gap-3">
        <h1 className="font-['Roboto_Slab'] text-[35px] font-bold text-[#3B447B]">
          Veículos
        </h1>

        {/* Busca */}
        <div className="relative flex h-[38px] w-full max-w-[500px] items-center rounded bg-[#D9D9D9]/70 px-3">
          <input
            type="text"
            placeholder="Pesquise por Modelo"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-full w-full bg-transparent pr-8 text-[18px] font-['Roboto_Slab'] text-[#676363] outline-none placeholder-[#676363]/50"
          />
          <FaSearch className="absolute right-3 text-[18px] text-[#888]" />
        </div>

        {/* Botão novo */}
        <button
          onClick={handleNovoVeiculo}
          className="absolute right-0 top-8 inline-flex h-[38px] w-[172px] items-center justify-center rounded-full bg-[#3B447B] text-[18px] font-bold text-white transition-colors hover:bg-[#2E365F] focus:outline-none focus:ring-2 focus:ring-[#3B447B]/30"
        >
          Incluir veículo
        </button>
      </div>

      {/* Filtros */}
      <div className="mb-4 flex flex-wrap gap-10 pl-16 text-[20px] font-['Roboto_Slab'] font-bold">
        {[
          { key: "todos", label: "todos" },
          { key: "#00BCC2", label: "ativos", icon: "/icons/ativo.svg" },
          { key: "#A5A5A5", label: "inativos", icon: "/icons/inativo.svg" },
          { key: "#E04545", label: "excluídos", icon: "/icons/excluido.svg" },
        ].map((f) => (
          <span
            key={f.key}
            onClick={() => setStatusFilter(f.key)}
            className={`flex cursor-pointer items-center gap-2 ${
              statusFilter === f.key ? "text-[#3B447B]" : "text-[#676363]"
            }`}
          >
            {f.icon && <img src={f.icon} alt={f.label} className="h-4 w-4" />}
            {f.label}
          </span>
        ))}
      </div>

      {/* Divider gradiente */}
      <div className="mb-4 h-[2px] w-full bg-gradient-to-r from-[#07ABA0] via-[#CCCCCC] to-[#999999]" />

      {/* Tabela */}
      <div className="overflow-x-auto rounded-md border border-transparent [border-image:linear-gradient(to_right,#999999,#CCCCCC,#999999)_1]">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b border-[#DDDDDD]">
              <th className="px-3 py-2 text-left font-['Roboto_Slab'] text-[18px] font-normal text-[#676363]">
                <input
                  type="checkbox"
                  className="h-[19px] w-[21px] cursor-pointer accent-[#07ABA0]"
                  checked={selecionarTodos}
                  onChange={(e) => {
                    const marcado = e.target.checked;
                    setSelecionarTodos(marcado);
                    const novoEstado = {};
                    filteredVeiculos.forEach((v) => {
                      novoEstado[v.id] = marcado;
                    });
                    setCheckboxesSelecionados(novoEstado);
                  }}
                />
              </th>
              {["Modelo", "Placa", "Marca", "Ano", "Tipo", ""].map((h) => (
                <th
                  key={h}
                  className="px-3 py-2 text-left font-['Roboto_Slab'] text-[18px] font-normal text-[#676363]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredVeiculos.map((veiculo) => (
              <tr key={veiculo.id} className="border-b border-[#DDDDDD]">
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    className="h-[19px] w-[21px] cursor-pointer accent-[#07ABA0]"
                    checked={checkboxesSelecionados[veiculo.id] || false}
                    onChange={(e) => {
                      const novoEstado = {
                        ...checkboxesSelecionados,
                        [veiculo.id]: e.target.checked,
                      };
                      setCheckboxesSelecionados(novoEstado);
                      const todosSelecionados =
                        filteredVeiculos.length > 0 &&
                        filteredVeiculos.every((item) => novoEstado[item.id]);
                      setSelecionarTodos(todosSelecionados);
                    }}
                  />
                </td>
                <td className="px-3 py-2 font-['Roboto_Slab'] text-[18px] text-[#676363]">
                  <div className="flex items-center gap-2">
                    <VeiculosOptionsModal veiculo={veiculo} />
                    {veiculo.modelo}
                  </div>
                </td>
                <td className="px-3 py-2 font-['Roboto_Slab'] text-[18px] text-[#676363]">
                  {veiculo.placa}
                </td>
                <td className="px-3 py-2 font-['Roboto_Slab'] text-[18px] text-[#676363]">
                  {veiculo.marca}
                </td>
                <td className="px-3 py-2 font-['Roboto_Slab'] text-[18px] text-[#676363]">
                  {veiculo.ano}
                </td>
                <td className="px-3 py-2 font-['Roboto_Slab'] text-[18px] text-[#676363]">
                  {veiculo.tipo}
                </td>
                <td className="px-3 py-2">
                  <span
                    className="inline-block h-[10px] w-[10px] rounded-full"
                    style={{ backgroundColor: veiculo.status }}
                  />
                </td>
              </tr>
            ))}

            {filteredVeiculos.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-3 py-6 text-center font-['Roboto_Slab'] text-[18px] text-[#676363]"
                >
                  Nenhum veículo encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
