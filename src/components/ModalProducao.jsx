import { FaEllipsisV, FaBox, FaTimes, FaClipboardList } from "react-icons/fa";
import { IoReloadOutline } from "react-icons/io5";

export default function ModalProducao({ isOpen, toggleModal }) {
  if (!isOpen) return null; // Se isOpen for false, não renderiza a modal

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={toggleModal}>
          <FaTimes />
        </button>
        <h2 className="motorista-titulo">
          {" "}
          <img src="/ponto-azul.svg" alt="" /> Produção
        </h2>
        <button className="modal-option">
          <FaBox /> Lançar estoque
        </button>
        <button className="modal-option">
          <FaClipboardList /> lançar dados paletização
        </button>
        <button className="modal-option">
          <IoReloadOutline /> estornar estoque
        </button>
        <button className="modal-option">
          <IoReloadOutline /> estornar dados paletização
        </button>
      </div>
    </div>
  );
}
