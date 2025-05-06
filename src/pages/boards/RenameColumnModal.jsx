import { useState, useEffect } from "react";
import styles from "./styles/renameBoardModal.module.css"; // Pode reutilizar

const RenameColumnModal = ({ currentName, onClose, onConfirm }) => {
  const [name, setName] = useState(currentName);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Enter") onConfirm(name.trim());
      else if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [name]);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Renomear Coluna</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Novo nome"
          autoFocus
        />
        <div className={styles.actions}>
          <button onClick={onClose} className={styles.cancelBtn}>Cancelar</button>
          <button onClick={() => onConfirm(name.trim())} className={styles.confirmBtn}>Salvar</button>
        </div>
      </div>
    </div>
  );
};

export default RenameColumnModal;
