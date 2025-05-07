import axios from "axios";
import { API_URL } from "../config";

export async function getBoards() {
  const token = localStorage.getItem("access_token");

  try {
    const boardResponse = await axios.get(`${API_URL}/boards`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const boards = boardResponse.data.boards;

    // Agora busca as colunas de cada board separadamente
    const boardsWithColumns = await Promise.all(
      boards.map(async (board) => {
        try {
          const colRes = await axios.get(`${API_URL}/column/${board.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          const columns = colRes.data.columns || [];

          // Normaliza estrutura com cards vazios (ou ajuste se vierem com cards)
          const normalizedColumns = columns.map((column) => ({
            ...column,
            id: String(column.id),
            cards: column.cards
              ? column.cards.map((card) => ({ ...card, id: String(card.id) }))
              : []
          }));

          return {
            ...board,
            id: String(board.id),
            name: board.title,
            columns: normalizedColumns
          };
        } catch (err) {
          console.error(`Erro ao buscar colunas do board ${board.id}:`, err);
          return {
            ...board,
            id: String(board.id),
            name: board.title,
            columns: []
          };
        }
      })
    );

    return boardsWithColumns;
  } catch (error) {
    console.error("Erro ao buscar quadros:", error);
    return [];
  }
}

export async function createBoard(title) {
  const token = localStorage.getItem("access_token");

  try {
    const response = await axios.post(
      `${API_URL}/boards`,
      { title },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.status === 200) {
      return {
        success: true,
        board: {
          id: String(response.data.board_id),
          name: title,
          columns: [],
          created_at: response.data.created_at
        }
      };
    }
  } catch (error) {
    console.error("Erro ao criar quadro:", error);
    return {
      success: false,
      message: error.response?.data?.detail || "Erro ao criar quadro"
    };
  }
}

export async function deleteBoard(boardId) {
  const token = localStorage.getItem("access_token");

  try {
    const response = await axios.delete(`${API_URL}/boards/${boardId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.status === 200 && response.data.success) {
      return { success: true };
    } else {
      return { success: false, message: response.data.message || "Falha ao excluir." };
    }
  } catch (error) {
    console.error("Erro ao deletar board:", error);
    return {
      success: false,
      message: error.response?.data?.detail || "Erro inesperado."
    };
  }
}

export async function updateBoard(boardId, newTitle) {
  const token = localStorage.getItem("access_token");
  try {
    const response = await axios.put(
      `${API_URL}/boards/${boardId}`,
      { title: newTitle },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.status === 200 && response.data.success) {
      return { success: true };
    } else {
      return {
        success: false,
        message: response.data.message || "Falha ao atualizar título."
      };
    }
  } catch (error) {
    console.error("Erro ao renomear quadro:", error);
    return {
      success: false,
      message: error.response?.data?.detail || "Erro inesperado ao atualizar quadro."
    };
  }
}
