export async function getBoards() {
  return [
    {
      id: "1",
      name: "Meu Quadro",
      userId: "1",
      columns: [
        {
          id: "1-1",
          name: "A Fazer",
          cards: [
            { id: "1-1-1", title: "Estudar backlog" },
            { id: "1-1-2", title: "Criar componente de coluna" }
          ]
        },
        {
          id: "1-2",
          name: "Em Andamento",
          cards: [{ id: "1-2-1", title: "Implementar CreateColumnModal" }]
        },
        {
          id: "1-3",
          name: "Concluído",
          cards: [{ id: "1-3-1", title: "Exibir colunas mockadas" }]
        }
      ]
    }
  ];
}