'use client'

import { useState, useEffect } from 'react'
import shared from '@/components/ui/shared.module.css'
import { ISLAMABAD_UNIVERSITIES } from '@/lib/constants'
import { searchProjects, searchPeople, getUniversityStats } from './actions'
import ProjectCard from '@/components/feed/project-card'
import styles from '@/components/feed/feed.module.css'
import Link from 'next/link'

type Tab = 'people' | 'universities' | 'posts'

export default function ExplorePage() {
    const [activeTab, setActiveTab] = useState<Tab>('people')
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedUni, setSelectedUni] = useState('')
    const [projects, setProjects] = useState<any[]>([])
    const [people, setPeople] = useState<any[]>([])
    const [uniStats, setUniStats] = useState<{ name: string; count: number }[]>([])
    const [loading, setLoading] = useState(false)

    // Load university stats on mount
    useEffect(() => {
        getUniversityStats().then(setUniStats)
    }, [])

    // Debounced search
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            setLoading(true)
            if (activeTab === 'posts') {
                const results = await searchProjects(searchTerm, selectedUni)
                setProjects(results)
            } else if (activeTab === 'people') {
                const results = await searchPeople(searchTerm, selectedUni)
                setPeople(results)
            }
            setLoading(false)
        }, 400)

        return () => clearTimeout(delayDebounceFn)
    }, [searchTerm, selectedUni, activeTab])

    const tabs: { id: Tab; label: string; icon: string }[] = [
        { id: 'people', label: 'People', icon: '👤' },
        { id: 'universities', label: 'Universities', icon: '🏫' },
        { id: 'posts', label: 'Posts', icon: '📋' },
    ]

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }} className={shared.fadeIn}>
            <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                <h1 className={shared.textGradient} style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                    Explore
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>Discover people, universities & projects.</p>
            </div>

            {/* Tabs */}
            <div style={{
                display: 'flex', gap: '0.5rem', marginBottom: '1.5rem',
                justifyContent: 'center', flexWrap: 'wrap'
            }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '0.6rem 1.2rem',
                            borderRadius: '20px',
                            border: activeTab === tab.id ? '1px solid #0095f6' : '1px solid rgba(255,255,255,0.1)',
                            background: activeTab === tab.id ? 'rgba(0, 149, 246, 0.15)' : 'rgba(255,255,255,0.03)',
                            color: activeTab === tab.id ? '#0095f6' : '#fff',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: activeTab === tab.id ? 600 : 400,
                        }}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* Search Bar (for People and Posts) */}
            {activeTab !== 'universities' && (
                <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', flexDirection: 'column' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <input
                            type="text"
                            placeholder={activeTab === 'people' ? 'Search by name...' : 'Search projects...'}
                            className={shared.input}
                            style={{ paddingLeft: '3rem', fontSize: '1rem' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
                    </div>

                    <select
                        className={shared.input}
                        style={{ width: '100%', cursor: 'pointer' }}
                        value={selectedUni}
                        onChange={(e) => setSelectedUni(e.target.value)}
                    >
                        <option value="">All Universities</option>
                        {ISLAMABAD_UNIVERSITIES.map(uni => (
                            <option key={uni} value={uni}>{uni}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Content */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>Loading...</div>
            ) : (
                <>
                    {/* People Tab */}
                    {activeTab === 'people' && (
                        <div>
                            {people.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                                    {searchTerm || selectedUni ? 'No people found.' : 'Start typing to search for people.'}
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {people.map(person => {
                                        const avatar = person.avatar_url || `https://api.dicebear.com/9.x/avataaars/svg?seed=${person.full_name || 'user'}`
                                        return (
                                            <Link
                                                key={person.id}
                                                href={`/u/${person.id}`}
                                                style={{ textDecoration: 'none', color: 'inherit' }}
                                            >
                                                <div className={shared.glassCard} style={{
                                                    display: 'flex', alignItems: 'center', gap: '1rem',
                                                    padding: '0.75rem 1rem', cursor: 'pointer',
                                                    transition: 'background 0.2s',
                                                }}>
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={avatar} alt="" style={{
                                                        width: '48px', height: '48px', borderRadius: '50%',
                                                        objectFit: 'cover', background: '#222'
                                                    }} />
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ fontWeight: 600, fontSize: '1rem', color: '#fff' }}>
                                                            {person.full_name || 'Anonymous'}
                                                        </div>
                                                        <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '2px' }}>
                                                            {person.university || 'No university'} · {person.role}
                                                        </div>
                                                    </div>
                                                    <span style={{ color: '#555', fontSize: '1.2rem' }}>→</span>
                                                </div>
                                            </Link>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Universities Tab */}
                    {activeTab === 'universities' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {uniStats.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>No universities found.</div>
                            ) : (
                                uniStats.map(uni => (
                                    <div
                                        key={uni.name}
                                        className={shared.glassCard}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '1rem',
                                            padding: '1rem 1.25rem', cursor: 'pointer',
                                        }}
                                        onClick={() => {
                                            setActiveTab('people')
                                            setSelectedUni(uni.name)
                                        }}
                                    >
                                        <div style={{
                                            width: '44px', height: '44px', borderRadius: '12px',
                                            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '1.3rem', flexShrink: 0
                                        }}>
                                            🏫
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>
                                                {uni.name}
                                            </div>
                                            <div style={{ color: '#888', fontSize: '0.85rem', marginTop: '2px' }}>
                                                {uni.count} {uni.count === 1 ? 'member' : 'members'}
                                            </div>
                                        </div>
                                        <span style={{ color: '#555', fontSize: '1.2rem' }}>→</span>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Posts Tab */}
                    {activeTab === 'posts' && (
                        <div>
                            {projects.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                                    {searchTerm || selectedUni ? 'No posts found.' : 'Start typing to search posts.'}
                                </div>
                            ) : (
                                <div className={styles.feedContainer}>
                                    {projects.map((project: any) => (
                                        <ProjectCard key={project.id} project={project} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
