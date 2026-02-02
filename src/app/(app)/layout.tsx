import TopNav from '@/components/nav/top-nav'
import BottomNav from '@/components/nav/bottom-nav'
import styles from '@/components/nav/nav.module.css'

export default function AppLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className={styles.appContainer}>
            <TopNav />
            <main style={{ flex: 1, padding: '1rem' }}>
                {children}
            </main>
            <BottomNav />
        </div>
    )
}
