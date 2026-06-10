export const AttachmentLimits = {
    IMAGE_MAX_SIZE: 10 * 1024 * 1024,   // 10MB
    VIDEO_MAX_SIZE: 100 * 1024 * 1024,  // 100MB
    FILE_MAX_SIZE:  20 * 1024 * 1024,   // 20MB

    IMAGE_TYPES: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    VIDEO_TYPES: ['mp4', 'mov'],
    FILE_TYPES:  ['pdf', 'doc', 'docx', 'xls', 'xlsx'],

    MAX_FILES: 5,

    allTypes() {
        return [...this.IMAGE_TYPES, ...this.VIDEO_TYPES, ...this.FILE_TYPES]
    },

    getType(extension) {
        const ext = extension.toLowerCase()
        if (this.IMAGE_TYPES.includes(ext)) return 'image'
        if (this.VIDEO_TYPES.includes(ext)) return 'video'
        return 'file'
    },

    getMaxSize(extension) {
        const type = this.getType(extension)
        if (type === 'image') return this.IMAGE_MAX_SIZE
        if (type === 'video') return this.VIDEO_MAX_SIZE
        return this.FILE_MAX_SIZE
    },
}