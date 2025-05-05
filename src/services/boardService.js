// src/services/boardService.js

export async function getBoards() {
    return [
      {
        id: 1,
        name: "Meu Quadro",
        userId: 1,
        columns: [
          { id: 1, name: "A Fazer", cards: [] },
          { id: 2, name: "Em Andamento", cards: [] },
          { id: 3, name: "Concluído", cards: [] }
        ]
      }
    ];
  }
  