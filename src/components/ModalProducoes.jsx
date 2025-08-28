import { useState, useEffect } from "react";
import {
  FaEllipsisV,
  FaBox,
  FaEdit,
  FaTimes,
  FaClipboardList,
} from "react-icons/fa";
import { IoReloadOutline } from "react-icons/io5";
import SidebarEstoque from "@/components/SidebarEstoque";
import SidebarPaletizacao from "@/components/SidebarPaletizacao";

export default function ProducaoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldReopenModal, setShouldReopenModal] = useState(false);
  const [isEstoqueOpen, setIsEstoqueOpen] = useState(false);
  const [isPaletizacaoOpen, setIsPaletizacaoOpen] = useState(false);

  const openSidebarEstoque = () => {
    setShouldReopenModal(isOpen); // Guarda o estado da modal antes de abrir o sidebar
    setIsOpen(false); // Fecha a modal ao abrir o sidebar
    setIsEstoqueOpen(true);
    setIsPaletizacaoOpen(false); // Garante que só um sidebar esteja aberto
  };

  const openSidebarPaletizacao = () => {
    setShouldReopenModal(isOpen);
    setIsOpen(false);
    setIsPaletizacaoOpen(true);
    setIsEstoqueOpen(false);
  };

  const closeSidebars = () => {
    setIsEstoqueOpen(false);
    setIsPaletizacaoOpen(false);
  };

  // Quando os sidebars forem fechados, reabre a modal apenas se ela estava aberta antes
  useEffect(() => {
    if (!isEstoqueOpen && !isPaletizacaoOpen && shouldReopenModal) {
      setIsOpen(true);
    }
  }, [isEstoqueOpen, isPaletizacaoOpen, shouldReopenModal]);

  const toggleModal = () => {
    setIsOpen(!isOpen);
    setShouldReopenModal(false); // Resetar controle de reabertura
  };

  return (
    <div className="acoes-dropdown">
      {/* ✅ Botão que abre a modal */}
      <button className="acoes-btn" onClick={toggleModal}>
        Ações <img src="/ponto-azul.svg" alt="" />
      </button>

      {/* ✅ Modal - Só aparece quando isOpen for true */}
      {isOpen && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={toggleModal}>
              <FaTimes />
            </button>
            <h2 className="motorista-titulo">
              <img src="/ponto-azul.svg" alt="" /> Mais ações
            </h2>
            <button className="modal-option" onClick={openSidebarEstoque}>
              <FaBox /> Lançar estoque
            </button>
            <button className="modal-option" onClick={openSidebarPaletizacao}>
              <FaClipboardList /> Lançar dados paletização
            </button>
            <button className="modal-option">
              <IoReloadOutline /> Estornar estoque
            </button>
            <button className="modal-option">
              <IoReloadOutline /> Estornar dados paletização
            </button>
          </div>
        </div>
      )}

      {/* ✅ Sidebars separados */}
      <SidebarEstoque isOpen={isEstoqueOpen} toggleSidebar={closeSidebars} />
      <SidebarPaletizacao
        isOpen={isPaletizacaoOpen}
        toggleSidebar={closeSidebars}
      />
    </div>
  );
}
