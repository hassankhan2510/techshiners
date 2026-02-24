import styles from '@/components/feed/feed.module.css'
import shared from '@/components/ui/shared.module.css'

export default function RanksPage() {
    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }} className={shared.fadeIn}>
            <h1 className={shared.textGradient} style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1.25rem', letterSpacing: '-0.03em' }}>
                Leaderboard
            </h1>

            <div className={shared.glassCard}>
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div key={i} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '1rem 1.25rem',
                        borderBottom: i === 7 ? 'none' : '1px solid var(--border-color)',
                        transition: 'background 0.2s',
                        cursor: 'pointer'
                    }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '10px',
                            background: i === 1 ? 'linear-gradient(135deg, #ffd700, #b8860b)' : i === 2 ? 'linear-gradient(135deg, #c0c0c0, #7f7f7f)' : i === 3 ? 'linear-gradient(135deg, #cd7f32, #8b4513)' : 'var(--input-bg)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '0.85rem',
                            color: i <= 3 ? '#000' : 'var(--text-muted)',
                            flexShrink: 0
                        }}>{i}</div>

                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `hsl(${i * 40}, 40%, 30%)`, border: '2px solid var(--border-color)', flexShrink: 0 }}></div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: '600', fontSize: '0.95rem', color: 'var(--text-primary)' }}>Student Name</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>University of Tech</div>
                        </div>

                        <div style={{ fontWeight: 'bold', color: i <= 3 ? 'var(--text-primary)' : 'var(--text-secondary)', fontSize: '1rem' }}>
                            {1000 - (i * 50)} <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>QP</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
