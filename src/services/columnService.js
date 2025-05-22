// src/services/columnService.js
import axios from "axios";
import { VITE_API_URL } from "../config";
import { getTasks } from "./taskService";

export async function createColumn(boardId, title) {
    const token = localStorage.getItem("access_token");
  
    try {
      const response = await axios.post(
        `${VITE_API_URL}/column`,
        {
          board_id: boardId,
          title
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
  
      if (response.status === 200 && response.data?.id) {
        return {
          success: true,
          column: {
            id: String(response.data.id),
            name: response.data.title, // converte para 'name' porque o front usa isso
            cards: []
          }
        };
      } else {
        return {
          success: false,
          message: response.data?.message || "Erro ao criar coluna"
        };
      }
    } catch (error) {
      console.error("Erro ao criar coluna:", error);
      return {
        success: false,
        message: error.response?.data?.detail || "Erro inesperado"
      };
    }
  }  

  export async function updateColumn(boardId, columnId, title) {
    const token = localStorage.getItem("access_token");
  
    try {
      const response = await axios.put(
        `${VITE_API_URL}/column/${boardId}`,
        {
          column_id: columnId,
          title
        },
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
          message: response.data.message || "Falha ao renomear coluna."
        };
      }
    } catch (error) {
      console.error("Erro ao renomear coluna:", error);
      return {
        success: false,
        message: error.response?.data?.detail || "Erro inesperado"
      };
    }
  }  

  export async function deleteColumn(boardId, columnId) {
    const token = localStorage.getItem("access_token");
  
    try {
      const response = await axios.delete(`${VITE_API_URL}/column`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: {
          id: columnId,
          board_id: boardId
        }
      });
  
      if (response.status === 200 && response.data.success) {
        return { success: true };
      } else {
        return {
          success: false,
          message: response.data.message || "Erro ao deletar coluna."
        };
      }
    } catch (error) {
      console.error("Erro ao deletar coluna:", error);
      return {
        success: false,
        message: error.response?.data?.detail || "Erro inesperado"
      };
    }
  }

  const getToken = () => localStorage.getItem("access_token");

  export async function getBoardColumns(boardId) {
    try {
      const columnsData = await axios.get(`${VITE_API_URL}/column/${boardId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const columns = columnsData.data.columns || [];

      const columnsWithTasks = await Promise.all(
        columns.map(async (column) => {
          try {
            const tasks = await getTasks(boardId, column.id);
            return {
              ...column,
              cards: tasks || []
            };
          } catch (taskError) {
            console.error(`Erro ao buscar tasks para a coluna ${column.id}:`, taskError.response?.data || taskError.message);
            return { ...column, cards: [] };
          }
        })
      );

      // Retorna os dados como vieram do backend após buscar as tasks
      return columnsWithTasks;

    } catch (error) {
      console.error("Erro ao buscar colunas:", error.response?.data || error.message);
      throw error;
    }
  }
  
  

  
  