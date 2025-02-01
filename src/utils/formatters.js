export const capitalizeFirstLetter = (value) => {
  if (!value) return ''
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`
}

export const generatePlaceholderCard = (column) => {
  return {
    _id: `${column._id}-placeholder-card`,
    boardId: column.boardId,
    columnId: column._id,
    FE_PlaceholderCard: true
  }
}