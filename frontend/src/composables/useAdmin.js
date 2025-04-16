export const useAdmin = () => {
    const fetchUsers = async () => {
      return await $fetch('/api/admin/users')
    }
  
    const deleteUser = async (id) => {
      return await $fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
    }
  
    return { fetchUsers, deleteUser }
  }