"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaEllipsisV, FaPlus, FaTrash } from "react-icons/fa";
import Sidebar from "@/components/Sidebar"; // ✅ Importando Sidebar
import "../../../../styles/novaManutencao.css";
import ModalOptionsManutencao from "@/components/ModalNovaManutencao";

export default function NovaManutencao() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tabelas, setTabelas] = useState([{ id: Date.now() }]); // ✅ Estado inicial com uma tabela
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    valorManutencao: "",
    kmHodometro: "", // 🔥 Garante que sempre inicia como string vazia
  });

  const handleValorManutencaoChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não for número

    if (!value) {
      setFormData((prev) => ({ ...prev, valorManutencao: "" })); // Evita exibir "R$ " quando vazio
      return;
    }

    value = (parseFloat(value) / 100).toFixed(2).replace(".", ",");

    setFormData((prev) => ({ ...prev, valorManutencao: value }));
  };

  const handleKmHodometroChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não for número

    if (!value) {
      setFormData((prev) => ({ ...prev, kmHodometro: "" })); // Evita exibir "Km" quando vazio
      return;
    }

    value = parseInt(value, 10).toLocaleString("pt-BR"); // Formata com separação de milhares

    setFormData((prev) => ({ ...prev, kmHodometro: value }));
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    const storedTables = JSON.parse(localStorage.getItem("tabelas")) || [
      {
        id: Date.now(),
        produto: "",
        aplicacao: "",
        unidade: "",
        quantidade: "",
        valor: "",
        total: 0,
      },
    ];
    setTabelas(storedTables);
  }, []);

  useEffect(() => {
    localStorage.setItem("tabelas", JSON.stringify(tabelas));
  }, [tabelas]);

  const handleVoltar = () => {
    router.back();
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const adicionarTabela = () => {
    setTabelas([
      ...tabelas,
      {
        id: Date.now(),
        produto: "",
        aplicacao: "",
        unidade: "",
        quantidade: "",
        valor: "",
        total: 0,
      },
    ]);
  };

  const excluirTabela = (id) => {
    const novasTabelas = tabelas.filter((tabela) => tabela.id !== id);
    setTabelas(novasTabelas);
  };

  const atualizarTabela = (id, campo, valor) => {
    if (campo === "valor") {
      valor = valor.replace(/\D/g, ""); // 🔥 Remove tudo que não for número

      if (valor) {
        valor = (parseFloat(valor) / 100).toFixed(2).replace(".", ","); // Formata como moeda (ex: 1.500,00)
      }
    }

    const novasTabelas = tabelas.map((tabela) =>
      tabela.id === id
        ? {
            ...tabela,
            [campo]: valor,
            total:
              campo === "quantidade" || campo === "valor"
                ? calcularTotal(tabela, campo, valor)
                : tabela.total,
          }
        : tabela
    );
    setTabelas(novasTabelas);
  };

  const calcularTotal = (tabela, campo, valor) => {
    const quantidade =
      campo === "quantidade"
        ? parseFloat(valor) || 0
        : parseFloat(tabela.quantidade) || 0;
    const valorUnitario =
      campo === "valor"
        ? parseFloat(valor) || 0
        : parseFloat(tabela.valor) || 0;
    return (quantidade * valorUnitario).toFixed(2);
  };
  return (
    <div
      className={`nova-entrega-container ${
        isSidebarOpen ? "sidebar-open" : ""
      }`}
    >
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 p-6">
        {/* ✅ Cabeçalho */}
        <div className="nova-manutencao">
          <div className="nova-manutencao-header">
            <h1 className="nova-manutencao-title">Nova manutenção</h1>
            <div className="botoes-container">
              <button className="voltar-button" onClick={handleVoltar}>
                <FaArrowLeft /> voltar
              </button>
              <button className="acoes-button" onClick={toggleModal}></button>

              <ModalOptionsManutencao
                isOpen={isModalOpen}
                toggleModal={toggleModal}
              />
            </div>
          </div>
        </div>

        <h2 className="dados-gerais-title">dados gerais</h2>
        <hr className="status-divider" />

        {/* ✅ Dados gerais */}
        <div className="dados-gerais">
          <div className="grid-container">
            <div className="form-group">
              <label>Placa</label>
              <select className="input-placa"></select>
            </div>
            <div className="form-group">
              <label>Motorista</label>
              <select className="input-motorista"></select>
            </div>
            <div className="form-group">
              <label>Marca</label>
              <input type="text" className="input-marca" disabled />
            </div>
            <div className="form-group">
              <label>Modelo</label>
              <input type="text" className="input-modelo" disabled />
            </div>
            <div className="form-group">
              <label>Número da Manutenção</label>
              <input
                type="text"
                className="input-num-manu"
                value="03"
                disabled
              />
            </div>
            <div className="form-group">
              <label>Data Inicial</label>
              <input type="date" className="input-data-inicial" />
            </div>
            <div className="form-group">
              <label>Data Final</label>
              <input type="date" className="input-data-final" />
            </div>
            <div className="form-group">
              <label>Km hodômetro</label>
              <input
                type="text"
                className="input-km-hodometro"
                placeholder="1.500"
                value={formData.kmHodometro}
                onChange={handleKmHodometroChange}
              />
            </div>
            <div className="form-group">
              <label>Tipo</label>
              <input type="text" className="input-tipo" disabled />
            </div>
            <div className="form-group">
              <label htmlFor="valor-manutencao">Valor Manutenção</label>
              <input
                id="valor-manutencao"
                type="text"
                className="input-valor-manu"
                placeholder="1.500"
                value={
                  formData.valorManutencao
                    ? `R$ ${formData.valorManutencao}`
                    : ""
                }
                onChange={handleValorManutencaoChange}
              />
            </div>

            <div className="form-group">
              <label>Componente</label>
              <input type="text" className="input-componente" />
            </div>
            <div className="form-group">
              <label>Tipo da Manutenção</label>
              <select className="input-tipo-manu">
                <option>Ajuste</option>
                <option>Corretiva</option>
              </select>
            </div>
          </div>
        </div>

        <hr className="status-divider" />
        <h2 className="cliente-title">Peças e Mão de Obra</h2>

        {/* ✅ Renderização dinâmica das tabelas */}
        <div className="cliente-produtos">
          {tabelas.map(
            ({ id, produto, aplicacao, unidade, quantidade, valor, total }) => (
              <div key={id} className="tabela-produtos-container">
                <table className="tabela-produtos">
                  <thead>
                    <tr>
                      <th>Descrição</th>
                      <th>Aplicação</th>
                      <th>Unidade</th>
                      <th>Quantidade</th>
                      <th>Valor</th>
                      <th>Total</th>
                      <th
                        style={{
                          textAlign: "center",
                        }}
                      >
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <input
                          type="text"
                          className="input-descricao"
                          value={produto}
                          onChange={(e) =>
                            atualizarTabela(id, "produto", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input-aplicacao"
                          value={aplicacao}
                          onChange={(e) =>
                            atualizarTabela(id, "aplicacao", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input-unidade"
                          value={unidade}
                          onChange={(e) =>
                            atualizarTabela(id, "unidade", e.target.value)
                          }
                        />
                      </td>

                      <td>
                        <input
                          type="text" // 🔥 Mantendo como "text"
                          className="input-quantidade"
                          value={quantidade}
                          onChange={(e) =>
                            atualizarTabela(id, "quantidade", e.target.value)
                          }
                        />
                      </td>

                      <td>
                        <input
                          type="text"
                          className="input-valor"
                          value={
                            valor !== undefined && valor !== null
                              ? `R$ ${valor}`
                              : ""
                          }
                          onChange={(e) =>
                            atualizarTabela(id, "valor", e.target.value)
                          }
                        />
                      </td>

                      <td>{total}</td>
                      <td className="botoes-acoes">
                        <div className="button-container">
                          <button className="save-btn">salvar</button>
                          <button
                            className="delete-btn"
                            onClick={() => excluirTabela(id)}
                          >
                            <FaTrash /> Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )
          )}

          {/* ✅ Botão para adicionar nova tabela */}
          <button className="adicionar-item" onClick={adicionarTabela}>
            <FaPlus /> adicionar item
          </button>
        </div>

        {/* ✅ Observações */}
        <div className="cliente-produtos">
          <h2 className="cliente-produtos-title">Observações:</h2>
          <textarea
            className="w-[1077px] h-[50px] border border-gray-400 p-3 rounded-md text-center"
            style={{
              borderImage:
                "linear-gradient(to bottom, #999999, #CCCCCC, #999999) 1",
            }}
            rows="3"
          />
        </div>

        <hr className="status-divider" />
        {/* ✅ Botões de Ação */}
        <div className="botoes-container">
          <button className="salvar-button">salvar</button>
          <button className="finalizar-button">finalizar</button>
        </div>
      </div>
    </div>
  );
}
