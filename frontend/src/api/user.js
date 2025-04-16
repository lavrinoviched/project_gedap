import axios from '@/lib/axios'

export const getUsers = async () => {
  return await axios.get('/admin/users')
}

export const updateUser = async (id, data) => {
  return await axios.put(`/admin/users/${id}`, data)
}

export const deleteUser = async (id) => {
  return await axios.delete(`/admin/users/${id}`)
}