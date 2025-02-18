import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'
import { toast } from 'react-toastify'

//API Board
// export const fetchBoardDetailAPI = async (boardId) => {
//   const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
//   return response.data
// }

export const updateBoardDetailAPI = async (boardId, updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)
  return response.data
}

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/boards/supports/moving_cards`, updateData)
  return response.data
}

//API Column
export const createNewColumnAPI = async (newColumnData) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/columns`, newColumnData)
  return response.data
}

export const updateColumnDetailAPI = async (columnId, updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/columns/${columnId}`, updateData)
  return response.data
}

export const deleteColumnDetailAPI = async (columnId) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/columns/${columnId}`)
  return response.data
}

//API Card
export const createNewCardAPI = async (newCardData) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/cards`, newCardData)
  return response.data
}

//API User
export const registerUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/register`, data)
  toast.success('Account created successfully!')
  return response.data
}

export const verifyUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/verify`, data)
  toast.success('Account verified successfully!')
  return response.data
}

export const refreshTokenAPI = async (data) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/users/refresh_token`, data)
  return response.data
}