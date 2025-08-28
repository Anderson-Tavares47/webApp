"use client";

import { useState } from "react";
import { FaPlus, FaCalendarAlt } from "react-icons/fa";
import Sidebar from "@/components/Sidebar";
import "../../../styles/manutencao.css";
import { useRouter } from "next/navigation"; // ✅ Importando o roteamento
import ModalOptionsManutencao from "@/components/ModalManutencao";
export default function Manutencao() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [statusSelecionado, setStatusSelecionado] = useState("todos");
  const [exibirOpcoesPeriodo, setExibirOpcoesPeriodo] = useState(false); // ✅ Estado para exibir as opções do período
  const [placaPesquisa, setPlacaPesquisa] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const router = useRouter(); // ✅ Instanciando o roteador
  const [checkboxesSelecionados, setCheckboxesSelecionados] = useState({});
  const [selecionarTodos, setSelecionarTodos] = useState(false);

  const togglePeriodo = () => {
    setExibirOpcoesPeriodo(!exibirOpcoesPeriodo);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  // ✅ Função para navegar até a página de nova manutenção
  const handleNovaManutencao = () => {
    router.push("/logistica/manutencao/novaManutencao");
  };
  const manutencoes = [...Array(10)].map((_, index) => ({
    num: index + 1,
    data: `0${index + 1}/01/2025`,
    placa: index % 2 === 0 ? "HTX 900-01" : "HTX 900-02",
    km: "09:00:25",
    motorista: index % 2 === 0 ? "Juarez" : "Emmanuel",
    componente: [
      "VIBROPRENSA",
      "CENTRAL DOSADORA",
      "MISTURADOR",
      "ROBÔ PALETIZADOR",
      "ESTEIRA 1 MISTURADOR",
      "CARRINHO DAS TÁBUAS",
      "PARAFUSO DO CONTRA MOLDE",
      "CORREIA DA EXTRATORA",
      "PAINEL CLP",
    ][index % 9],
    tipo:
      index % 3 === 0 ? "CORRETIVA" : index % 2 === 0 ? "AJUSTE" : "PREVENTIVA",
    valor: ["00:30", "01:00", "00:15", "00:35", "00:17"][index % 5],
    status:
      index % 3 === 0
        ? "finalizada"
        : index % 2 === 0
        ? "em andamento"
        : "pendente",
  }));

  const manutencoesFiltradas = manutencoes
    .filter(
      (m) => statusSelecionado === "todos" || m.status === statusSelecionado
    )
    .filter((m) => m.placa.toLowerCase().includes(placaPesquisa.toLowerCase()));

  // Configuração da paginação
  const itensPorPagina = 10;
  const totalPaginas = 2; // Definimos 2 páginas fixas: 01 (com dados) e 02 (vazia)
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const manutencoesPaginadas =
    paginaAtual === 1 ? manutencoesFiltradas.slice(inicio, fim) : [];

  return (
    <div
      className={`manutencao-container ${isSidebarOpen ? "sidebar-open" : ""}`}
    >
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="manutencao-content">
        {/* ✅ Cabeçalho */}
        <div className="manutencao-header">
          <h1 className="manutencao-title">Manutenções</h1>
          <button className="incluir-manutencao" onClick={handleNovaManutencao}>
            <FaPlus /> incluir manutenção
          </button>
        </div>

        {/* ✅ Filtros */}
        <div className="filtros">
          <input
            type="text"
            placeholder="Pesquise por placa"
            className="input-busca-placa"
            value={placaPesquisa}
            onChange={(e) => setPlacaPesquisa(e.target.value)}
          />
          <button className="filtro-botao" onClick={togglePeriodo}>
            <FaCalendarAlt /> por período
          </button>
        </div>

        {/* ✅ Opções de Filtro de Período */}
        {exibirOpcoesPeriodo && (
          <div className="periodo-opcoes">
            <label>Período</label>
            <button className="periodo-btn">Sem Filtro</button>
            <button className="periodo-btn">Do Dia</button>
            <button className="periodo-btn">Do Mês</button>
            <button className="periodo-btn">Do Intervalo</button>
          </div>
        )}

        {/* ✅ Abas de status */}
        <div className="status-filtros">
          <span
            className={`status-todos ${
              statusSelecionado === "todos" ? "ativo" : ""
            }`}
            onClick={() => setStatusSelecionado("todos")}
          >
            todos
          </span>
          <span
            className={`status-andamento ${
              statusSelecionado === "em andamento" ? "ativo" : ""
            }`}
            onClick={() => setStatusSelecionado("em andamento")}
          >
            ● em andamento
          </span>
          <span
            className={`status-finalizada ${
              statusSelecionado === "finalizada" ? "ativo" : ""
            }`}
            onClick={() => setStatusSelecionado("finalizada")}
          >
            ● finalizada
          </span>
          <span
            className={`status-pendente ${
              statusSelecionado === "pendente" ? "ativo" : ""
            }`}
            onClick={() => setStatusSelecionado("pendente")}
          >
            ● pendente
          </span>
        </div>

        <hr className="status-divider" />

        {/* ✅ Tabela de Manutenção */}
        <div className="tabela-manutencao-container">
          <table className="tabela-manutencao">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selecionarTodos}
                    onChange={(e) => {
                      const marcado = e.target.checked;
                      setSelecionarTodos(marcado);

                      const novoEstado = {};
                      manutencoesPaginadas.forEach((manutencao) => {
                        novoEstado[manutencao.num] = marcado;
                      });

                      setCheckboxesSelecionados(novoEstado);
                    }}
                  />
                </th>
                <th>Num</th>
                <th>Ações</th>
                <th>Data</th>
                <th>Placa</th>
                <th>Km</th>
                <th>Motorista</th>
                <th>Componente</th>
                <th>Tipo da Manutenção</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {manutencoesPaginadas.length > 0 ? (
                manutencoesPaginadas.map((manutencao) => (
                  <tr key={manutencao.num}>
                    <td>
                      <input
                        type="checkbox"
                        checked={
                          checkboxesSelecionados[manutencao.num] || false
                        }
                        onChange={(e) => {
                          const novoEstado = {
                            ...checkboxesSelecionados,
                            [manutencao.num]: e.target.checked,
                          };

                          setCheckboxesSelecionados(novoEstado);

                          const todosSelecionados = manutencoesPaginadas.every(
                            (m) => novoEstado[m.num]
                          );
                          setSelecionarTodos(todosSelecionados);
                        }}
                      />
                    </td>
                    <td>{manutencao.num}</td>
                    <td className="acoes">
                      <ModalOptionsManutencao />
                    </td>
                    <td>{manutencao.data}</td>
                    <td>{manutencao.placa}</td>
                    <td>{manutencao.km}</td>
                    <td>{manutencao.motorista}</td>
                    <td>{manutencao.componente}</td>
                    <td>{manutencao.tipo}</td>
                    <td>{manutencao.valor}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="sem-resultados">
                    Nenhuma manutenção disponível.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação fixa com seta "→" */}
        <div className="paginacao">
          <span
            className={paginaAtual === 1 ? "ativo" : ""}
            onClick={() => setPaginaAtual(1)}
          >
            01
          </span>
          <span
            className={paginaAtual === 2 ? "ativo" : ""}
            onClick={() => setPaginaAtual(2)}
          >
            02
          </span>
          <span className="seta">→</span>
        </div>
      </div>
    </div>
  );
}
