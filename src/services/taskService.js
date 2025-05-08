import axios from "axios";
import { API_URL } from "../config";

const getToken = () => localStorage.getItem("access_token");

export async function createTask({ board_id, column_id, title, description, due_date }) {
  try {
    const response = await axios.post(
      `${API_URL}/tasks`,
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
  try {
    const response = await axios.get(
      `${API_URL}/tasks?board_id=${boardId}&column_id=${columnId}`,
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );
    return response.data.tasks;
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error);
    return [];
  }
}

export async function updateTask({ board_id, column_id, task_id, title, description, due_date }) {
  try {
    const response = await axios.put(
      `${API_URL}/tasks`,
      { board_id, column_id, task_id, title, description, due_date },
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
    const response = await axios.delete(`${API_URL}/tasks`, {
      headers: { Authorization: `Bearer ${getToken()}` },
      data: { board_id, column_id, task_id },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar tarefa:", error);
    throw error;
  }
}
