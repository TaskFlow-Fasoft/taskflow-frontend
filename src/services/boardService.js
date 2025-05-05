export async function getBoards() {
  return [
    {
      id: 1,
      name: "Meu Quadro",
      userId: 1,
      columns: [
        {
          id: 1,
          name: "A Fazer",
          cards: [
            { id: 1, title: "Estudar backlog" },
            { id: 2, title: "Criar componente de coluna" }
          ]
        },
        {
          id: 2,
          name: "Em Andamento",
          cards: [{ id: 3, title: "Implementar CreateColumnModal" }]
        },
        {
          id: 3,
          name: "Concluído",
          cards: [{ id: 4, title: "Exibir colunas mockadas" }]
        }
      ]
    }
  ];
}
