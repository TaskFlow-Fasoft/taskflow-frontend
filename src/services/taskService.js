import axios from "axios";
import { VITE_API_URL } from "../config";

const getToken = () => localStorage.getItem("access_token");

export async function createTask({ board_id, column_id, title, description, due_date }) {
  try {
    const response = await axios.post(
      `${VITE_API_URL}/tasks`,
      { board_id, column_id, title, description, due_date },
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    throw error;
  }
}

export async function getTasks(boardId, columnId) {
  if (!boardId || !columnId) {
    console.error("ID de quadro ou coluna ausente");
    return [];
  }

  try {
    console.log("Requisição GET /tasks com:", { boardId, columnId });

    const response = await axios.get(
      `${VITE_API_URL}/tasks?board_id=${boardId}&column_id=${columnId}`,
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );
    return response.data.tasks;
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error.response?.data || error.message);
    return [];
  }
}

export async function updateTask({ board_id, column_id, old_column_id, task_id, title, description, due_date }) {
  try {
    const cleanedBoardId = board_id.toString().replace('col-', '');
    const cleanedColumnId = column_id.toString().replace('col-', '');
    const cleanedOldColumnId = old_column_id.toString().replace('col-', '');
    const cleanedTaskId = task_id.toString().replace('card-', '');

    console.log('Payload enviado para updateTask:', {
      board_id: cleanedBoardId,
      column_id: cleanedColumnId,
      old_column_id: cleanedOldColumnId,
      task_id: cleanedTaskId,
      title,
      description,
      due_date,
    });

    const response = await axios.put(
      `${VITE_API_URL}/tasks`,
      { board_id: cleanedBoardId, column_id: cleanedColumnId, old_column_id: cleanedOldColumnId, task_id: cleanedTaskId, title, description, due_date },
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error);
    throw error;
  }
}

export async function deleteTask({ board_id, column_id, task_id }) {
  try {
    const cleanedBoardId = board_id.toString().replace('col-', '');
    const cleanedColumnId = column_id.toString().replace('col-', '');
    const cleanedTaskId = task_id.toString().replace('card-', '');

    const response = await axios.delete(`${VITE_API_URL}/tasks`, {
      headers: { Authorization: `Bearer ${getToken()}` },
      data: { board_id: cleanedBoardId, column_id: cleanedColumnId, task_id: cleanedTaskId },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar tarefa:", error);
    throw error;
  }
}
