"use client";

import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import "../styles/rightSidebar.css";

export default function RightSidebar({ isOpen, toggle }) {
  const [quantidade, setQuantidade] = useState(""); // 🔥 Adicionando estado para Quantidade
  const [hora, setHora] = useState(""); // 🔥 Inicializa como string vazia

  const handleHoraChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não for número

    if (value.length > 4) {
      value = value.slice(0, 4); // Limita a 4 caracteres (HHMM)
    }

    // Adiciona ":" automaticamente após dois dígitos
    if (value.length > 2) {
      value = value.slice(0, 2) + ":" + value.slice(2);
    }

    // Garante que o valor máximo de horas seja 23 e minutos 59
    const [horas, minutos] = value.split(":");
    if (horas && parseInt(horas, 10) > 23) {
      value = "23" + (minutos ? ":" + minutos : "");
    }
    if (minutos && parseInt(minutos, 10) > 59) {
      value = horas + ":59";
    }

    setHora(value);
  };

  return (
    <div className={`right-sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-content">
        <div className="rightHeader">
          <h2>Lançamento de estoque</h2>
          {/* ✅ Botão de Fechar */}
          <button className="close-sidebar" onClick={toggle}>
            fechar <FaTimes />
          </button>

          {/* ✅ Título */}
        </div>
        {/* ✅ Formulário */}
        <form>
          <div className="form-row">
            <div className="form-group">
              <label>Tipo</label>
              <select className="input-tipo">
                <option>Entrada</option>
                <option>Saída</option>
              </select>
            </div>

            <div className="form-group">
              <label>Data</label>
              <input type="date" className="input-date" />
            </div>

            <div className="form-group">
              <label>Hora</label>
              <input
                type="text"
                placeholder="HH:MM"
                className="input-hora"
                value={hora}
                onChange={handleHoraChange}
                maxLength="5"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Quantidade</label>
              <input
                type="text"
                placeholder="Quantidade"
                className="input-quantidade"
                value={quantidade}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // Remove tudo que não for número
                  setQuantidade(value); // Atualiza o estado
                }}
              />
            </div>

            <div className="form-group">
              <label>Lote</label>
              <select className="input-lote">
                <option>Buscar Lote</option>
              </select>
            </div>

            <div className="form-group">
              <label>Linha</label>
              <select className="input-linha">
                <option>Primeira </option>
              </select>
            </div>

            <div className="form-group">
              <label>Depósito</label>
              <select className="input-deposito"></select>
            </div>
          </div>

          <div className="form-group">
            <label>Observações</label>
            <textarea placeholder="Digite suas observações..."></textarea>
          </div>

          {/* ✅ Botões de Ação */}
          <div className="form-buttons">
            <button type="submit" className="salvar">
              salvar
            </button>
            <button type="button" className="cancelar" onClick={toggle}>
              cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
