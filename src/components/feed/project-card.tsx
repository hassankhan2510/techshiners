'use client'

import styles from './feed.module.css'
import LikeButton from './like-button'
import CommentSection from './comment-section'
import { useState } from 'react'
import Link from 'next/link'
import { deleteProject, contributeToProject } from '@/app/(app)/profile/actions'

interface ProjectCardProps {
    project: any
    currentUserId?: string
}

export default function ProjectCard({ project, currentUserId }: ProjectCardProps) {
    const authorName = project.profiles?.full_name || 'Unknown User'
    const authorAvatar = project.profiles?.avatar_url || `https://api.dicebear.com/9.x/avataaars/svg?seed=${authorName}`
    const [menuOpen, setMenuOpen] = useState(false)
    const [deleted, setDeleted] = useState(false)
    const [contribOpen, setContribOpen] = useState(false)
    const [contribMsg, setContribMsg] = useState('')
    const [contribSent, setContribSent] = useState(false)

    const isOwner = currentUserId === project.user_id

    const handleDelete = async () => {
        if (!confirm('Delete this post permanently?')) return
        const result = await deleteProject(project.id)
        if (result.success) setDeleted(true)
        else alert(result.error || 'Could not delete')
        setMenuOpen(false)
    }

    const handleContribute = async () => {
        const result = await contributeToProject(project.id, contribMsg)
        if (result.success) {
            setContribSent(true)
            setContribOpen(false)
        } else {
            alert(result.error)
        }
    }

    if (deleted) return null

    return (
        <div className={styles.projectCard}>
            {/* Header */}
            <div className={styles.cardHeader}>
                <Link href={`/u/${project.user_id}`}>
                    <div className={styles.avatar}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={authorAvatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', background: '#222' }} />
                    </div>
                </Link>
                <div className={styles.userInfo}>
                    <Link href={`/u/${project.user_id}`} className={styles.userName} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {authorName}
                        {project.verification_status === 'verified' && (
                            <svg className={styles.verifiedBadge} viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                            </svg>
                        )}
                    </Link>
                    <div className={styles.userUni}>{project.profiles?.university || 'No University'}</div>
                </div>

                {/* More Menu */}
                <div style={{ position: 'relative' }}>
                    <button className={styles.moreBtn} onClick={() => setMenuOpen(!menuOpen)}>
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><circle cx="12" cy="12" r="2"></circle><circle cx="19" cy="12" r="2"></circle><circle cx="5" cy="12" r="2"></circle></svg>
                    </button>
                    {menuOpen && (
                        <div style={{
                            position: 'absolute', right: 0, top: '100%', zIndex: 10,
                            background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px', overflow: 'hidden', minWidth: '150px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                        }}>
                            {isOwner && (
                                <button onClick={handleDelete} style={{
                                    display: 'block', width: '100%', padding: '0.75rem 1rem',
                                    background: 'none', border: 'none', color: '#ff4444',
                                    cursor: 'pointer', textAlign: 'left', fontSize: '0.9rem'
                                }}>
                                    🗑️ Delete Post
                                </button>
                            )}
                            <button onClick={() => { setMenuOpen(false) }} style={{
                                display: 'block', width: '100%', padding: '0.75rem 1rem',
                                background: 'none', border: 'none', color: '#ccc',
                                cursor: 'pointer', textAlign: 'left', fontSize: '0.9rem'
                            }}>
                                ✕ Close
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className={styles.projectImage}>
                {project.image_url ? (
                    <div style={{ width: '100%', height: '100%', background: '#000', position: 'relative' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={project.image_url}
                            alt={project.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        {project.type && project.type !== 'project' && (
                            <span style={{
                                position: 'absolute', top: '10px', right: '10px',
                                background: 'rgba(0,0,0,0.7)', color: '#fff',
                                padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 'bold'
                            }}>
                                {project.type}
                            </span>
                        )}
                    </div>
                ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', background: '#111' }}>
                        {project.type && project.type !== 'project' ? (
                            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#444' }}>{project.type.toUpperCase()}</span>
                        ) : (
                            project.project_url ? (
                                <a href={project.project_url} target="_blank" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>View External Project ↗</a>
                            ) : 'Text Post'
                        )}
                    </div>
                )}
            </div>

            <div className={styles.cardContent}>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <DescriptionWithSeeMore text={project.description} />
                {project.project_url && (
                    <a
                        href={project.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                            color: '#0095f6', textDecoration: 'none', fontSize: '0.85rem',
                            marginTop: '0.5rem', marginBottom: '0.5rem'
                        }}
                    >
                        🔗 {project.project_url.replace(/^https?:\/\//, '').slice(0, 40)}{project.project_url.length > 40 ? '...' : ''}
                    </a>
                )}
                <div className={styles.tags}>
                    {project.skills && project.skills.map((tag: string) => (
                        <span key={tag} className={styles.tag}>#{tag}</span>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className={styles.cardActions}>
                <LikeButton
                    projectId={project.id}
                    initialLikes={project.likes?.[0]?.count || 0}
                    initialHasLiked={!!project.is_liked}
                />
                {/* Contribute Button */}
                {currentUserId && !isOwner && !contribSent && (
                    <button
                        onClick={() => setContribOpen(!contribOpen)}
                        className={styles.actionBtn}
                        style={{ color: contribOpen ? '#0095f6' : undefined }}
                    >
                        🤝 Contribute
                    </button>
                )}
                {contribSent && (
                    <span style={{ color: '#0095f6', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        ✅ Request Sent
                    </span>
                )}
            </div>

            {/* Contribute Form */}
            {contribOpen && (
                <div style={{
                    padding: '0.75rem 1rem',
                    borderTop: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="text"
                            value={contribMsg}
                            onChange={(e) => setContribMsg(e.target.value)}
                            placeholder="How would you like to help?"
                            style={{
                                flex: 1, background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '20px', padding: '0.5rem 1rem',
                                color: '#fff', fontSize: '0.85rem', outline: 'none'
                            }}
                        />
                        <button
                            onClick={handleContribute}
                            style={{
                                background: '#0095f6', color: '#fff', border: 'none',
                                borderRadius: '20px', padding: '0.5rem 1rem',
                                cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                            }}
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}

            {/* Comments */}
            <div style={{ padding: '0 1rem 0.75rem' }}>
                <CommentSection projectId={project.id} currentUserId={currentUserId} />
            </div>
        </div>
    )
}

function DescriptionWithSeeMore({ text }: { text: string }) {
    const [isExpanded, setIsExpanded] = useState(false)
    const maxLength = 150

    if (!text) return null
    if (text.length <= maxLength) return <p className={styles.projectDesc}>{text}</p>

    return (
        <div className={styles.projectDesc}>
            {isExpanded ? text : `${text.slice(0, maxLength)}...`}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                    background: 'none', border: 'none', color: '#888',
                    cursor: 'pointer', marginLeft: '0.5rem', fontSize: '0.9rem',
                    fontWeight: 'bold'
                }}
            >
                {isExpanded ? 'See Less' : 'See More'}
            </button>
        </div>
    )
}
