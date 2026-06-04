import { onMounted, onUnmounted } from 'vue'
import axios from 'axios'

/**
 * 閲覧数カウントのComposable
 *
 * CarDetail.vueから使用する。
 * ページ表示後N秒経過したら閲覧数をAPIに記録する。
 * ページ離脱時はタイマーをキャンセルする。
 *
 * @param {Object} options
 * @param {number} options.carId - 車両ID
 * @param {number} options.dealerId - ディーラーID
 */
export const useViewCount = ({ getCarId, getDealerId }) => {
    let timer = null

    const getCookieId = () => {
        const key = 'view_cookie_id'
        let cookieId = localStorage.getItem(key)
        if (!cookieId) {
            cookieId = 'vc_' + Math.random().toString(36).slice(2) + Date.now().toString(36)
            localStorage.setItem(key, cookieId)
        }
        return cookieId
    }

    const fetchDelay = async () => {
        try {
            const res = await axios.get('/api/Analytics/viewDelay')
            return res.data.delay_seconds ?? 5
        } catch (e) {
            return 5
        }
    }

    const recordView = async () => {
        try {
            await axios.post('/api/Analytics/recordView', {
                car_id:    getCarId(),
                dealer_id: getDealerId(),
                cookie_id: getCookieId(),
            })
        } catch (e) {
            console.error('閲覧数の記録に失敗しました', e)
        }
    }

    /**
     * 外部から呼び出し可能なstart関数
     * fetchAll完了後に呼び出す
     */
    const start = async () => {
        const delay = await fetchDelay()
        timer = setTimeout(recordView, delay * 1000)
    }

    onUnmounted(() => {
        if (timer) clearTimeout(timer)
    })

    return { start }
}