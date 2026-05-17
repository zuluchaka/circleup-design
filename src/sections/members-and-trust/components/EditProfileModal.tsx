import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { X, User, Camera, MapPin } from 'lucide-react'
import { countries, genderOptions } from '@/data/auth-data'

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

type Step = 'idle' | 'saving' | 'error'

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
]

export function EditProfileModal({ isOpen, onClose, onSuccess }: EditProfileModalProps) {
  const { user, updateProfile } = useAuth()
  const [step, setStep] = useState<Step>('idle')
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [gender, setGender] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [phoneCountryCode, setPhoneCountryCode] = useState('')
  const [phone, setPhone] = useState('')
  const [bio, setBio] = useState('')
  const [street, setStreet] = useState('')
  const [houseNumber, setHouseNumber] = useState('')
  const [postcode, setPostcode] = useState('')
  const [city, setCity] = useState('')
  const [addressCountryCode, setAddressCountryCode] = useState('')
  const [nationality, setNationality] = useState('')
  const [preferredLanguage, setPreferredLanguage] = useState('en')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  // Pre-fill form when modal opens
  useEffect(() => {
    if (isOpen && user) {
      setEmail(user.email || '')
      setFirstName(user.firstName || '')
      setLastName(user.lastName || '')
      setGender(user.gender || '')
      setDateOfBirth(user.dateOfBirth || '')
      setPhoneCountryCode(user.phoneCountryCode || '')
      setPhone(user.phone || '')
      setBio(user.bio || '')
      setStreet(user.street || '')
      setHouseNumber(user.houseNumber || '')
      setPostcode(user.postcode || '')
      setCity(user.city || '')
      setAddressCountryCode(user.addressCountryCode || '')
      setNationality(user.nationality || '')
      setPreferredLanguage(user.preferredLanguage || 'en')
      setAvatarFile(null)
      setAvatarPreview(null)
      setStep('idle')
      setError(null)
    }
  }, [isOpen, user])

  // Clean up object URL on unmount
  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview)
    }
  }, [avatarPreview])

  if (!isOpen || !user) return null

  const firstNameValid = firstName.trim().length >= 2 && firstName.trim().length <= 50
  const lastNameValid = lastName.trim().length >= 2 && lastName.trim().length <= 50
  const canSubmit = firstNameValid && lastNameValid && step !== 'saving'

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (avatarPreview) URL.revokeObjectURL(avatarPreview)
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const displayAvatar = avatarPreview || user.avatarUrl

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    setError(null)
    setStep('saving')

    if (avatarFile) {
      // Use FormData for file upload
      const formData = new FormData()
      formData.append('user[email]', email.trim())
      formData.append('user[first_name]', firstName.trim())
      formData.append('user[last_name]', lastName.trim())
      formData.append('user[phone]', phone.trim())
      formData.append('user[phone_country_code]', phoneCountryCode)
      formData.append('user[bio]', bio.trim())
      formData.append('user[gender]', gender)
      formData.append('user[date_of_birth]', dateOfBirth)
      formData.append('user[street]', street.trim())
      formData.append('user[house_number]', houseNumber.trim())
      formData.append('user[postcode]', postcode.trim())
      formData.append('user[city]', city.trim())
      formData.append('user[address_country_code]', addressCountryCode)
      formData.append('user[nationality]', nationality)
      formData.append('user[preferred_language]', preferredLanguage)
      formData.append('user[avatar]', avatarFile)

      const result = await updateProfile(formData)
      if (result.success) {
        onSuccess?.()
        onClose()
      } else {
        setError(result.error || 'Update failed')
        setStep('error')
      }
    } else {
      const result = await updateProfile({
        email: email.trim(),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim() || null,
        phone_country_code: phoneCountryCode || null,
        bio: bio.trim() || null,
        gender: gender || null,
        date_of_birth: dateOfBirth || null,
        street: street.trim() || null,
        house_number: houseNumber.trim() || null,
        postcode: postcode.trim() || null,
        city: city.trim() || null,
        address_country_code: addressCountryCode || null,
        nationality: nationality || null,
        preferred_language: preferredLanguage,
      })

      if (result.success) {
        onSuccess?.()
        onClose()
      } else {
        setError(result.error || 'Update failed')
        setStep('error')
      }
    }
  }

  const inputClass =
    'w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'

  const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Edit Profile</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {/* Avatar upload */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="relative w-20 h-20 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-600 cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              {displayAvatar ? (
                <img src={displayAvatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-10 h-10 text-slate-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Change Photo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          {/* Email */}
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
            {user.unconfirmedEmail && (
              <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                Pending confirmation for {user.unconfirmedEmail}. Check your inbox.
              </p>
            )}
            {email !== user.email && !user.unconfirmedEmail && (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                A confirmation email will be sent to verify your new address.
              </p>
            )}
          </div>

          {/* Name row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>First Name *</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={inputClass}
                maxLength={50}
              />
              {firstName.length > 0 && !firstNameValid && (
                <p className="mt-1 text-xs text-red-500">2-50 characters required</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Last Name *</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={inputClass}
                maxLength={50}
              />
              {lastName.length > 0 && !lastNameValid && (
                <p className="mt-1 text-xs text-red-500">2-50 characters required</p>
              )}
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className={labelClass}>Gender</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)} className={inputClass}>
              <option value="">Select...</option>
              {genderOptions.map((g) => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </div>

          {/* Date of Birth */}
          <div>
            <label className={labelClass}>Date of Birth</label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className={inputClass}
            />
          </div>

          {/* Phone */}
          <div>
            <label className={labelClass}>Phone</label>
            <div className="grid grid-cols-[140px_1fr] gap-2">
              <select
                value={phoneCountryCode}
                onChange={(e) => setPhoneCountryCode(e.target.value)}
                className={inputClass}
              >
                <option value="">Code</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.dialCode}>
                    {c.flag} {c.dialCode}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="79 123 45 67"
                className={inputClass}
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className={labelClass}>Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others a bit about yourself..."
              rows={3}
              maxLength={250}
              className={inputClass + ' resize-none'}
            />
            <p className="mt-1 text-xs text-slate-400 text-right">{bio.length}/250</p>
          </div>

          {/* Address section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Address</h3>
            </div>
            <div className="grid grid-cols-[1fr_120px] gap-2">
              <div>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Street"
                  maxLength={200}
                  className={inputClass}
                />
              </div>
              <div>
                <input
                  type="text"
                  value={houseNumber}
                  onChange={(e) => setHouseNumber(e.target.value)}
                  placeholder="No."
                  maxLength={20}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <div>
                <input
                  type="text"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  placeholder="Postcode"
                  maxLength={20}
                  className={inputClass}
                />
              </div>
              <div>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  maxLength={100}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <select
                value={addressCountryCode}
                onChange={(e) => setAddressCountryCode(e.target.value)}
                className={inputClass}
              >
                <option value="">Select country...</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Nationality */}
          <div>
            <label className={labelClass}>Nationality</label>
            <select
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              className={inputClass}
            >
              <option value="">Select nationality...</option>
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Preferred Language */}
          <div>
            <label className={labelClass}>Preferred Language</label>
            <select
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value)}
              className={inputClass}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={step === 'saving'}
              className="flex-1 py-2.5 px-4 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="flex-1 py-2.5 px-4 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {step === 'saving' ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </>
              ) : step === 'error' ? (
                'Retry'
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
