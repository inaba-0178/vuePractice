import { defineStore } from 'pinia'
import axios from 'axios'

export const useMemberAuthStore = defineStore('memberAuth', {
  state: () => ({
    token: localStorage.getItem('member_token') ?? null,
    user:  JSON.parse(localStorage.getItem('member_user') ?? 'null'),
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    async login(email, password) {
      const { data } = await axios.post('/api/MemberAuth/login', { email, password })

      this.token = data.token
      this.user  = data.user

      localStorage.setItem('member_token', data.token)
      localStorage.setItem('member_user', JSON.stringify(data.user))

      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    },

    async logout() {
      try {
        await axios.post('/api/MemberAuth/logout')
      } catch (e) {
        console.error(e)
      } finally {
        this.token = null
        this.user  = null
        localStorage.removeItem('member_token')
        localStorage.removeItem('member_user')
        delete axios.defaults.headers.common['Authorization']
      }
    },

    restore() {
      if (this.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
      }
    },
  },
})