import { useState, useRef, useEffect } from "react";
import styles from "./styles/boardWorkspace.module.css";
import { useNavigate } from "react-router-dom";
import CreateBoardModal from "./CreateBoardModal";
import CreateColumnModal from "./CreateColumnModal";
import RenameBoardModal from "./RenameBoardModal";
import { createCard } from "../../services/cardService";
import DeleteConfirmModal from "./DeleteConfirmModal";
import RenameColumnModal from "./RenameColumnModal";
import DeleteCardConfirmModal from "./DeleteCardConfirmModal";
import CreateCardModal from "./CreateCardModal";
import { updateCardOrder } from "../../services/cardService";
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
import { toast } from "react-toastify";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";


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
  const [showCreateCardModal, setShowCreateCardModal] = useState(false);
  const [columnToAddCard, setColumnToAddCard] = useState(null);
  const [cardToEdit, setCardToEdit] = useState(null);
  const [showDeleteCardConfirmModal, setShowDeleteCardConfirmModal] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);


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
  
      const normalizedBoards = data.map((board) => ({
        ...board,
        id: String(board.id),
        columns: board.columns.map((column) => ({
          ...column,
          id: String(column.id),
          cards: column.cards.map((card) => ({
            ...card,
            id: String(card.id),
          })),
        })),
      }));
  
      setBoards(normalizedBoards);
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

  const handleCreateCardClick = (colIndex) => {
    setColumnToAddCard(colIndex);
    setShowCreateCardModal(true);
  };

  const handleCreateCard = async (cardData) => {
    const updatedBoards = structuredClone(boards);
    const board = updatedBoards[selectedBoardIndex];

    try {
      // Verifica se é edição
      if (cardData.id) {
        const columnIndex = cardData.columnIndex ?? columnToAddCard;
        const cards = board.columns[columnIndex].cards;

        const cardIndex = cards.findIndex((c) => c.id === cardData.id);
        if (cardIndex !== -1) {
          cards[cardIndex] = { ...cards[cardIndex], ...cardData };
          toast.success("Cartão atualizado com sucesso!");
        } else {
          toast.warn("Cartão não encontrado para atualização.");
        }
      } else {
        // Novo cartão
        const columnIndex = columnToAddCard;
        const newCard = await createCard(board.id, board.columns[columnIndex].id, cardData);
        board.columns[columnIndex].cards.push(newCard);
        toast.success("Cartão criado com sucesso!");
      }

      setBoards(updatedBoards);
      setShowCreateCardModal(false);
      setCardToEdit(null);
    } catch (error) {
      console.error("Erro ao salvar cartão:", error);
      toast.error("Erro ao salvar o cartão.");
    }
  };


  const handleDeleteCard = (card) => {
    setCardToDelete(card);
    setShowDeleteCardConfirmModal(true);
  };

  const confirmDeleteCard = () => {
    const updatedBoards = structuredClone(boards);
    const columnIndex = cardToDelete.columnIndex;

    updatedBoards[selectedBoardIndex].columns[columnIndex].cards =
      updatedBoards[selectedBoardIndex].columns[columnIndex].cards.filter(
        (c) => c.id !== cardToDelete.id
      );

    setBoards(updatedBoards);
    setCardToDelete(null);
    setShowDeleteCardConfirmModal(false);
    setShowCreateCardModal(false);
    setCardToEdit(null);

    toast.success("Cartão excluído com sucesso!");
  };

  const handleDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;

    const updatedBoards = structuredClone(boards);
    const board = updatedBoards[selectedBoardIndex];

    const sourceColIndex = board.columns.findIndex(
      (col) => String(col.id) === source.droppableId
    );
    const destColIndex = board.columns.findIndex(
      (col) => String(col.id) === destination.droppableId
    );

    const sourceCol = board.columns[sourceColIndex];
    const destCol = board.columns[destColIndex];

    const [movedCard] = sourceCol.cards.splice(source.index, 1);
    destCol.cards.splice(destination.index, 0, movedCard);

    setBoards(updatedBoards);

    try {
      await updateCardOrder(board.id, board.columns);
    } catch (error) {
      console.error("Erro ao atualizar ordem dos cards:", error);
      toast.error("Erro ao salvar nova ordem dos cards.");
    }
  };



  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div
            className={`${styles.logo} ${!sidebarOpen ? styles.logoHidden : ""
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
          className={`${styles.toggleContainer} ${sidebarOpen ? styles.open : styles.closed
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
          className={`${styles.sidebar} ${!sidebarOpen ? styles.sidebarClosed : ""
            }`}
        >
          <h3 className={styles.sidebarTitle}>Task Workspace</h3>
          <div className={styles.sidebarSection}>
            <p className={styles.sectionLabel}>Meus Quadros</p>
            <ul className={styles.boardList}>
              {boards.map((board, index) => (
                <li
                  key={index}
                  className={`${styles.boardItem} ${selectedBoardIndex === index ? styles.activeBoard : ""
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

              <DragDropContext onDragEnd={handleDragEnd}>
                <div className={styles.columnsArea}>
                  {boards[selectedBoardIndex]?.columns?.length > 0 ? (
                    <>
                      {boards[selectedBoardIndex].columns.map((column, colIndex) => (
                        <Droppable droppableId={String(column.id)} key={column.id}>
                          {(provided) => (
                            <div
                              className={styles.column}
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                            >
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
                                    ref={columnDropdownRef}
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
                                  column.cards.map((card, cardIndex) => (
                                    <Draggable draggableId={String(card.id)} index={cardIndex} key={card.id}>
                                      {(provided) => (
                                        <div
                                          className={styles.card}
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          onClick={() => {
                                            setCardToEdit({ ...card, columnIndex: colIndex });
                                            setShowCreateCardModal(true);
                                          }}
                                        >
                                          {card.title}
                                        </div>
                                      )}
                                    </Draggable>
                                  ))
                                ) : (
                                  <span className={styles.placeholder}>Sem cartões</span>
                                )}
                                {provided.placeholder}
                              </div>

                              <button
                                className={styles.addCardBtn}
                                onClick={() => handleCreateCardClick(colIndex)}
                              >
                                + Adicionar Cartão
                              </button>
                            </div>
                          )}
                        </Droppable>
                      ))}

                      <button
                        className={styles.addColumnStyledBtn}
                        onClick={() => {
                          if (selectedBoardIndex !== null) {
                            setShowCreateColumnModal(true);
                          } else {
                            alert("Selecione ou crie um quadro primeiro.");
                          }
                        }}
                      >
                        <FaPlus size={10} style={{ marginRight: "6px" }} />
                        Adicionar nova lista
                      </button>
                    </>
                  ) : (
                    <div className={styles.emptyBoard}>
                      <p className={styles.emptyText}>
                        Este quadro está vazio. <em>Comece criando uma coluna.</em>
                      </p>
                      <button
                        className={styles.addColumnStyledBtn}
                        onClick={() => {
                          if (selectedBoardIndex !== null) {
                            setShowCreateColumnModal(true);
                          } else {
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
              </DragDropContext>

            </div>
          )}

          {/* Modal de criação de coluna */}
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

      {showCreateCardModal && (
        <CreateCardModal
          onClose={() => {
            setShowCreateCardModal(false);
            setCardToEdit(null);
          }}
          onCreate={handleCreateCard}
          onDelete={handleDeleteCard}  // ✅ nova prop
          card={cardToEdit}
          isEditing={!!cardToEdit}
        />
      )}

      {showDeleteCardConfirmModal && (
        <DeleteCardConfirmModal
          cardTitle={cardToDelete?.title}
          onCancel={() => {
            setShowDeleteCardConfirmModal(false);
            setCardToDelete(null);
          }}
          onConfirm={confirmDeleteCard}
        />
      )}

    </div>
  );
};

export default BoardWorkspace;