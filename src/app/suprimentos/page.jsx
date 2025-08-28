"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { FaPrint } from "react-icons/fa";
import "../../styles/suprimentos.css";
import { useRouter } from "next/navigation";

export default function ControleDeEstoques() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const [exibirOpcoesOrdenacao, setExibirOpcoesOrdenacao] = useState(false);
  const [exibirOpcoesSituacao, setExibirOpcoesSituacao] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [selecionarTodos, setSelecionarTodos] = useState(false);
  const [checkboxesSelecionados, setCheckboxesSelecionados] = useState({});
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");

  const toggleOrdenacao = () => setExibirOpcoesOrdenacao(!exibirOpcoesOrdenacao);
  const toggleSituacao = () => setExibirOpcoesSituacao(!exibirOpcoesSituacao);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://191.101.71.157:3334/api/v1/lancamentoPaletizacao/listar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filtros: { id: 0, data: new Date().toISOString() },
            pagina: 0,
            porPagina: 0,
          }),
        });

        const json = await response.json();
        setProdutos(json.dados || []);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  const produtosFiltrados = produtos.filter((produto) =>
    produto.descricao?.toLowerCase().includes(busca.toLowerCase()) ||
    String(produto.codigo).includes(busca)
  );

  const itensPorPagina = 10;
  const totalPaginas = Math.ceil(produtosFiltrados.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const produtosPaginados = produtosFiltrados.slice(inicio, fim);

  const handleClick = (codigo) => {
    router.push(`/suprimentos/detalhes?codigo=${codigo}`);
  };

  return (
    <div className={`lista-producao-container ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="lista-producao-content">
        <div className="lista-producao-header">
          <h1 className="lista-producao-title">Controle de Estoques</h1>
          <button className="print-button" onClick={() => window.print()}>
            <FaPrint /> imprimir
          </button>
        </div>

        <div className="filtros">
          <input
            type="text"
            placeholder="Pesquise por descrição ou código"
            className="procurar"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />

          <button className="filtro-botao" onClick={toggleOrdenacao}>
            <span>⇅</span> nome
          </button>

          <button className="filtro-botao ativo" onClick={toggleSituacao}>
            por situação
          </button>
        </div>

        {exibirOpcoesOrdenacao && (
          <div className="ordenacao-opcoes">
            <label>Ordenar por:</label>
            <button className="ordenacao-btn">Ordenar por Nome</button>
            <button className="ordenacao-btn">Ordenar por Código</button>
          </div>
        )}

        {exibirOpcoesSituacao && (
          <div className="situacao-opcoes">
            <label>Situação: </label>
            <button className="situacao-btn">Sem Filtro</button>
            <button className="situacao-btn">Ativos</button>
            <button className="situacao-btn">Inativos</button>
            <button className="situacao-btn">Excluídos</button>
          </div>
        )}

        <div className="status-filtros">
          <span className="status-todos ativo">todos</span>
          <span className="status-andamento">fabricado</span>
          <span className="status-aberto">matéria-prima</span>
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
                      produtosPaginados.forEach((p) => {
                        novoEstado[p.codigo] = marcado;
                      });
                      setCheckboxesSelecionados(novoEstado);
                    }}
                  />
                </th>
                <th>Descrição</th>
                <th>Código</th>
                <th>Custo Médio</th>
                <th>Unidade</th>
                <th>Primeira Linha</th>
                <th>Segunda Linha</th>
                <th>Estoque Total</th>
              </tr>
            </thead>
            <tbody>
              {produtosPaginados.length > 0 ? (
                produtosPaginados.map((produto, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="checkbox"
                        checked={checkboxesSelecionados[produto.codigo] || false}
                        onChange={(e) => {
                          const novoEstado = {
                            ...checkboxesSelecionados,
                            [produto.codigo]: e.target.checked,
                          };
                          setCheckboxesSelecionados(novoEstado);
                          const todosSelecionados = produtosPaginados.every(
                            (p) => novoEstado[p.codigo]
                          );
                          setSelecionarTodos(todosSelecionados);
                        }}
                      />
                    </td>
                    <td className="acoes">
                      <img
                        src="/3pontos.svg"
                        alt="Opções"
                        className="menu-acoes"
                        onClick={() => handleClick(produto.codigo)}
                      />
                      {produto.descricao}
                    </td>
                    <td>{produto.codigo}</td>
                    <td>{produto.custo}</td>
                    <td>{produto.unidade}</td>
                    <td>{produto.primeira}</td>
                    <td>{produto.segunda}</td>
                    <td>{produto.total}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                    Nenhum produto disponível.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="paginacao">
          {[...Array(totalPaginas)].map((_, i) => (
            <span
              key={i}
              className={paginaAtual === i + 1 ? "ativo" : ""}
              onClick={() => setPaginaAtual(i + 1)}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
          ))}
          <span className="seta">→</span>
        </div>
      </div>
    </div>
  );
}
