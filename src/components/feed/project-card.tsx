'use client'

import styles from './feed.module.css'
import LikeButton from './like-button'
import { useState } from 'react'

interface ProjectCardProps {
    project: any // Type this better in production
}

export default function ProjectCard({ project }: ProjectCardProps) {
    const authorName = project.profiles?.full_name || 'Unknown User'
    const authorAvatar = project.profiles?.avatar_url || `https://api.dicebear.com/9.x/avataaars/svg?seed=${authorName}`

    return (
        <div className={styles.projectCard}>
            {/* Header */}
            <div className={styles.cardHeader}>
                <div className={styles.avatar}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={authorAvatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', background: '#222' }} />
                </div>
                <div className={styles.userInfo}>
                    <div className={styles.userName}>
                        {authorName}
                        {project.verification_status === 'verified' && (
                            <svg className={styles.verifiedBadge} viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                            </svg>
                        )}
                    </div>
                    <div className={styles.userUni}>{project.profiles?.university || 'No University'}</div>
                </div>
                <button className={styles.moreBtn}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><circle cx="12" cy="12" r="2"></circle><circle cx="19" cy="12" r="2"></circle><circle cx="5" cy="12" r="2"></circle></svg>
                </button>
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
                        {/* Type Badge */}
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
                    /* Placeholder for actual image */
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
                <button className={styles.actionBtn}>
                    <svg className={styles.actionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                    0
                </button>
                <button className={styles.actionBtn}>
                    <svg className={styles.actionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
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
