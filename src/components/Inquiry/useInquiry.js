import { ref } from 'vue'
import axios from 'axios'

/**
 * 問い合わせ送信のComposable
 *
 * InquiryModal.vueから使用する。
 * 送信処理・ローディング状態・エラー管理を担当する。
 */
export const useInquiry = () => {
    const loading = ref(false)
    const error   = ref(null)
    const success  = ref(false)

    /**
     * 問い合わせを送信する
     *
     * @param {Object} formData - フォームデータ
     * @param {number} formData.dealer_id
     * @param {number} formData.car_id
     * @param {string} formData.inquiry_type
     * @param {string|null} formData.name
     * @param {string|null} formData.email
     * @param {string|null} formData.phone
     * @param {string|null} formData.postal_code
     * @param {string|null} formData.address
     * @param {string|null} formData.message
     */
    const submit = async (formData) => {
        loading.value = true
        error.value   = null
        success.value  = false

        try {
            await axios.post('/api/Inquiry/create', formData)
            success.value = true
        } catch (e) {
            error.value = e.response?.data?.message ?? '送信に失敗しました。もう一度お試しください。'
        } finally {
            loading.value = false
        }
    }

    const reset = () => {
        loading.value = false
        error.value   = null
        success.value  = false
    }

    return { loading, error, success, submit, reset }
}