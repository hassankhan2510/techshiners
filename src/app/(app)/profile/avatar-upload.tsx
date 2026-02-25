'use client'

import { useState, useRef } from 'react'
import { uploadAvatar } from './actions'
import styles from './profile.module.css'

export default function AvatarUpload({ avatarUrl }: { avatarUrl: string }) {
    const [uploading, setUploading] = useState(false)
    const [preview, setPreview] = useState(avatarUrl)
    const [message, setMessage] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Show preview immediately
        const reader = new FileReader()
        reader.onload = (ev) => {
            setPreview(ev.target?.result as string)
        }
        reader.readAsDataURL(file)

        // Upload
        setUploading(true)
        setMessage('')
        const formData = new FormData()
        formData.append('avatar', file)
        const result = await uploadAvatar(formData)
        setMessage(result.success || result.error || '')
        setUploading(false)
    }

    return (
        <div style={{ position: 'relative' }}>
            <div
                className={styles.avatar}
                onClick={handleClick}
                style={{ cursor: 'pointer', position: 'relative' }}
                title="Click to change profile picture"
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={preview}
                    alt="Avatar"
                    style={{
                        width: '100%', height: '100%', borderRadius: '50%',
                        objectFit: 'cover', background: 'var(--bg-secondary)',
                        opacity: uploading ? 0.5 : 1, transition: 'opacity 0.2s'
                    }}
                />

                {/* Camera overlay */}
                <div style={{
                    position: 'absolute', bottom: 0, right: 0,
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'var(--accent-primary)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    border: '2px solid var(--bg-card)',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                    </svg>
                </div>

                {uploading && (
                    <div style={{
                        position: 'absolute', inset: 0, borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: '0.7rem',
                        fontWeight: 600
                    }}>
                        ...
                    </div>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />

            {message && (
                <p style={{
                    position: 'absolute', left: '50%', transform: 'translateX(-50%)',
                    bottom: '-1.5rem', fontSize: '0.7rem', whiteSpace: 'nowrap',
                    color: message.includes('updated') ? '#22c55e' : '#ef4444'
                }}>
                    {message}
                </p>
            )}
        </div>
    )
}
