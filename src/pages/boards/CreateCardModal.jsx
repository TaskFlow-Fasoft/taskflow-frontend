import { useState, useEffect, useRef } from "react";
import styles from "./styles/createCardModal.module.css";
import { FaEdit, FaRegCalendarAlt } from "react-icons/fa";

const CreateCardModal = ({
    onClose,
    onCreate,
    onDelete,
    card = null,
    isEditing = false,
}) => {
    const [title, setTitle] = useState(card?.title || "");
    const [dueDate, setDueDate] = useState(card?.dueDate || "");
    const [description, setDescription] = useState(card?.description || "");
    const modalRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (event.target === modalRef.current) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        const cardData = {
            id: card?.id || undefined,
            title: title.trim(),
            dueDate,
            description: description.trim(),
        };

        onClose();
        onCreate(cardData);
    };

    const handleDelete = () => {
        if (onDelete && card) {
            onDelete(card);
        }
    };

    return (
        <div className={styles.modalOverlay} ref={modalRef}>
            <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>
                    {isEditing ? "Editar Cartão" : "Novo Cartão"} <FaEdit />
                </h2>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <label className={styles.label}>Title</label>
                    <input
                        type="text"
                        className={styles.input}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Card Name"
                    />

                    <label className={styles.label}>Due date</label>
                    <div style={{ position: "relative" }}>
                        <FaRegCalendarAlt
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "10px",
                                transform: "translateY(-50%)",
                                color: "#666",
                            }}
                        />
                        <input
                            type="date"
                            className={styles.input}
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            style={{ paddingLeft: "2.2rem" }}
                        />
                    </div>

                    <label className={styles.label}>Description</label>
                    <textarea
                        className={styles.textarea}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Write a description..."
                    />

                    <div className={styles.buttonGroup}>
                        <button
                            type="button"
                            className={styles.deleteBtn}
                            onClick={handleDelete}
                            disabled={!isEditing}
                        >
                            Delete
                        </button>
                        <button type="submit" className={styles.saveBtn}>
                            {isEditing ? "Salvar alterações" : "Salvar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCardModal;
