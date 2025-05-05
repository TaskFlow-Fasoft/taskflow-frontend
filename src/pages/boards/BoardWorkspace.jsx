import { useState, useRef, useEffect } from "react";
import styles from "./styles/boardWorkspace.module.css";
import { useNavigate } from "react-router-dom";
import CreateBoardModal from "./CreateBoardModal";
import RenameBoardModal from "./RenameBoardModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { getBoards } from "../../services/boardService";
import MenuPortal from "./MenuPortal";
import {
  FaUserCircle,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaEllipsisH,
  FaTrashAlt,
  FaPen
} from "react-icons/fa";
import LogoIcon from "../../assets/Logo Icone.png";

const BoardWorkspace = () => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBoardIndex, setSelectedBoardIndex] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameIndex, setRenameIndex] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const userRef = useRef(null);
  const dropdownRef = useRef(null);

  const fakeUserName = "João da Silva";

  // Simula busca de boards (mock API)
  useEffect(() => {
    const fetchBoards = async () => {
      const data = await getBoards();
      console.log("Boards recebidos:", data); // Adicione isso
      setBoards(data);
      setLoading(false);
    };
    fetchBoards();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        userRef.current &&
        !userRef.current.contains(event.target)
      ) {
        setActiveMenuIndex(null);
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!sidebarOpen) {
      setActiveMenuIndex(null);
    }
  }, [sidebarOpen]);

  const handleCreateBoard = (newBoard) => {
    setBoards((prev) => [...prev, newBoard]);
  };

  const handleMenuToggle = (index, event) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuPosition({ top: rect.top, left: rect.right + 8 });
    setActiveMenuIndex((prev) => (prev === index ? null : index));
  };

  const handleDelete = (index) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
    setActiveMenuIndex(null);
  };

  const handleRename = (index) => {
    setRenameIndex(index);
    setShowRenameModal(true);
    setActiveMenuIndex(null);
  };

  const confirmDeleteBoard = () => {
    setBoards((prev) => prev.filter((_, i) => i !== deleteIndex));
    if (selectedBoardIndex === deleteIndex) {
      setSelectedBoardIndex(null);
    }
    setShowDeleteModal(false);
  };

  const handleConfirmRename = (newName) => {
    setBoards((prev) => {
      const updated = [...prev];
      updated[renameIndex].name = newName;
      return updated;
    });
    setRenameIndex(null);
    setShowRenameModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    setUserMenuOpen(false);
    navigate("/login");
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={`${styles.logo} ${!sidebarOpen ? styles.logoHidden : ''}`}>
            <img src={LogoIcon} alt="TaskFlow Logo" className={styles.logoImage} />
          </div>
          <h1 className={styles.appName}>TaskFlow</h1>
        </div>

        <div className={styles.headerCenter}>
          {selectedBoardIndex !== null ? boards[selectedBoardIndex]?.name : "Nenhum quadro selecionado"}
        </div>

        <div className={styles.headerRight}>
          <div ref={userRef} onClick={() => setUserMenuOpen(!userMenuOpen)} style={{ cursor: "pointer" }}>
            <FaUserCircle size={29} color="#3a86ff" />
          </div>

          {userMenuOpen && (
            <MenuPortal>
              <div className={styles.userMenu} ref={dropdownRef}>
                <div className={styles.userInfo}>
                  <span className={styles.userDisplayName}>{fakeUserName}</span>
                </div>
                <div className={styles.menuDivider}></div>
                <button className={styles.userMenuItem} onClick={handleLogout}>Fazer Logout</button>
              </div>
            </MenuPortal>
          )}
        </div>
      </header>

      <div className={styles.workspaceContainer}>
        <div className={`${styles.toggleContainer} ${sidebarOpen ? styles.open : styles.closed}`}>
          <button className={styles.toggleSidebarBtn} onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <FaChevronLeft size={16} /> : <FaChevronRight size={16} />}
          </button>
        </div>

        <aside className={`${styles.sidebar} ${!sidebarOpen ? styles.sidebarClosed : ''}`}>
          <h3 className={styles.sidebarTitle}>Task Workspace</h3>
          <div className={styles.sidebarSection}>
            <p className={styles.sectionLabel}>Meus Quadros</p>
            <ul className={styles.boardList}>
              {boards.map((board, index) => (
                <li key={index} className={`${styles.boardItem} ${selectedBoardIndex === index ? styles.activeBoard : ""}`}>
                  <div className={styles.boardContent} onClick={() => setSelectedBoardIndex(index)}>
                    <span className={styles.pinIcon}>📌</span>
                    {board.name}
                  </div>
                  <div className={styles.boardMenu}>
                    <FaEllipsisH onClick={(e) => handleMenuToggle(index, e)} />
                  </div>
                  {activeMenuIndex === index && (
                    <MenuPortal>
                      <div ref={dropdownRef} className={styles.dropdownMenu} style={{ top: menuPosition.top, left: menuPosition.left, position: "fixed", zIndex: 9999 }}>
                        <button onClick={() => handleRename(index)}><FaPen size={12} /> Renomear</button>
                        <button onClick={() => handleDelete(index)}><FaTrashAlt size={12} /> Excluir</button>
                      </div>
                    </MenuPortal>
                  )}
                </li>
              ))}
            </ul>
            <button className={styles.addBoardBtn} onClick={() => setShowModal(true)}>
              <FaPlus size={12} style={{ marginRight: "6px" }} />
              Novo Quadro
            </button>
          </div>
        </aside>

        <main className={styles.mainContent}>
  {loading ? (
    <p>Carregando quadros...</p>
  ) : selectedBoardIndex === null ? (
    <h2>Selecione ou crie um quadro</h2>
  ) : (
    <div className={styles.boardView}>
      <h2 className={styles.boardTitle}>
        {boards[selectedBoardIndex]?.name}
      </h2>

      <div className={styles.columnsArea}>
        {boards[selectedBoardIndex]?.columns?.length > 0 ? (
          boards[selectedBoardIndex].columns.map((column) => (
            <div key={column.id} className={styles.column}>
              <h3 className={styles.columnTitle}>{column.name}</h3>
              <div className={styles.columnContent}>
                {/* Aqui você poderá renderizar cards depois */}
                <span className={styles.placeholder}>Sem cartões</span>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyBoard}>
            Este quadro está vazio. Comece criando uma coluna.
          </div>
        )}
      </div>
    </div>
  )}
</main>
      </div>

      {showModal && (
        <CreateBoardModal onClose={() => setShowModal(false)} onCreate={handleCreateBoard} />
      )}

      {showRenameModal && renameIndex !== null && (
        <RenameBoardModal
          boardName={boards[renameIndex].name}
          onClose={() => {
            setRenameIndex(null);
            setShowRenameModal(false);
          }}
          onConfirm={handleConfirmRename}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          boardName={boards[deleteIndex]?.name}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={confirmDeleteBoard}
        />
      )}
    </div>
  );
};

export default BoardWorkspace;
