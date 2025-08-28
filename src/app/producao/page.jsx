"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import ModalOptionsProducao from "@/components/ModalProducao";
import {
  FaPrint,
  FaCalendarAlt,
  FaIndustry,
  FaFileAlt,
  FaEllipsisV,
} from "react-icons/fa";
import "../../styles/listarProducao.css";
import { TbListDetails } from "react-icons/tb";

export default function ListaDeProducao() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filtroPeriodo, setFiltroPeriodo] = useState("");
  const [statusSelecionado, setStatusSelecionado] = useState("todos");
  const [exibirOpcoesPeriodo, setExibirOpcoesPeriodo] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [selecionarTodos, setSelecionarTodos] = useState(false);
  const [checkboxesSelecionados, setCheckboxesSelecionados] = useState({});
  const [producoes, setProducoes] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const togglePeriodo = () => setExibirOpcoesPeriodo(!exibirOpcoesPeriodo);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const carregarProducoes = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://191.101.71.157:3334/api/v1/producao/listar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filtros: {
              id: 0,
              data: new Date().toISOString(),
              horaInicio: new Date().toISOString(),
              horaTermino: new Date().toISOString(),
            },
            pagina: 0,
            porPagina: 0,
          }),
        });

        const data = await response.json();
        setProducoes(data?.dados || []);
      } catch (error) {
        console.error("Erro ao carregar produções:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarProducoes();
  }, []);

  const producoesFiltradas = producoes.filter((p) => {
    const statusMatch = statusSelecionado === "todos" || p.status === statusSelecionado;
    const periodoMatch = !filtroPeriodo || p.data?.startsWith(filtroPeriodo);
    return statusMatch && periodoMatch;
  });

  const itensPorPagina = 10;
  const producoesPaginadas =
    paginaAtual === 1 ? producoesFiltradas.slice(0, itensPorPagina) : [];

  return (
    <div className={`lista-producao-container ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="lista-producao-content">
        <div className="lista-producao-header">
          <h1 className="lista-producao-title">Produções</h1>
          <div className="btn-producao">
            <button className="print-button" onClick={() => window.print()}>
              <FaPrint /> imprimir
            </button>
            <button className="btn-detalhes" onClick={() => router.push("/producao/producoes")}>
              <TbListDetails /> Detalhes produção
            </button>
          </div>
        </div>

        <div className="filtros">
          <input
            type="text"
            placeholder="Pesquise por máquina ou código"
            className="procurar"
          />
          <div className="periodo-wrapper">
            <input
              type="date"
              className="periodo-button"
              value={filtroPeriodo}
              onClick={togglePeriodo}
              onChange={(e) => setFiltroPeriodo(e.target.value)}
            />
          </div>
        </div>

        {exibirOpcoesPeriodo && (
          <div className="periodo-opcoes">
            <p>Período</p>
            <button className="periodo-btn">Sem Filtro</button>
            <button className="periodo-btn">Do Dia</button>
            <button className="periodo-btn">Do Mês</button>
            <button className="periodo-btn">Do Intervalo</button>
          </div>
        )}

        <div className="status-filtros">
          {["todos", "em andamento", "em aberto", "finalizada"].map((status) => (
            <span
              key={status}
              className={`status-${status.replace(" ", "-")} ${statusSelecionado === status ? "ativo" : ""}`}
              onClick={() => setStatusSelecionado(status)}
            >
              {status === "todos" ? "todos" : `● ${status}`}
            </span>
          ))}
        </div>

        <hr className="status-divider" />

        <div className="tabela-produtos-container">
          <table className="tabela-produtos">
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
                      producoesPaginadas.forEach((p, index) => {
                        novoEstado[index] = marcado;
                      });

                      setCheckboxesSelecionados(novoEstado);
                    }}
                  /> Num
                </th>
                <th></th>
                <th>Data</th>
                <th>Máquina</th>
                <th>Operador</th>
                <th>Receita</th>
                <th>Quant</th>
                <th>Un</th>
                <th>Índice</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} style={{ textAlign: "center" }}>Carregando...</td></tr>
              ) : producoesPaginadas.length > 0 ? (
                producoesPaginadas.map((producao, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="checkbox"
                        checked={checkboxesSelecionados[index] || false}
                        onChange={(e) => {
                          const novoEstado = {
                            ...checkboxesSelecionados,
                            [index]: e.target.checked,
                          };

                          setCheckboxesSelecionados(novoEstado);
                          const todosSelecionados = producoesPaginadas.every((_, idx) => novoEstado[idx]);
                          setSelecionarTodos(todosSelecionados);
                        }}
                      /> {index + 1}
                    </td>
                    <td className="acoes" onClick={toggleModal}>
                      <img src="/3pontos.svg" alt="Opções" className="menu-acoes" />
                    </td>
                    <td>{producao.data?.split("T")[0]}</td>
                    <td>{producao.maquina}</td>
                    <td>{producao.operador}</td>
                    <td>{producao.receita}</td>
                    <td>{producao.quantidade}</td>
                    <td>{producao.unidade}</td>
                    <td>{producao.indice}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: "20px" }}>
                    Nenhum dado disponível
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="paginacao">
          <span className={paginaAtual === 1 ? "ativo" : ""} onClick={() => setPaginaAtual(1)}>01</span>
          <span className={paginaAtual === 2 ? "ativo" : ""} onClick={() => setPaginaAtual(2)}>02</span>
          <span className="seta">→</span>
        </div>
      </div>

      <ModalOptionsProducao isOpen={isModalOpen} toggleModal={toggleModal} />
    </div>
  );
}
