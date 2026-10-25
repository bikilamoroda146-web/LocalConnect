import { useEffect, useState } from 'react'
import { ImagePlus, Trash2 } from 'lucide-react'
import Field from '../common/Field'
import Button from '../common/Button'
import Modal from '../common/Modal'
import PortfolioImage from './PortfolioImage'
import { categories } from '../../data/categories'

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 5 * 1024 * 1024
const MAX_PHOTOS = 8

export default function PortfolioProjectEditor({ ownerId, project, defaultCategory, onSave, onClose }) {
  const [title, setTitle] = useState(project?.title ?? '')
  const [description, setDescription] = useState(project?.description ?? '')
  const [category, setCategory] = useState(project?.category ?? defaultCategory)
  const [completedAt, setCompletedAt] = useState(project?.completedAt ?? '')
  const [location, setLocation] = useState(project?.location ?? '')
  const [newPhotos, setNewPhotos] = useState([])
  const [removedIds, setRemovedIds] = useState([])
  const [previewUrls, setPreviewUrls] = useState([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const retainedPhotos = (project?.photoIds ?? []).filter((id) => !removedIds.includes(id))

  useEffect(() => {
    const urls = newPhotos.map((file) => URL.createObjectURL(file))
    setPreviewUrls(urls)
    return () => urls.forEach((url) => URL.revokeObjectURL(url))
  }, [newPhotos])

  const choosePhotos = (event) => {
    const files = [...(event.target.files ?? [])]
    event.target.value = ''
    if (!files.length) return
    const invalid = files.find((file) => !IMAGE_TYPES.includes(file.type))
    if (invalid) {
      setError('Choose JPEG, PNG, or WebP images only.')
      return
    }
    if (files.some((file) => file.size > MAX_FILE_SIZE)) {
      setError('Each project photo must be 5 MB or smaller.')
      return
    }
    if (retainedPhotos.length + newPhotos.length + files.length > MAX_PHOTOS) {
      setError(`A project can have up to ${MAX_PHOTOS} photos.`)
      return
    }
    setError('')
    setNewPhotos((current) => [...current, ...files])
  }

  const removeExisting = (id) => {
    if (!window.confirm('Remove this project photo? It will be deleted when you save the project.')) return
    setRemovedIds((current) => [...current, id])
  }

  const removeNewPhoto = (index) => {
    if (!window.confirm('Remove this selected photo from the project?')) return
    setNewPhotos((current) => current.filter((_, i) => i !== index))
  }

  const submit = async (event) => {
    event.preventDefault()
    if (title.trim().length < 2) {
      setError('Enter a project title of at least 2 characters.')
      return
    }
    if (description.trim().length < 10) {
      setError('Add a short description of at least 10 characters.')
      return
    }
    setSaving(true)
    try {
      await onSave({
        ...(project ?? {}),
        id: project?.id ?? `project-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title: title.trim(),
        description: description.trim(),
        category,
        completedAt,
        location: location.trim(),
        photoIds: retainedPhotos,
        newPhotos,
        removedIds,
      })
    } catch (saveError) {
      setError(saveError.message || 'Could not save this project. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open onClose={onClose} title={project ? 'Edit project' : 'Add portfolio project'}
      footer={<><Button variant="secondary" onClick={onClose} disabled={saving}>Cancel</Button><Button onClick={submit} loading={saving} disabled={saving}>{project ? 'Save project' : 'Add project'}</Button></>}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Project title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={100} required />
        <Field label="Description" as="textarea" rows={4} value={description} onChange={(event) => setDescription(event.target.value)} maxLength={1000} hint="Describe the work, materials, or result." required />
        <Field label="Service category" as="select" value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Completion date (optional)" type="date" value={completedAt} onChange={(event) => setCompletedAt(event.target.value)} />
          <Field label="Location (optional)" value={location} onChange={(event) => setLocation(event.target.value)} maxLength={100} />
        </div>
        <div>
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div><p className="text-sm font-medium text-ink">Project photos</p><p className="text-sm text-ink-muted">JPEG, PNG, or WebP; up to 5 MB each. Maximum {MAX_PHOTOS} photos.</p></div>
            <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-ink hover:bg-slate-50 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand">
              <ImagePlus size={16} aria-hidden="true" /> Add photos
              <input type="file" accept="image/jpeg,image/png,image/webp" multiple aria-label="Add project photos" onChange={choosePhotos} className="sr-only" />
            </label>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {retainedPhotos.map((id) => <div key={id} className="relative aspect-square overflow-hidden rounded-md">
              <PortfolioImage ownerId={ownerId} mediaId={id} alt="Existing project photo" className="h-full w-full" />
              <button type="button" onClick={() => removeExisting(id)} aria-label="Remove project photo" className="absolute right-1 top-1 rounded-full bg-white/95 p-1.5 text-red-700 shadow hover:bg-white"><Trash2 size={15} /></button>
            </div>)}
            {previewUrls.map((url, index) => <div key={`${url}-${index}`} className="relative aspect-square overflow-hidden rounded-md">
              <img src={url} alt={`New project photo ${index + 1} preview`} onError={() => setError('A selected photo could not be previewed. Please choose another image.')} className="h-full w-full object-cover" />
              <button type="button" onClick={() => removeNewPhoto(index)} aria-label={`Remove new photo ${index + 1}`} className="absolute right-1 top-1 rounded-full bg-white/95 p-1.5 text-red-700 shadow hover:bg-white"><Trash2 size={15} /></button>
            </div>)}
            {!retainedPhotos.length && !previewUrls.length && <p className="col-span-full rounded-md border border-dashed border-slate-300 p-4 text-center text-sm text-ink-muted">Add a few photos to show the finished work.</p>}
          </div>
        </div>
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      </form>
    </Modal>
  )
}
