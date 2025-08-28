"use client";

import { useState } from "react";
import {
  FaArrowLeft,
  FaEllipsisH,
  FaPlus,
  FaTrash,
  FaEllipsisV,
} from "react-icons/fa";
import Sidebar from "@/components/Sidebar";
import "../../../../styles/novaEntrega.css";
import { useRouter } from "next/navigation"; // Importa o roteador do Next.js
import ModalOptionsNovaEntrega from "@/components/ModalNovaEntrega";

export default function NovaEntrega() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tabelas, setTabelas] = useState([1]); // Estado inicial com uma tabela
  const router = useRouter(); // Instancia o roteador
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    distancia: "",
    valorFrete: "", // Adicionando distância no estado
  });

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // ✅ Função para adicionar nova tabela
  const adicionarTabela = () => {
    setTabelas([...tabelas, tabelas.length + 1]);
  };

  // ✅ Função para excluir uma tabela específica
  const excluirTabela = (id) => {
    setTabelas(tabelas.filter((tabela) => tabela !== id));
  };

  const handleUfChange = (e) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z]/g, ""); // Permite apenas letras maiúsculas

    setFormData((prev) => ({ ...prev, uf: value }));
  };

  const handleDistanciaChange = (e) => {
    let value = e.target.value;

    // 🔹 Permite apenas números e vírgula
    value = value.replace(/[^0-9,]/g, "");

    // 🔹 Garante que tenha apenas uma vírgula
    const parts = value.split(",");
    if (parts.length > 2) {
      value = parts[0] + "," + parts.slice(1).join("");
    }

    // 🔹 Define no estado para atualizar o input
    setFormData((prev) => ({ ...prev, distancia: value }));
  };

  const handleValorFreteChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não for número

    if (!value) {
      setFormData((prev) => ({ ...prev, valorFrete: "" })); // Evita exibir "R$ " quando vazio
      return;
    }

    value = (parseFloat(value) / 100).toFixed(2).replace(".", ",");

    setFormData((prev) => ({ ...prev, valorFrete: value }));
  };

  const handleNumPedidoChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não for número

    setFormData((prev) => ({ ...prev, numPedido: value }));
  };

  const handleNfeChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não for número

    setFormData((prev) => ({ ...prev, nfe: value }));
  };

  const handleUnidadeChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não for número

    setFormData((prev) => ({ ...prev, unidade: value }));
  };

  const handleQuantidadeChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não for número

    setFormData((prev) => ({ ...prev, quantidade: value }));
  };

  return (
    <div
      className={`nova-entrega-container ${
        isSidebarOpen ? "sidebar-open" : ""
      }`}
    >
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="nova-entrega-content">
        {/* ✅ Cabeçalho */}
        <div className="novaEntrega-header">
          {/* Título */}
          <h1 className="novaEntrega-title">Nova Entrega</h1>

          {/* Botões de ação alinhados à direita */}
          <div className="acoes-container">
            <button
              className="add-novaEntrega-btn"
              onClick={() => router.push("/logistica/entregas")}
            >
              {" "}
              &larr; Voltar{" "}
            </button>

            <ModalOptionsNovaEntrega
              isOpen={isModalOpen}
              toggleModal={toggleModal}
            />
          </div>
        </div>
        <h2 className="dados-gerais-title">dados gerais</h2>

        <hr className="status-divider" />

        {/* ✅ Seção de Dados Gerais */}
        <div className="dados-gerais">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="placa">Placa</label>
              <select id="placa" className="input select">
                <option>Selecione</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="motorista">Motorista</label>
              <select id="motorista" className="input select">
                <option>Selecione</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="marca">Marca</label>
              <input id="marca" type="text" className="input-marca" disabled />
            </div>

            <div className="form-group">
              <label htmlFor="modelo">Modelo</label>
              <input
                id="modelo"
                type="text"
                className="input-modelo"
                disabled
              />
            </div>

            <div className="form-group">
              <label htmlFor="num-entrega">Número da Entrega</label>
              <input
                id="num-entrega"
                type="text"
                className="input-num-entrega"
                placeholder="03"
                disabled
              />
            </div>

            <div className="form-group">
              <label htmlFor="data-entrega">Data da Entrega</label>
              <input id="data-entrega" type="date" className="input-date" />
            </div>

            <div className="form-group">
              <label htmlFor="tipo-frete">Tipo de Frete</label>
              <select id="tipo-frete" className="input select">
                <option>Selecione</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="distancia">Distância (Km)</label>
              <input
                id="distancia"
                type="text"
                className="input-distancia"
                placeholder="Distância (Km)"
                value={formData.distancia || ""}
                onChange={handleDistanciaChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="tipo">Tipo</label>
              <input id="tipo" type="text" className="input-tipo" disabled />
            </div>

            <div className="form-group">
              <label htmlFor="valor-frete">Valor do Frete</label>
              <input
                id="valor-frete"
                type="text"
                className="input-frete"
                placeholder="1.500"
                value={formData.valorFrete ? `R$ ${formData.valorFrete}` : ""}
                onChange={handleValorFreteChange}
              />
            </div>
          </div>
        </div>

        <hr className="status-divider" />
        <h2 className="cliente-novaEntrega-title">Cliente | Produtos</h2>

        {/* ✅ Seção Cliente | Produtos */}
        <div className="cliente-novaEntrega">
          <div className="cliente-novaEntrega-grid">
            <div className="form-group nome">
              <label htmlFor="nome">Nome</label>
              <input
                id="nome"
                type="text"
                className="input-nome"
                placeholder="Nome"
              />
            </div>

            <div className="form-group cidade">
              <label htmlFor="cidade">Cidade</label>
              <input
                id="cidade"
                type="text"
                className="input-cidade"
                placeholder="Cidade"
              />
            </div>

            <div className="form-group uf">
              <label htmlFor="uf">UF</label>
              <input
                name="uf"
                type="text"
                className="input-uf"
                placeholder="UF"
                value={formData.uf || ""}
                onChange={handleUfChange}
                maxLength={2} // Limita a 2 caracteres
              />
            </div>

            <div className="form-group gps">
              <label htmlFor="gps">Localização GPS</label>
              <input
                id="gps"
                type="text"
                className="input-gps"
                placeholder="Localização GPS"
              />
            </div>

            <div className="form-group-container">
              {/* Num Pedido */}
              <div className="form-group">
                <label htmlFor="num-pedido">Num Pedido</label>
                <input
                  type="text"
                  id="num-pedido"
                  className="input-num-pedido"
                  placeholder="Num Pedido"
                  value={formData.numPedido || ""}
                  onChange={handleNumPedidoChange}
                />
              </div>

              {/* UF */}
              <div className="form-group uf">
                <label htmlFor="uf">Num NF-e</label>
                <input
                  id="nf-e"
                  type="text"
                  className="input-uf"
                  placeholder="NF-e"
                  value={formData.nfe || ""}
                  onChange={handleNfeChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Renderização dinâmica das tabelas */}
        {tabelas.map((id) => (
          <div key={id} className="tabela-novaEntrega-container">
            <table className="tabela-novaEntrega">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Unidade</th>
                  <th>Quantidade</th>
                  <th>Lote</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input type="text" className="input-produto" />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="input-unidade"
                      value={formData.unidade || ""}
                      onChange={handleUnidadeChange}
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      className="input-quantidade"
                      value={formData.quantidade || ""}
                      onChange={handleQuantidadeChange}
                    />
                  </td>

                  <td>
                    <div className="select-lote">
                      <select className="lote">
                        <option> Mostra Lote + Estoque</option>
                      </select>
                    </div>
                  </td>
                  <td className="acoes">
                    <div className="botoes-acoes">
                      <button className="save-btn">Salvar</button>
                      <button
                        className="delete-btn"
                        onClick={() => excluirTabela(id)}
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colSpan="1" className="totais-label">
                    Totais
                  </td>
                  <td>0</td>
                  <td>0,00</td>
                  <td></td>
                  <td>0,00</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}

        {/* ✅ Botão Adicionar Item */}
        <button className="adicionar-item" onClick={adicionarTabela}>
          <FaPlus /> adicionar item
        </button>
        <hr className="status-divider" />
        {/* ✅ Botões Salvar e Finalizar */}
        <div className="botoes-container">
          <button className="salvar-button">salvar</button>
          <button className="finalizar-button">finalizar</button>
        </div>
      </div>
    </div>
  );
}
