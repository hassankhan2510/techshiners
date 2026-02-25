'use client'

import styles from './feed.module.css'
import LikeButton from './like-button'
import CommentSection from './comment-section'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { deleteProject, contributeToProject } from '@/app/(app)/profile/actions'
import { moderatorDeleteProject } from '@/lib/moderator-actions'

interface ProjectCardProps {
    project: any
    currentUserId?: string
    isModerator?: boolean
}

export default function ProjectCard({ project, currentUserId, isModerator }: ProjectCardProps) {
    const authorName = project.profiles?.full_name || 'Unknown User'
    const authorAvatar = project.profiles?.avatar_url || `https://api.dicebear.com/9.x/avataaars/svg?seed=${authorName}`
    const [menuOpen, setMenuOpen] = useState(false)
    const [deleted, setDeleted] = useState(false)
    const [contribOpen, setContribOpen] = useState(false)
    const [contribMsg, setContribMsg] = useState('')
    const [contribSent, setContribSent] = useState(false)
    const router = useRouter()

    const isOwner = currentUserId === project.user_id
    const isLoggedIn = !!currentUserId
    const canDelete = isOwner || isModerator

    const handleDelete = async () => {
        if (!confirm('Delete this post permanently?')) return
        let result
        if (isOwner) {
            result = await deleteProject(project.id)
        } else if (isModerator) {
            result = await moderatorDeleteProject(project.id)
        }
        if (result?.success) setDeleted(true)
        setMenuOpen(false)
    }

    const handleContribute = async () => {
        if (!isLoggedIn) { router.push('/auth/login'); return }
        const result = await contributeToProject(project.id, contribMsg)
        if (result.success) {
            setContribSent(true)
            setContribOpen(false)
        }
    }

    if (deleted) return null

    // Tech stack tags (from project or skills)
    const techStack = project.tech_stack || project.skills || []

    return (
        <div className={styles.projectCard}>
            {/* Header */}
            <div className={styles.cardHeader}>
                <Link href={`/u/${project.user_id}`}>
                    <div className={styles.avatar}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={authorAvatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
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
                {canDelete && (
                    <div style={{ position: 'relative' }}>
                        <button className={styles.moreBtn} onClick={() => setMenuOpen(!menuOpen)}>
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><circle cx="12" cy="12" r="2"></circle><circle cx="19" cy="12" r="2"></circle><circle cx="5" cy="12" r="2"></circle></svg>
                        </button>
                        {menuOpen && (
                            <div className={styles.dropdownMenu}>
                                <button onClick={handleDelete} className={styles.dropdownItem} style={{ color: '#ef4444' }}>
                                    {isModerator && !isOwner ? 'Mod Delete' : 'Delete Post'}
                                </button>
                                <button onClick={() => setMenuOpen(false)} className={styles.dropdownItem}>
                                    ✕ Close
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className={styles.projectImage}>
                {project.image_url ? (
                    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={project.image_url} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {project.type && project.type !== 'project' && (
                            <span className={styles.typeBadge}>{project.type}</span>
                        )}
                    </div>
                ) : (
                    <div className={styles.noImagePlaceholder}>
                        {project.type && project.type !== 'project' ? (
                            <span style={{ fontSize: '1.2rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{project.type}</span>
                        ) : (
                            project.project_url ? (
                                <a href={project.project_url} target="_blank" className={styles.externalLink}>View Project ↗</a>
                            ) : <span style={{ fontSize: '0.9rem' }}>📝 Text Post</span>
                        )}
                    </div>
                )}
            </div>

            <div className={styles.cardContent}>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <DescriptionWithSeeMore text={project.description} />

                {/* Project Links */}
                <div className={styles.projectLinks}>
                    {project.github_url && (
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer" className={styles.projectLink}>
                            GitHub
                        </a>
                    )}
                    {project.demo_url && (
                        <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className={styles.projectLink}>
                            Live Demo
                        </a>
                    )}
                    {project.project_url && !project.github_url && !project.demo_url && (
                        <a href={project.project_url} target="_blank" rel="noopener noreferrer" className={styles.projectLink}>
                            {project.project_url.replace(/^https?:\/\//, '').slice(0, 40)}{project.project_url.length > 40 ? '...' : ''}
                        </a>
                    )}
                </div>

                {/* Tags */}
                <div className={styles.tags}>
                    {techStack.map((tag: string) => (
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
                    isLoggedIn={isLoggedIn}
                />
                {!isOwner && !contribSent && (
                    <button onClick={() => {
                        if (!isLoggedIn) { router.push('/auth/login'); return }
                        setContribOpen(!contribOpen)
                    }} className={styles.actionBtn} style={{ color: contribOpen ? 'var(--accent-primary)' : undefined }}>
                        Contribute
                    </button>
                )}
                {contribSent && <span className={styles.sentBadge}>Sent</span>}
            </div>

            {/* Contribute Form */}
            {contribOpen && (
                <div className={styles.contribForm}>
                    <input type="text" value={contribMsg} onChange={(e) => setContribMsg(e.target.value)}
                        placeholder="How would you like to help?" className={styles.contribInput} />
                    <button onClick={handleContribute} className={styles.contribSubmit}>Send</button>
                </div>
            )}

            {/* Comments */}
            <div style={{ padding: '0 1rem 0.75rem' }}>
                <CommentSection projectId={project.id} currentUserId={currentUserId} isModerator={isModerator} />
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
            <button onClick={() => setIsExpanded(!isExpanded)} className={styles.seeMoreBtn}>
                {isExpanded ? 'See Less' : 'See More'}
            </button>
        </div>
    )
}
