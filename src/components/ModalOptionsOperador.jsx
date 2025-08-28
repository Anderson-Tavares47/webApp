import { useState } from "react";
import { FaEllipsisV, FaTrash, FaEdit, FaTimes } from "react-icons/fa";

export default function MotoristaModal({ motorista }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Ícone que abre a modal */}
      <FaEllipsisV className="action-icon" onClick={toggleModal} />

      {/* Modal - só exibe se isOpen for true */}
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={toggleModal}>
              <FaTimes />
            </button>
            <h3 className="motorista-titulo">
              {" "}
              <img src="/ponto-azul.svg" alt="" /> Operador
            </h3>
            <button className="modal-option">
              <FaTrash /> Excluir operador
            </button>
            <button className="modal-option">
              <FaEdit /> Alterar cadastro
            </button>
          </div>
        </div>
      )}
    </>
  );
}
