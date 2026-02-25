import { createClient } from '@/utils/supabase/server'
import shared from '@/components/ui/shared.module.css'
import Link from 'next/link'

type Tab = 'students' | 'universities'

async function getStudentRanks() {
    const supabase = await createClient()

    // Get all profiles with their project counts and total likes
    const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, university, avatar_url, role')

    if (!profiles) return []

    // Get all projects with like counts
    const { data: projects } = await supabase
        .from('projects')
        .select('user_id, likes(count)')

    const likeMap: Record<string, { projectCount: number; totalLikes: number }> = {}

    for (const proj of projects || []) {
        if (!likeMap[proj.user_id]) {
            likeMap[proj.user_id] = { projectCount: 0, totalLikes: 0 }
        }
        likeMap[proj.user_id].projectCount++
        likeMap[proj.user_id].totalLikes += proj.likes?.[0]?.count || 0
    }

    // Combine
    const ranked = profiles
        .map(p => ({
            ...p,
            projectCount: likeMap[p.id]?.projectCount || 0,
            totalLikes: likeMap[p.id]?.totalLikes || 0,
            score: (likeMap[p.id]?.totalLikes || 0) * 3 + (likeMap[p.id]?.projectCount || 0) * 5
        }))
        .filter(p => p.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 20)

    return ranked
}

async function getUniversityRanks() {
    const supabase = await createClient()

    const { data: profiles } = await supabase
        .from('profiles')
        .select('id, university')

    const { data: projects } = await supabase
        .from('projects')
        .select('user_id, likes(count)')

    if (!profiles || !projects) return []

    // Build per-user stats
    const userStats: Record<string, { projectCount: number; totalLikes: number }> = {}
    for (const proj of projects) {
        if (!userStats[proj.user_id]) {
            userStats[proj.user_id] = { projectCount: 0, totalLikes: 0 }
        }
        userStats[proj.user_id].projectCount++
        userStats[proj.user_id].totalLikes += proj.likes?.[0]?.count || 0
    }

    // Aggregate by university
    const uniMap: Record<string, { members: number; projects: number; likes: number }> = {}
    for (const p of profiles) {
        const uni = p.university || 'Other'
        if (!uniMap[uni]) uniMap[uni] = { members: 0, projects: 0, likes: 0 }
        uniMap[uni].members++
        uniMap[uni].projects += userStats[p.id]?.projectCount || 0
        uniMap[uni].likes += userStats[p.id]?.totalLikes || 0
    }

    return Object.entries(uniMap)
        .map(([name, s]) => ({ name, ...s, score: s.likes * 3 + s.projects * 5 + s.members }))
        .filter(u => u.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 20)
}

export default async function RanksPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
    const params = await searchParams
    const activeTab: Tab = (params?.tab as Tab) || 'students'
    const students = activeTab === 'students' ? await getStudentRanks() : []
    const universities = activeTab === 'universities' ? await getUniversityRanks() : []

    const tabs = [
        { id: 'students' as Tab, label: 'Students', icon: '' },
        { id: 'universities' as Tab, label: 'Universities', icon: '' },
    ]

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }} className={shared.fadeIn}>
            <h1 className={shared.textGradient} style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>
                Leaderboard
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                Rankings based on projects, likes, and activity.
            </p>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                {tabs.map(tab => (
                    <a key={tab.id} href={`/ranks?tab=${tab.id}`} style={{
                        padding: '0.5rem 1.2rem', borderRadius: '99px', textDecoration: 'none',
                        border: `1px solid ${activeTab === tab.id ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                        background: activeTab === tab.id ? 'var(--accent-glow)' : 'transparent',
                        color: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                        fontSize: '0.85rem', fontWeight: activeTab === tab.id ? 600 : 400, transition: 'all 0.2s'
                    }}>
                        {tab.label}
                    </a>
                ))}
            </div>

            {/* Student Rankings */}
            {activeTab === 'students' && (
                <div className={shared.glassCard}>
                    {students.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                            No students ranked yet. Be the first to post!
                        </div>
                    ) : (
                        students.map((s, i) => {
                            const avatar = s.avatar_url || `https://api.dicebear.com/9.x/avataaars/svg?seed=${s.full_name || 'user'}`
                            return (
                                <Link key={s.id} href={`/u/${s.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                                        padding: '0.85rem 1rem',
                                        borderBottom: i === students.length - 1 ? 'none' : '1px solid var(--border-color)',
                                        transition: 'background 0.2s', cursor: 'pointer',
                                    }}>
                                        <div style={{
                                            width: '32px', height: '32px', borderRadius: '10px',
                                            background: i === 0 ? 'linear-gradient(135deg, #ffd700, #b8860b)' : i === 1 ? 'linear-gradient(135deg, #c0c0c0, #7f7f7f)' : i === 2 ? 'linear-gradient(135deg, #cd7f32, #8b4513)' : 'var(--input-bg)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontWeight: 'bold', fontSize: '0.85rem',
                                            color: i <= 2 ? '#000' : 'var(--text-muted)', flexShrink: 0
                                        }}>{i + 1}</div>

                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={avatar} alt="" style={{
                                            width: '40px', height: '40px', borderRadius: '50%',
                                            objectFit: 'cover', border: '2px solid var(--border-color)', flexShrink: 0
                                        }} />

                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                                                {s.full_name || 'Anonymous'}
                                            </div>
                                            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                                                {s.university || 'No University'} · {s.projectCount} posts · {s.totalLikes} likes
                                            </div>
                                        </div>

                                        <div style={{
                                            fontWeight: 'bold', color: i <= 2 ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                            fontSize: '1rem', flexShrink: 0
                                        }}>
                                            {s.score} <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>QP</span>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })
                    )}
                </div>
            )}

            {/* University Rankings */}
            {activeTab === 'universities' && (
                <div className={shared.glassCard}>
                    {universities.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                            No universities ranked yet.
                        </div>
                    ) : (
                        universities.map((u, i) => (
                            <div key={u.name} style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                padding: '0.85rem 1rem',
                                borderBottom: i === universities.length - 1 ? 'none' : '1px solid var(--border-color)',
                            }}>
                                <div style={{
                                    width: '32px', height: '32px', borderRadius: '10px',
                                    background: i === 0 ? 'linear-gradient(135deg, #ffd700, #b8860b)' : i === 1 ? 'linear-gradient(135deg, #c0c0c0, #7f7f7f)' : i === 2 ? 'linear-gradient(135deg, #cd7f32, #8b4513)' : 'var(--input-bg)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 'bold', fontSize: '0.85rem',
                                    color: i <= 2 ? '#000' : 'var(--text-muted)', flexShrink: 0
                                }}>{i + 1}</div>

                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '12px',
                                    background: 'linear-gradient(135deg, var(--accent-primary), #8b5cf6)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1.1rem', flexShrink: 0
                                }}>🏫</div>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                                        {u.name}
                                    </div>
                                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                                        {u.members} members · {u.projects} projects · {u.likes} likes
                                    </div>
                                </div>

                                <div style={{
                                    fontWeight: 'bold', color: i <= 2 ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                    fontSize: '1rem', flexShrink: 0
                                }}>
                                    {u.score} <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>QP</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}
