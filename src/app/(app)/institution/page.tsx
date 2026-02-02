export default function InstitutionPage() {
    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{
                height: '150px',
                background: 'linear-gradient(45deg, #111, #333)',
                borderRadius: '16px',
                marginBottom: '-40px'
            }}></div>

            <div style={{ padding: '0 1rem' }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    background: '#fff',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '900',
                    color: '#000',
                    fontSize: '2rem'
                }}>U</div>

                <h1 style={{ marginTop: '1rem', fontSize: '2rem', fontWeight: '800' }}>University of Future</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Islamabad, Pakistan</p>

                <div style={{ marginTop: '2rem', display: 'flex', gap: '2rem' }}>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>1,204</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Students</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>580</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Projects</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Top 1%</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Rank</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
