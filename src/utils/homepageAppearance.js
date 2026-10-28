import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE_BYTES } from './media'

const DB_NAME = 'localconnect-homepage-appearance'
const STORE_NAME = 'appearance'
const RECORD_KEY = 'hero'

export const DEFAULT_HOMEPAGE_APPEARANCE = {
  image: null,
  position: 'center',
}

const POSITIONS = ['center', 'top', 'bottom']

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('This browser does not support local image storage.'))
      return
    }

    const request = window.indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME, { keyPath: 'key' })
      }
    }
    request.onsuccess = () => {
      request.result.onversionchange = () => request.result.close()
      resolve(request.result)
    }
    request.onerror = () => reject(request.error ?? new Error('Could not open local homepage image storage.'))
    request.onblocked = () => reject(new Error('Homepage image storage is blocked by another browser tab.'))
  })
}

function validateAppearance({ image, position }) {
  if (!POSITIONS.includes(position)) throw new Error('Choose a valid homepage image position.')
  if (image !== null && !(image instanceof Blob)) throw new Error('The selected homepage image is invalid.')
  if (image && !ACCEPTED_IMAGE_TYPES.includes(image.type)) {
    throw new Error('Choose a JPEG, PNG, or WebP image.')
  }
  if (image && image.size > MAX_IMAGE_SIZE_BYTES) throw new Error('Homepage images must be 5 MB or smaller.')
}

export async function getHomepageAppearance() {
  const database = await openDatabase()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readonly')
    const request = transaction.objectStore(STORE_NAME).get(RECORD_KEY)
    let record = null

    request.onsuccess = () => { record = request.result ?? null }
    request.onerror = () => {
      database.close()
      reject(request.error ?? new Error('Could not read the saved homepage appearance.'))
    }
    transaction.oncomplete = () => {
      database.close()
      resolve(record
        ? { image: record.image ?? null, position: POSITIONS.includes(record.position) ? record.position : 'center' }
        : DEFAULT_HOMEPAGE_APPEARANCE)
    }
    transaction.onerror = () => {
      database.close()
      reject(transaction.error ?? new Error('Could not read the saved homepage appearance.'))
    }
    transaction.onabort = () => {
      database.close()
      reject(transaction.error ?? new Error('Could not read the saved homepage appearance.'))
    }
  })
}

export async function saveHomepageAppearance(appearance) {
  validateAppearance(appearance)
  const record = { key: RECORD_KEY, ...appearance, updatedAt: Date.now() }
  const database = await openDatabase()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite')
    transaction.objectStore(STORE_NAME).put(record)
    transaction.oncomplete = () => {
      database.close()
      resolve({ image: record.image, position: record.position })
    }
    transaction.onerror = () => {
      database.close()
      reject(transaction.error ?? new Error('Could not save the homepage appearance.'))
    }
    transaction.onabort = () => {
      database.close()
      reject(transaction.error ?? new Error('Could not save the homepage appearance.'))
    }
  })
}
