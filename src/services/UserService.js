import Api from '@/services/Api'

export default {
  getAllUsers (credentials) {
    return Api().post('getAllUsers', credentials)
  },
  getUserInfo (credentials) {
    return Api().post('getUserInfo', credentials)
  },
  createUser (credentials) {
    return Api().post('createUser', credentials, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
}
