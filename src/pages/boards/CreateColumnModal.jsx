import { useState } from "react";
import styles from "./styles/createColumnModal.module.css";

const CreateColumnModal = ({ onClose, onCreate }) => {
  const [columnName, setColumnName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (columnName.trim()) {
      onCreate(columnName.trim());
      setColumnName("");
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3 className={styles.modalTitle}>Nova Coluna</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="columnName" className={styles.label}>
            Nome da Coluna
          </label>
          <input
            type="text"
            id="columnName"
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
            placeholder="Digite o nome da coluna"
          />
          <div className={styles.buttonGroup}>
            <button type="submit">Adicionar</button>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateColumnModal;
