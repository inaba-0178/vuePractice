// stores/regions.js
import { defineStore } from 'pinia'
import axios from 'axios'

export const useRegionsStore = defineStore('regions', {
  state: () => ({ regions: [], loading: false }),
  actions: {
    async fetchRegions() {
      this.loading = true
      try {
        const { data } = await axios.get('http://laravel11practice.local:81/api/regions')
        this.regions = data
      } finally {
        this.loading = false
      }
    }
  }
})
