"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../../components/Sidebar";
import { FaEllipsisV, FaSearch } from "react-icons/fa";
import ModalOptionsDeposito from "@/components/ModalOptionsDeposito";
import "../../../styles/deposito.css";

export default function DepositoPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("todos");
  const [checkboxesSelecionados, setCheckboxesSelecionados] = useState({});
  const [selecionarTodos, setSelecionarTodos] = useState(false);
  const [depositos, setDepositos] = useState([]);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const handleAddDeposito = () => {
    router.push("/suprimentos/deposito/incluirDeposito");
  };

  useEffect(() => {
    const fetchDepositos = async () => {
      try {
        const response = await fetch("http://191.101.71.157:3334/api/v1/deposito/listar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filtros: {
              id: 0,
              nome: "",
              unidade: "",
              linha: "",
              lote: "",
              observacao: "",
              dataFabricacao: new Date().toISOString(),
            },
            pagina: 0,
            porPagina: 0,
          }),
        });

        const data = await response.json();
        setDepositos(data?.dados || []);
      } catch (error) {
        console.error("Erro ao buscar depósitos:", error);
      }
    };

    fetchDepositos();
  }, []);

  const filteredDepositos = depositos.filter((dep) => {
    return (
      (statusFilter === "todos" || dep.status === statusFilter) &&
      dep.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className={`operadores-container ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="operadores-content">
        <div className="operadores-header">
          <h1 className="operadores-title">Depósitos</h1>
          <div className="operadores-form">
            <input
              type="text"
              placeholder="Pesquise por Nome"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>
          <button className="add-operator-btn" onClick={handleAddDeposito}>
            Incluir Depósito
          </button>
        </div>

        <div className="status-filters">
          {[
            { value: "todos", label: "todos" },
            { value: "ativo", label: "ativos", icon: "ativo.svg" },
            { value: "inativo", label: "inativos", icon: "inativo.svg" },
            { value: "excluido", label: "excluídos", icon: "excluido.svg" },
          ].map(({ value, label, icon }) => (
            <span
              key={value}
              className={statusFilter === value ? "active" : ""}
              onClick={() => setStatusFilter(value)}
            >
              {icon && <img src={`/icons/${icon}`} alt={label} className="status-icon" />} {label}
            </span>
          ))}
        </div>

        <hr className="status-divider" />

        <table className="operadores-table">
          <thead>
            <tr>
              <th className="col-checkbox">
                <input
                  type="checkbox"
                  checked={selecionarTodos}
                  onChange={(e) => {
                    const marcado = e.target.checked;
                    setSelecionarTodos(marcado);

                    const novoEstado = {};
                    filteredDepositos.forEach((dep) => {
                      novoEstado[dep.id] = marcado;
                    });

                    setCheckboxesSelecionados(novoEstado);
                  }}
                />
              </th>
              <th className="col-nome">Nome</th>
              <th className="col-status"></th>
            </tr>
          </thead>
          <tbody>
            {filteredDepositos.map((dep) => (
              <tr key={dep.id}>
                <td className="col-checkbox">
                  <input
                    type="checkbox"
                    checked={checkboxesSelecionados[dep.id] || false}
                    onChange={(e) => {
                      const novoEstado = {
                        ...checkboxesSelecionados,
                        [dep.id]: e.target.checked,
                      };

                      setCheckboxesSelecionados(novoEstado);

                      const todosMarcados = filteredDepositos.every(
                        (d) => novoEstado[d.id]
                      );
                      setSelecionarTodos(todosMarcados);
                    }}
                  />
                </td>
                <td className="col-nome">
                  <ModalOptionsDeposito className="action-icon" /> {dep.nome}
                </td>
                <td className="col-status">
                  <img
                    src={`/icons/${dep.status}.svg`}
                    alt={dep.status}
                    className="status-icon"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
