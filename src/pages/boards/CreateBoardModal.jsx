import { useState } from "react";
import styles from "./styles/createBoardModal.module.css";

const CreateBoardModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
  
    // Criar o novo quadro com colunas vazias
    onCreate({ 
      name: name.trim(),
      columns: [] // Adicionando uma lista de colunas vazias para o quadro
    });
    onClose(); // Fecha após criar
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Novo Quadro</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Nome do Quadro</label>
            <input
              type="text"
              placeholder="Nome do quadro"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.createButton}>
              Criar Quadro
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBoardModal;
