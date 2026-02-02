'use client'

import { useState, useTransition } from 'react'
import { toggleLike } from './actions'
import styles from './feed.module.css'

interface LikeButtonProps {
    projectId: string
    initialLikes: number
    initialHasLiked: boolean
}

export default function LikeButton({ projectId, initialLikes, initialHasLiked }: LikeButtonProps) {
    const [likes, setLikes] = useState(initialLikes)
    const [hasLiked, setHasLiked] = useState(initialHasLiked)
    const [isPending, startTransition] = useTransition()

    const handleToggle = async () => {
        // Optimistic Update
        const newHasLiked = !hasLiked
        setHasLiked(newHasLiked)
        setLikes(prev => newHasLiked ? prev + 1 : prev - 1)

        startTransition(async () => {
            const result = await toggleLike(projectId)
            if (result?.error) {
                // Revert if error
                setHasLiked(!newHasLiked)
                setLikes(prev => !newHasLiked ? prev + 1 : prev - 1)
                alert('Error: ' + result.error)
            }
        })
    }

    return (
        <button
            className={styles.actionBtn}
            onClick={handleToggle}
            disabled={isPending}
            style={{ color: hasLiked ? '#ef4444' : 'inherit' }}
        >
            <svg
                className={styles.actionIcon}
                viewBox="0 0 24 24"
                fill={hasLiked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            {likes}
        </button>
    )
}
