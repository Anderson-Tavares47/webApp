"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { FaArrowLeft } from "react-icons/fa";
import "../../../../styles/incluirDeposito.css";

export default function IncluirDeposito() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [codigo, setCodigo] = useState("");
  const [situacao, setSituacao] = useState("Ativo");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSalvar = async () => {
    try {
      const response = await fetch("http://191.101.71.157:3334/api/v1/deposito/criar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          codigo,
          situacao,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Depósito criado com sucesso!");
        router.back(); // volta para a listagem
      } else {
        alert(`Erro ao criar depósito: ${data.message || "Erro desconhecido"}`);
      }
    } catch (error) {
      alert("Erro na requisição: " + error.message);
    }
  };

  return (
    <div
      className={`incluir-deposito-container ${
        isSidebarOpen ? "sidebar-open" : ""
      }`}
    >
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="incluir-deposito-content">
        <div className="incluir-deposito-header">
          <h1 className="incluir-deposito-title">Depósito</h1>
          <button className="voltar-button" onClick={() => router.back()}>
            <FaArrowLeft /> voltar
          </button>
        </div>

        <hr className="status-divider" />

        <form className="incluir-deposito-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="nome">Nome</label>
            <input
              type="text"
              name="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder=""
            />
          </div>

          <div className="form-group">
            <label htmlFor="codigo">Código</label>
            <input
              type="text"
              name="codigo"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Opcional"
              className="codigo-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="situacao">Situação</label>
            <select
              name="situacao"
              value={situacao}
              onChange={(e) => setSituacao(e.target.value)}
            >
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>
        </form>

        <div className="botoes-container">
          <hr className="status-divider" />
          <div className="botoesOrganizar">
            <button className="salvar-button" onClick={handleSalvar}>
              salvar
            </button>
            <button className="cancelar-button" onClick={() => router.back()}>
              cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
