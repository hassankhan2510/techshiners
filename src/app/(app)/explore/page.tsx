'use client'

import { useState, useEffect, useCallback } from 'react'
import shared from '@/components/ui/shared.module.css'
import { ISLAMABAD_UNIVERSITIES, CATEGORIES } from '@/lib/constants'
import { searchProjects } from './actions'
import ProjectCard from '@/components/feed/project-card'
import styles from '@/components/feed/feed.module.css' // Import feed styles for grid layout

export default function ExplorePage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedUni, setSelectedUni] = useState('')
    const [projects, setProjects] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    // Debounce Search
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            setLoading(true)
            const results = await searchProjects(searchTerm, selectedUni)
            setProjects(results)
            setLoading(false)
        }, 500)

        return () => clearTimeout(delayDebounceFn)
    }, [searchTerm, selectedUni])


    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }} className={shared.fadeIn}>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h1 className={shared.textGradient} style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                    Explore
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>Find projects that inspire you.</p>
            </div>

            <div style={{
                marginBottom: '2.5rem',
                display: 'flex',
                gap: '1rem',
                flexDirection: 'column'
            }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <input
                        type="text"
                        placeholder="Search projects, students, skills..."
                        className={shared.input}
                        style={{ paddingLeft: '3rem', fontSize: '1.1rem' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
                </div>

                {/* University Filter */}
                <div>
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
            </div>

            {/* Results Section */}
            {(searchTerm || selectedUni) && (
                <div style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontWeight: '600', color: '#fff' }}>
                        {loading ? 'Searching...' : `Results (${projects.length})`}
                    </h2>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>Loading...</div>
                    ) : (
                        <div className={styles.feedContainer}>
                            {projects.map((project: any) => (
                                <ProjectCard key={project.id} project={project} />
                            ))}
                            {projects.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>No projects found.</div>
                            )}
                        </div>
                    )}
                </div>
            )}

            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontWeight: '600', color: '#fff' }}>Categories</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                {CATEGORIES.map(cat => (
                    <div key={cat.name} className={shared.glassCard} style={{
                        padding: '2rem 1.5rem',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{cat.icon}</div>
                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{cat.name}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}
