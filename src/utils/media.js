export const ACCEPTED_IMAGE_TYPES = Object.freeze(['image/jpeg', 'image/png', 'image/webp'])
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024

export const isSupportedImageType = (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type)
