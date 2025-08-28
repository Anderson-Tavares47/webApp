import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

export default function SidebarEstoque({ isOpen, toggleSidebar }) {
  const [isClosing, setIsClosing] = useState(false);
  const [rows, setRows] = useState([
    {
      produto: "PISO INTERTRAVADO H8 - 10X20X8",
      lote: "",
      colaborador: "Primeira",
      quantidade: "",
      deposito: "",
    },
  ]);

  useEffect(() => {
    if (!isOpen) {
      setIsClosing(true);
      setTimeout(() => setIsClosing(false), 300);
    }
  }, [isOpen]);

  const atualizarLinha = (id, campo, valor) => {
    setRows(
      rows.map((row) => (row.id === id ? { ...row, [campo]: valor } : row))
    );
  };

  const handleSalvar = async () => {
    try {
      const response = await fetch("http://191.101.71.157:3334/api/v1/lancamentoPaletizacao/criar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rows),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Dados enviados com sucesso!");
        toggleSidebar();
      } else {
        alert("Erro ao enviar: " + (data?.message || "Erro desconhecido"));
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro de rede ao tentar salvar.");
    }
  };

  return (
    <div
      className={`sidebar-right ${isOpen ? "open" : ""} ${
        isClosing ? "closing" : ""
      }`}
    >
      <div className="sidebar-content">
        {/* Cabeçalho */}
        <div className="sidebar-header2">
          <div className="texto-sidebar">
            <h2 className="texto-estoque">Lançamento paletização</h2>
            <span className="subtexto">
              Informar as quantidades por colaborador
            </span>
          </div>
          <button className="close-sidebar" onClick={toggleSidebar}>
            fechar <FaTimes />
          </button>
        </div>

        {/* Tabela */}
        <div className="sidebar-table">
          <table>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Lote</th>
                <th>Colaborador</th>
                <th>Quantidade</th>
                <th>Depósito</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <input
                      type="text"
                      value={row.produto}
                      className="disabled-inputproduto"
                      onChange={(e) =>
                        atualizarLinha(row.id, "produto", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.lote}
                      className="input-lote"
                      onChange={(e) =>
                        atualizarLinha(row.id, "lote", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <select
                      value={row.colaborador}
                      className="select-linha"
                      onChange={(e) =>
                        atualizarLinha(row.id, "colaborador", e.target.value)
                      }
                    >
                      <option>Marcelo</option>
                      <option>Anderson</option>
                      <option>Erik</option>
                      <option>Primeira</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.quantidade}
                      className="input-quantidadesidebar"
                      onChange={(e) =>
                        atualizarLinha(
                          row.id,
                          "quantidade",
                          e.target.value.replace(/\D/g, "")
                        )
                      }
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                  </td>
                  <td>
                    <select
                      value={row.deposito}
                      className="select-depositosidebar"
                      onChange={(e) =>
                        atualizarLinha(row.id, "deposito", e.target.value)
                      }
                    >
                      <option value="">Selecione</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </select>
                  </td>
                  <td>
                    <img className="image" src="/3pontos.svg" alt="" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Rodapé */}
        <div className="sidebar-footer">
          <hr />
          <button className="save-btnSidebar" onClick={handleSalvar}>
            salvar
          </button>
        </div>
      </div>
    </div>
  );
}
