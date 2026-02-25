'use client'

import { useState, useEffect } from 'react'
import { addComment, deleteComment, getComments } from './comment-actions'
import { moderatorDeleteComment } from '@/lib/moderator-actions'
import Link from 'next/link'

interface Comment {
    id: string
    content: string
    created_at: string
    user_id: string
    profiles: {
        full_name: string
        avatar_url: string | null
    }
}

export default function CommentSection({ projectId, currentUserId, isModerator }: { projectId: string, currentUserId?: string, isModerator?: boolean }) {
    const [comments, setComments] = useState<Comment[]>([])
    const [newComment, setNewComment] = useState('')
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if (isOpen) loadComments()
    }, [isOpen])

    const loadComments = async () => {
        const data = await getComments(projectId)
        setComments(data)
    }

    const handleSubmit = async () => {
        if (!newComment.trim() || loading) return
        setLoading(true)
        const result = await addComment(projectId, newComment)
        if (result.success) {
            setNewComment('')
            await loadComments()
        }
        setLoading(false)
    }

    const handleDelete = async (commentId: string, isOwn: boolean) => {
        if (isOwn) {
            const result = await deleteComment(commentId)
            if (result.success) setComments(prev => prev.filter(c => c.id !== commentId))
        } else if (isModerator) {
            const result = await moderatorDeleteComment(commentId)
            if (result.success) setComments(prev => prev.filter(c => c.id !== commentId))
        }
    }

    const timeAgo = (date: string) => {
        const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
        if (seconds < 60) return 'just now'
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
        return `${Math.floor(seconds / 86400)}d`
    }

    if (!isOpen) {
        return (
            <button onClick={() => setIsOpen(true)} style={{
                background: 'none', border: 'none', color: 'var(--text-muted)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.5rem 0', fontSize: '0.85rem', transition: 'color 0.2s'
            }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                View Comments
            </button>
        )
    }

    return (
        <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '0.5rem', paddingTop: '0.75rem' }}>
            <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '0.75rem' }}>
                {comments.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '1rem 0' }}>
                        No comments yet. Be the first!
                    </p>
                ) : (
                    comments.map(comment => {
                        const avatar = comment.profiles?.avatar_url || `https://api.dicebear.com/9.x/avataaars/svg?seed=${comment.profiles?.full_name || 'user'}`
                        const isOwn = currentUserId === comment.user_id
                        const canDel = isOwn || isModerator
                        return (
                            <div key={comment.id} style={{
                                display: 'flex', gap: '0.6rem', marginBottom: '0.75rem', padding: '0.5rem', borderRadius: '8px',
                            }}>
                                <Link href={`/u/${comment.user_id}`}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={avatar} alt="" style={{
                                        width: '28px', height: '28px', borderRadius: '50%',
                                        objectFit: 'cover', background: 'var(--input-bg)', flexShrink: 0
                                    }} />
                                </Link>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Link href={`/u/${comment.user_id}`} style={{
                                            fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)', textDecoration: 'none'
                                        }}>
                                            {comment.profiles?.full_name || 'User'}
                                        </Link>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                            {timeAgo(comment.created_at)}
                                        </span>
                                        {canDel && (
                                            <button onClick={() => handleDelete(comment.id, isOwn)} style={{
                                                background: 'none', border: 'none', color: isOwn ? 'var(--text-muted)' : '#ef4444',
                                                cursor: 'pointer', fontSize: '0.75rem', marginLeft: 'auto',
                                                borderRadius: '4px', padding: '2px 6px', transition: 'color 0.2s'
                                            }}>
                                                {isOwn ? '✕' : '🛡️'}
                                            </button>
                                        )}
                                    </div>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.2rem 0 0', wordBreak: 'break-word', lineHeight: 1.4 }}>
                                        {comment.content}
                                    </p>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            {currentUserId ? (
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                        placeholder="Add a comment..." style={{
                            flex: 1, background: 'var(--input-bg)', border: '1px solid var(--border-color)',
                            borderRadius: '99px', padding: '0.5rem 1rem', color: 'var(--text-primary)',
                            fontSize: '0.85rem', outline: 'none', fontFamily: 'var(--font-sans)'
                        }} />
                    <button onClick={handleSubmit} disabled={loading || !newComment.trim()} style={{
                        background: 'var(--accent-primary)', color: '#fff', border: 'none',
                        borderRadius: '99px', padding: '0.5rem 1rem', cursor: 'pointer',
                        fontSize: '0.85rem', fontWeight: 600,
                        opacity: loading || !newComment.trim() ? 0.5 : 1, transition: 'opacity 0.2s'
                    }}>
                        {loading ? '...' : 'Post'}
                    </button>
                </div>
            ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center' }}>
                    <Link href="/auth/login" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Log in</Link> to comment
                </p>
            )}

            <button onClick={() => setIsOpen(false)} style={{
                background: 'none', border: 'none', color: 'var(--text-muted)',
                cursor: 'pointer', fontSize: '0.75rem', marginTop: '0.5rem', width: '100%', textAlign: 'center'
            }}>
                Hide Comments
            </button>
        </div>
    )
}
