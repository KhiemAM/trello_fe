import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElement } from '~/utils/formatters'

const authorizedAxiosInstance = axios.create()

authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10

authorizedAxiosInstance.defaults.withCredentials = true

authorizedAxiosInstance.interceptors.request.use((config) => {
  interceptorLoadingElement(true)
  return config
}, (error) => {

  return Promise.reject(error)
})

authorizedAxiosInstance.interceptors.response.use((response) => {
  interceptorLoadingElement(false)
  return response
}, (error) => {
  interceptorLoadingElement(false)

  let errorMessage = error?.message
  if (error.response?.data?.message) {
    errorMessage = error.response.data.message
  }
  if (error.response?.status !== 410) {
    toast.error(errorMessage)
  }

  return Promise.reject(error)
})

export default authorizedAxiosInstance