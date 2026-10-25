import { useState } from 'react'
import PageHeader from '../../components/common/PageHeader'
import Field from '../../components/common/Field'
import Button from '../../components/common/Button'
import ProfilePhotoField from '../../components/common/ProfilePhotoField'
import useProfilePhoto from '../../hooks/useProfilePhoto'
import { useApp } from '../../app/AppContext'
import { locations } from '../../data/categories'
import { isEmail } from '../../utils/validation'
import { removeProfilePhoto, saveProfilePhoto } from '../../utils/profilePhotos'

export default function CustomerProfile() {
  const { user, updateUser, toast } = useApp()
  const photo = useProfilePhoto(user.id)
  const initial = () => ({ name: user.name, email: user.email, phone: user.phone ?? '', area: user.area ?? '' })
  const [f, setF] = useState(initial)
  const [err, setErr] = useState({})
  const [photoSelection, setPhotoSelection] = useState({ type: 'unchanged' })
  const [photoResetKey, setPhotoResetKey] = useState(0)
  const [saving, setSaving] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const cancel = () => {
    setF(initial())
    setErr({})
    setPhotoSelection({ type: 'unchanged' })
    setPhotoResetKey((key) => key + 1)
  }
  const save = async (e) => {
    e.preventDefault()
    const errors = {}
    if (f.name.trim().length < 2) errors.name = 'Enter your name.'
    if (!isEmail(f.email)) errors.email = 'Enter a valid email address.'
    if (f.phone && !/^[+\d][\d\s-]{6,}$/.test(f.phone)) errors.phone = 'Use digits, spaces or dashes (at least 7 characters).'
    setErr(errors)
    if (Object.keys(errors).length) return toast('Fix the highlighted fields and try again.', 'error')
    setSaving(true)
    try {
      if (!updateUser(user.id, { ...f, name: f.name.trim() })) {
        toast('Your profile could not be saved in this browser. Check available storage and try again.', 'error')
        return
      }
      try {
        if (photoSelection.type === 'file') await saveProfilePhoto(user.id, photoSelection.file)
        if (photoSelection.type === 'remove') await removeProfilePhoto(user.id)
      } catch (error) {
        toast(`Your profile details were saved, but the photo could not be stored: ${error.message}`, 'error')
        return
      }
      setF((current) => ({ ...current, name: current.name.trim() }))
      setPhotoSelection({ type: 'unchanged' })
      setPhotoResetKey((key) => key + 1)
      toast('Profile saved in this browser.')
    } finally {
      setSaving(false)
    }
  }
  return (
    <>
      <PageHeader title="Edit your profile" text="Update the details providers use to contact you." />
      <form onSubmit={save} noValidate className="max-w-2xl space-y-4">
        <ProfilePhotoField name={f.name || user.name} photoUrl={photo.url} photoError={photo.error} selection={photoSelection} onSelectionChange={setPhotoSelection} resetKey={photoResetKey} />
        <div className="card space-y-4 p-6">
        <Field label="Display name" value={f.name} onChange={set('name')} error={err.name} />
        <Field label="Email" type="email" value={f.email} onChange={set('email')} error={err.email} />
        <Field label="Phone (optional)" type="tel" value={f.phone} onChange={set('phone')} error={err.phone} />
        <Field label="Location" as="select" value={f.area} onChange={set('area')}><option value="">Select location</option>{locations.map((l) => <option key={l}>{l}</option>)}</Field>
        <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900">Profile changes and photos are stored only in this browser. They are not synchronized to other devices or users.</p>
        <div className="flex flex-wrap gap-3"><Button type="submit" loading={saving} disabled={saving}>Save changes</Button><Button variant="secondary" onClick={cancel} disabled={saving}>Cancel</Button></div>
        </div>
      </form>
    </>
  )
}
