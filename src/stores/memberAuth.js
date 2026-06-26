import { defineStore } from 'pinia'
import axios from 'axios'
import { initEcho } from './echo'

export const useMemberAuthStore = defineStore('memberAuth', {
    state: () => ({
        member: JSON.parse(localStorage.getItem('member') ?? 'null'),
    }),

    getters: {
        isLoggedIn: (state) => !!state.member,
    },

    actions: {
        async login(email, password) {
            const { data } = await axios.post('/api/MemberAuth/login', { email, password })

            this.member = data.member
            localStorage.setItem('member', JSON.stringify(data.member))
            initEcho()
        },

        async logout() {
            try {
                await axios.post('/api/MemberAuth/logout')
            } catch (e) {
                console.error(e)
            } finally {
                this.member = null
                localStorage.removeItem('member')
            }
        },

        restore() {
            if (this.member) {
                initEcho()
            }
        },
    },
})