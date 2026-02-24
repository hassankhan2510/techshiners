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

    useEffect(() => {
        getUniversityStats().then(setUniStats)
    }, [])

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
                <h1 className={shared.textGradient} style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                    Explore
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Discover people, universities & projects.</p>
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
                            padding: '0.5rem 1.2rem',
                            borderRadius: '99px',
                            border: activeTab === tab.id ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                            background: activeTab === tab.id ? 'var(--accent-glow)' : 'transparent',
                            color: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: activeTab === tab.id ? 600 : 400,
                            transition: 'all 0.2s',
                            fontFamily: 'var(--font-sans)'
                        }}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* Search */}
            {activeTab !== 'universities' && (
                <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', flexDirection: 'column' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <input
                            type="text"
                            placeholder={activeTab === 'people' ? 'Search by name...' : 'Search projects...'}
                            className={shared.input}
                            style={{ paddingLeft: '2.75rem' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
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
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading...</div>
            ) : (
                <>
                    {/* People Tab */}
                    {activeTab === 'people' && (
                        <div>
                            {people.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
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
                                                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                                                    padding: '0.75rem 1rem', cursor: 'pointer',
                                                }}>
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={avatar} alt="" style={{
                                                        width: '44px', height: '44px', borderRadius: '50%',
                                                        objectFit: 'cover', background: 'var(--input-bg)', flexShrink: 0
                                                    }} />
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                                                            {person.full_name || 'Anonymous'}
                                                        </div>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                                            {person.university || 'No university'} · {person.role}
                                                        </div>
                                                    </div>
                                                    <span style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>→</span>
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
                                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No universities found.</div>
                            ) : (
                                uniStats.map(uni => (
                                    <div
                                        key={uni.name}
                                        className={shared.glassCard}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                                            padding: '0.85rem 1rem', cursor: 'pointer',
                                        }}
                                        onClick={() => {
                                            setActiveTab('people')
                                            setSelectedUni(uni.name)
                                        }}
                                    >
                                        <div style={{
                                            width: '40px', height: '40px', borderRadius: '12px',
                                            background: 'linear-gradient(135deg, var(--accent-primary), #8b5cf6)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '1.2rem', flexShrink: 0
                                        }}>
                                            🏫
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                                                {uni.name}
                                            </div>
                                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '2px' }}>
                                                {uni.count} {uni.count === 1 ? 'member' : 'members'}
                                            </div>
                                        </div>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>→</span>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Posts Tab */}
                    {activeTab === 'posts' && (
                        <div>
                            {projects.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
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
