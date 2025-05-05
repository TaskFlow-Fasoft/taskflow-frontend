import { useEffect, useState } from "react";
import styles from "./styles/renameBoardModal.module.css";

const RenameBoardModal = ({ boardName, onClose, onConfirm }) => {
  const [name, setName] = useState(boardName || "");

  // 🔑 Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        onConfirm(name.trim());
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [name, onClose, onConfirm]);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Renomear Quadro</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Novo nome"
          autoFocus
        />
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancelar
          </button>
          <button className={styles.confirmBtn} onClick={() => onConfirm(name.trim())}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RenameBoardModal;
