import { defineStore } from 'pinia'
import axios from 'axios'
import { initEcho } from './echo'  // echoからimport

export const useMemberAuthStore = defineStore('memberAuth', {
    state: () => ({
        token:  localStorage.getItem('member_token') ?? null,
        member: JSON.parse(localStorage.getItem('member') ?? 'null'),
    }),

    getters: {
        isLoggedIn: (state) => !!state.token,
    },

    actions: {
        async login(email, password) {
            const { data } = await axios.post('/api/MemberAuth/login', { email, password })

            this.token  = data.token
            this.member = data.member

            localStorage.setItem('member_token', data.token)
            localStorage.setItem('member', JSON.stringify(data.member))

            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
            initEcho(data.token) // 追加
        },

        async logout() {
            try {
                await axios.post('/api/MemberAuth/logout')
            } catch (e) {
                console.error(e)
            } finally {
                this.token  = null
                this.member = null
                localStorage.removeItem('member_token')
                localStorage.removeItem('member')
                delete axios.defaults.headers.common['Authorization']
            }
        },

        restore() {
            if (this.token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
                initEcho(this.token) // 追加
            }
        },
    },
})