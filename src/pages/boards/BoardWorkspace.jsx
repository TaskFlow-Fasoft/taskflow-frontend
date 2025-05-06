import { useState, useRef, useEffect } from "react";
import styles from "./styles/boardWorkspace.module.css";
import { useNavigate } from "react-router-dom";
import CreateBoardModal from "./CreateBoardModal";
import CreateColumnModal from "./CreateColumnModal";
import RenameBoardModal from "./RenameBoardModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import RenameColumnModal from "./RenameColumnModal";
import DeleteColumnConfirmModal from "./DeleteColumnConfirmModal";
import { getBoards } from "../../services/boardService";
import MenuPortal from "./MenuPortal";
import {
  FaUserCircle,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaEllipsisH,
  FaTrashAlt,
  FaPen,
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
  const [showCreateColumnModal, setShowCreateColumnModal] = useState(false);
  const [showRenameColumnModal, setShowRenameColumnModal] = useState(false);
  const [columnToRename, setColumnToRename] = useState(null); // index ou id
  const [columnMenu, setColumnMenu] = useState(null); // { columnId, index, top, left }
  const [showDeleteColumnModal, setShowDeleteColumnModal] = useState(false);
  const [columnToDeleteIndex, setColumnToDeleteIndex] = useState(null);  


  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const userRef = useRef(null);
  const userDropdownRef = useRef(null);
  const columnDropdownRef = useRef(null);


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
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target) &&
        userRef.current &&
        !userRef.current.contains(event.target)
      ) {
        setActiveMenuIndex(null);
        setUserMenuOpen(false);
      }
  
      if (
        columnDropdownRef.current &&
        !columnDropdownRef.current.contains(event.target)
      ) {
        setColumnMenu(null);
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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (columnDropdownRef.current && !columnDropdownRef.current.contains(e.target)) {
        setColumnMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const confirmDeleteColumn = (colIndex) => {
    setColumnToDeleteIndex(colIndex);
    setShowDeleteColumnModal(true);
  };

  const handleConfirmDeleteColumn = () => {
    setBoards((prevBoards) => {
      const updatedBoards = structuredClone(prevBoards);
      updatedBoards[selectedBoardIndex].columns = updatedBoards[selectedBoardIndex].columns.filter(
        (_, index) => index !== columnToDeleteIndex
      );
      return updatedBoards;
    });
  
    setShowDeleteColumnModal(false);
    setColumnMenu(null);
  };
  

  const openRenameColumnModal = (colIndex) => {
    setColumnToRename(colIndex);
    setShowRenameColumnModal(true);
  };
  
  const handleConfirmRenameColumn = (newName) => {
    setBoards((prev) => {
      const updated = [...prev];
      updated[selectedBoardIndex].columns[columnToRename].name = newName;
      return updated;
    });
    setShowRenameColumnModal(false);
  };
  
  const handleCreateBoard = (newBoard) => {
    const newBoardWithColumns = {
      ...newBoard,
      columns: [], // Inicializa com colunas vazias
      id: Date.now() // Garantir que o quadro tenha um ID único
    };
    setBoards((prev) => [...prev, newBoardWithColumns]);
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

  const handleCreateColumn = (columnName) => {
    if (selectedBoardIndex !== null) {
      const newColumn = {
        id: Date.now(), // Gerar um ID único
        name: columnName,
        cards: [], // Inicializa com cartões vazios
      };
  
      // Atualiza o quadro selecionado com a nova coluna
      setBoards((prevBoards) => {
        const updatedBoards = [...prevBoards];
        updatedBoards[selectedBoardIndex].columns.push(newColumn);
        return updatedBoards;
      });
    }
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div
            className={`${styles.logo} ${
              !sidebarOpen ? styles.logoHidden : ""
            }`}
          >
            <img
              src={LogoIcon}
              alt="TaskFlow Logo"
              className={styles.logoImage}
            />
          </div>
          <h1 className={styles.appName}>TaskFlow</h1>
        </div>

        <div className={styles.headerCenter}>
          {selectedBoardIndex !== null
            ? boards[selectedBoardIndex]?.name
            : "Nenhum quadro selecionado"}
        </div>

        <div className={styles.headerRight}>
          <div
            ref={userRef}
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            style={{ cursor: "pointer" }}
          >
            <FaUserCircle size={29} color="#3a86ff" />
          </div>

          {userMenuOpen && (
            <MenuPortal>
              <div className={styles.userMenu} ref={userDropdownRef}>
                <div className={styles.userInfo}>
                  <span className={styles.userDisplayName}>{fakeUserName}</span>
                </div>
                <div className={styles.menuDivider}></div>
                <button className={styles.userMenuItem} onClick={handleLogout}>
                  Fazer Logout
                </button>
              </div>
            </MenuPortal>
          )}
        </div>
      </header>

      <div className={styles.workspaceContainer}>
        <div
          className={`${styles.toggleContainer} ${
            sidebarOpen ? styles.open : styles.closed
          }`}
        >
          <button
            className={styles.toggleSidebarBtn}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <FaChevronLeft size={16} />
            ) : (
              <FaChevronRight size={16} />
            )}
          </button>
        </div>

        <aside
          className={`${styles.sidebar} ${
            !sidebarOpen ? styles.sidebarClosed : ""
          }`}
        >
          <h3 className={styles.sidebarTitle}>Task Workspace</h3>
          <div className={styles.sidebarSection}>
            <p className={styles.sectionLabel}>Meus Quadros</p>
            <ul className={styles.boardList}>
              {boards.map((board, index) => (
                <li
                  key={index}
                  className={`${styles.boardItem} ${
                    selectedBoardIndex === index ? styles.activeBoard : ""
                  }`}
                >
                  <div
                    className={styles.boardContent}
                    onClick={() => setSelectedBoardIndex(index)}
                  >
                    <span className={styles.pinIcon}>📌</span>
                    {board.name}
                  </div>
                  <div className={styles.boardMenu}>
                    <FaEllipsisH onClick={(e) => handleMenuToggle(index, e)} />
                  </div>
                  {activeMenuIndex === index && (
                    <MenuPortal>
                      <div
                        ref={columnDropdownRef}
                        className={styles.dropdownMenu}
                        style={{
                          top: menuPosition.top,
                          left: menuPosition.left,
                          position: "fixed",
                          zIndex: 9999,
                        }}
                      >
                        <button onClick={() => handleRename(index)}>
                          <FaPen size={12} /> Renomear
                        </button>
                        <button onClick={() => handleDelete(index)}>
                          <FaTrashAlt size={12} /> Excluir
                        </button>
                      </div>
                    </MenuPortal>
                  )}
                </li>
              ))}
            </ul>
            <button
              className={styles.addBoardBtn}
              onClick={() => setShowModal(true)}
            >
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
                  <>
{boards[selectedBoardIndex].columns.map((column, colIndex) => (
  <div key={column.id} className={styles.column}>
    <div className={styles.columnHeader}>
      <h3 className={styles.columnTitle}>{column.name}</h3>
      <FaEllipsisH
        onClick={(e) => {
          e.stopPropagation();
          const rect = e.currentTarget.getBoundingClientRect();
          setColumnMenu({
            columnId: column.id,
            index: colIndex,
            top: rect.bottom,
            left: rect.left,
          });
        }}
        className={styles.columnMenuIcon}
      />
    </div>

    {columnMenu?.columnId === column.id && (
      <MenuPortal>
  <div
    ref={columnDropdownRef }
    className={styles.dropdownMenu}
    style={{
      top: columnMenu.top,
      left: columnMenu.left,
      position: "fixed",
      zIndex: 9999,
    }}
  >
    <button onClick={() => openRenameColumnModal(columnMenu.index)}>
      <FaPen size={12} style={{ marginRight: "6px" }} />
      Renomear
    </button>
    <button onClick={() => confirmDeleteColumn(columnMenu.index)}>
  <FaTrashAlt size={12} style={{ marginRight: "6px" }} />
  Excluir
</button>
  </div>
</MenuPortal>
    )}

    <div className={styles.columnContent}>
      {column.cards?.length > 0 ? (
        column.cards.map((card) => (
          <div key={card.id} className={styles.card}>
            {card.title}
          </div>
        ))
      ) : (
        <span className={styles.placeholder}>Sem cartões</span>
      )}
    </div>
  </div>
))}


                    {/* Botão fixo ao final das colunas */}
                    <button
  className={styles.addColumnStyledBtn}
  onClick={() => {
    if (selectedBoardIndex !== null) {
      setShowCreateColumnModal(true);
    } else {
      // Opcional: Avisar o usuário para selecionar ou criar um quadro
      alert("Selecione ou crie um quadro primeiro.");
    }
  }}
>
  <FaPlus size={10} style={{ marginRight: "6px" }} />
  Adicionar nova lista
</button>
                  </>
                ) : (
                  // Exibir área vazia com o botão centralizado
                  <div className={styles.emptyBoard}>
                    <p className={styles.emptyText}>
                      Este quadro está vazio.{" "}
                      <em>Comece criando uma coluna.</em>
                    </p>
<button
  className={styles.addColumnStyledBtn}
  onClick={() => {
    if (selectedBoardIndex !== null) {
      setShowCreateColumnModal(true);
    } else {
      // Opcional: Avisar o usuário para selecionar ou criar um quadro
      alert("Selecione ou crie um quadro primeiro.");
    }
  }}
>
  <FaPlus size={10} style={{ marginRight: "6px" }} />
  Adicionar nova lista
</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {showCreateColumnModal && (
            <CreateColumnModal
              onClose={() => setShowCreateColumnModal(false)}
              onCreate={handleCreateColumn}
            />
          )}


          
        </main>
      </div>

      {showModal && (
        <CreateBoardModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreateBoard}
        />
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

      {showCreateColumnModal && (
        <CreateColumnModal
          onClose={() => setShowCreateColumnModal(false)}
          onCreate={handleCreateColumn}
        />
      )}

{showRenameColumnModal && (
  <RenameColumnModal
    currentName={boards[selectedBoardIndex].columns[columnToRename].name}
    onClose={() => setShowRenameColumnModal(false)}
    onConfirm={handleConfirmRenameColumn}
  />
)}

{showDeleteColumnModal && (
  <DeleteColumnConfirmModal
    columnName={boards[selectedBoardIndex].columns[columnToDeleteIndex].name}
    onCancel={() => setShowDeleteColumnModal(false)}
    onConfirm={handleConfirmDeleteColumn}
  />
)}

    </div>
  );
};

export default BoardWorkspace;
