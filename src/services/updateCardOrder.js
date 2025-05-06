export const updateCardOrder = async (boardId, columns) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Nova ordem enviada ao backend:", { boardId, columns });
        resolve({ success: true });
      }, 300);
    });
  };
  