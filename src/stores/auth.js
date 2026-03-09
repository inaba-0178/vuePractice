import { defineStore } from 'pinia'
import axios from 'axios'
import { initEcho } from './echo'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') ?? null,
    user:  JSON.parse(localStorage.getItem('user') ?? 'null'),
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    async login(email, password) {
      const { data } = await axios.post('/api/login', { email, password })

      this.token = data.token
      this.user  = data.user

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
      initEcho(data.token)
    },

    async logout() {
        try {
            await axios.post('/api/logout')
        } catch (e) {
            console.error(e)
        } finally {
            this.token = null
            this.user  = null
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            delete axios.defaults.headers.common['Authorization']
        }
    },

    restore() {
      if (this.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        initEcho(this.token)
      }
    },
  },
})