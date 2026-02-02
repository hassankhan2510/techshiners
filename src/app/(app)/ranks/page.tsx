import styles from '@/components/feed/feed.module.css'
import shared from '@/components/ui/shared.module.css'

export default function RanksPage() {
    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }} className={shared.fadeIn}>
            <h1 className={shared.textGradient} style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
                Leaderboard
            </h1>

            <div className={shared.glassCard}>
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div key={i} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1.25rem',
                        borderBottom: i === 7 ? 'none' : '1px solid rgba(255,255,255,0.05)',
                        transition: 'background 0.2s',
                        cursor: 'pointer'
                    }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '12px',
                            background: i === 1 ? 'linear-gradient(135deg, #ffd700, #b8860b)' : i === 2 ? 'linear-gradient(135deg, #c0c0c0, #7f7f7f)' : i === 3 ? 'linear-gradient(135deg, #cd7f32, #8b4513)' : 'rgba(255,255,255,0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            color: i <= 3 ? '#000' : '#888',
                            boxShadow: i <= 3 ? '0 4px 10px rgba(0,0,0,0.3)' : 'none'
                        }}>{i}</div>

                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: `hsl(${i * 40}, 50%, 30%)`, border: '2px solid rgba(255,255,255,0.1)' }}></div>

                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>Student Name</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>University of Tech</div>
                        </div>

                        <div style={{ fontWeight: 'bold', color: i <= 3 ? '#fff' : 'var(--text-secondary)', fontSize: '1.1rem' }}>
                            {1000 - (i * 50)} <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>QP</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
