"use client";

import { useState, useEffect } from "react";
import ModalOptionsProduto from "@/components/ModalProduto";
import { HiChevronUpDown } from "react-icons/hi2";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";

import "../../../styles/produto.css";

export default function ProdutosPage() {
  const [pesquisa, setPesquisa] = useState("");
  const [ordemAsc, setOrdemAsc] = useState(true);
  const [exibirOpcoesOrdenacao, setExibirOpcoesOrdenacao] = useState(false);
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [exibirOpcoesSituacao, setExibirOpcoesSituacao] = useState(false);
  const [selecionarTodos, setSelecionarTodos] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  const [produtos, setProdutos] = useState([]);
  const [checkboxesSelecionados, setCheckboxesSelecionados] = useState({});
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const toggleOrdenacao = () => setExibirOpcoesOrdenacao(!exibirOpcoesOrdenacao);
  const toggleSituacao = () => setExibirOpcoesSituacao(!exibirOpcoesSituacao);

  const handleIncluirProduto = () => {
    router.push("produto/novoProduto");
  };

  const fetchProdutos = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        pagina: paginaAtual.toString(),
        porPagina: itensPorPagina.toString(),
        nome: pesquisa,
      });

      if (tipoFiltro !== "todos") queryParams.append("tipo", tipoFiltro);

      const response = await fetch(
        `http://191.101.71.157:3334/api/v1/produto/listar?${queryParams}`
      );
      const data = await response.json();

      if (response.ok && data.dados) {
        setProdutos(data.dados);
        setTotalPaginas(Math.ceil(data.total / itensPorPagina));
      } else {
        setProdutos([]);
        setTotalPaginas(1);
      }
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      setProdutos([]);
      setTotalPaginas(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, [paginaAtual, pesquisa, tipoFiltro]);

  return (
    <div className={"produtos-container"}>

      <div className="produtos-content">
        <div className="produtos-header">
          <h1 className="produtos-title">Produtos</h1>

          <div className="acoes-container">
            <button className="add-produto-btn" onClick={handleIncluirProduto}>
              incluir produto
            </button>
          </div>
        </div>

        {/* 🔎 Campo de busca padronizado */}
        <div className="pesquisa-e-filtros">
          <div className="relative h-[46px] w-full max-w-[500px] rounded bg-[#D9D9D9]/70 px-3">
            <input
              type="text"
              placeholder="Pesquise por descrição ou código"
              value={pesquisa}
              onChange={(e) => {
                setPesquisa(e.target.value);
                setPaginaAtual(1);
              }}
              className="h-full w-full bg-transparent pr-9 text-[16px] text-gray-800 placeholder:text-[#555] font-semibold outline-none"
            />
            <FaSearch className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[16px] text-gray-500" />
          </div>

          <div className="filtros">
            <button
              className="filtro-btn text-gray-800"
              onClick={toggleOrdenacao}
            >
              <HiChevronUpDown /> nome
            </button>
            <button
              className="filtro-btn text-gray-800"
              onClick={toggleSituacao}
            >
              por situação
            </button>
          </div>
        </div>

        {exibirOpcoesOrdenacao && (
          <div className="ordenacao-opcoes text-gray-800 font-semibold">
            <label className="mr-2">Ordenar por:</label>
            <button className="ordenacao-btn">Nome</button>
            <button className="ordenacao-btn">Código</button>
          </div>
        )}

        {exibirOpcoesSituacao && (
          <div className="situacao-opcoes text-gray-800 font-semibold">
            <label className="mr-2">Situação:</label>
            <button className="situacao-btn">Sem Filtro</button>
            <button className="situacao-btn">Ativos</button>
            <button className="situacao-btn">Inativos</button>
            <button className="situacao-btn">Excluídos</button>
          </div>
        )}

        {/* Filtros de status */}
        <div className="status-filters">
          {["todos", "fabricado", "matéria-prima"].map((filtro) => (
            <span
              key={filtro}
              className={`cursor-pointer font-bold ${
                tipoFiltro === filtro
                  ? "text-[#3B447B]"
                  : "text-[#676363] hover:text-[#3B447B]"
              }`}
              onClick={() => setTipoFiltro(filtro)}
            >
              {filtro}
            </span>
          ))}
        </div>

        <hr className="status-divider" />

        {/* Tabela */}
        <div className="produtos-table-container">
          <table className="produtos-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    className="custom-checkbox"
                    checked={selecionarTodos}
                    onChange={(e) => {
                      const marcado = e.target.checked;
                      const novoEstado = {};
                      produtos.forEach((p) => (novoEstado[p.id] = marcado));
                      setCheckboxesSelecionados(novoEstado);
                      setSelecionarTodos(marcado);
                    }}
                  />
                </th>
                <th>Descrição</th>
                <th></th>
                <th>Código</th>
                <th>Unidade</th>
                <th>Custo</th>
                <th>Estoque</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center text-gray-500 py-4">
                    Carregando produtos...
                  </td>
                </tr>
              ) : produtos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-gray-500 py-4">
                    Nenhum produto encontrado.
                  </td>
                </tr>
              ) : (
                produtos.map((produto) => (
                  <tr key={produto.id}>
                    <td>
                      <input
                        type="checkbox"
                        className="custom-checkbox"
                        checked={checkboxesSelecionados[produto.id] || false}
                        onChange={(e) => {
                          const novoEstado = {
                            ...checkboxesSelecionados,
                            [produto.id]: e.target.checked,
                          };
                          setCheckboxesSelecionados(novoEstado);
                          setSelecionarTodos(
                            produtos.every((p) => novoEstado[p.id])
                          );
                        }}
                      />
                    </td>
                    <td className="nome-produto">
                      <ModalOptionsProduto className="action-icon" produto={produto} />{" "}
                      {produto.nome}
                    </td>
                    <td>{produto.descricao}</td>
                    <td>{produto.codigo}</td>
                    <td>{produto.unidade}</td>
                    <td>{produto.custo}</td>
                    <td>{produto.estoque}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <hr className="pagination-divider" />

        <div className="pagination">
          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
            <span
              key={pagina}
              onClick={() => setPaginaAtual(pagina)}
              className={`cursor-pointer ${
                paginaAtual === pagina ? "text-[#3B447B] font-bold" : "text-gray-600"
              }`}
            >
              {String(pagina).padStart(2, "0")}
            </span>
          ))}
          {paginaAtual < totalPaginas && (
            <span
              onClick={() => setPaginaAtual(paginaAtual + 1)}
              className="cursor-pointer text-gray-800"
            >
              →
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
