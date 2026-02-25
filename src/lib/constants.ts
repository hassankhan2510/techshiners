export const ISLAMABAD_UNIVERSITIES = [
    "National University of Sciences and Technology (NUST)",
    "COMSATS University Islamabad",
    "FAST National University (NUCES)",
    "Air University",
    "Bahria University",
    "International Islamic University (IIUI)",
    "Quaid-i-Azam University (QAU)",
    "SZABIST Islamabad",
    "Iqra University Islamabad",
    "Hamdard University Islamabad",
    "Riphah International University",
    "Foundation University Islamabad",
    "National Defence University (NDU)",
    "PIEAS (Pakistan Institute of Engineering and Applied Sciences)",
    "IST (Institute of Space Technology)",
    "National University of Technology (NUTECH)",
    "Other"
] as const

export const CATEGORIES = ['project', 'startup', 'event'] as const

export const SKILL_OPTIONS = [
    // Languages
    "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Rust", "PHP", "Ruby", "Swift", "Kotlin", "Dart",
    // Frontend
    "React", "Next.js", "Vue.js", "Angular", "Svelte", "HTML/CSS", "Tailwind CSS",
    // Backend
    "Node.js", "Express", "Django", "Flask", "FastAPI", "Spring Boot", ".NET",
    // Mobile
    "React Native", "Flutter", "Android", "iOS",
    // Data / AI
    "Machine Learning", "Deep Learning", "NLP", "Computer Vision", "Data Science", "TensorFlow", "PyTorch",
    // Cloud / DevOps
    "AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD",
    // Databases
    "PostgreSQL", "MongoDB", "MySQL", "Redis", "Firebase", "Supabase",
    // Other
    "Blockchain", "IoT", "Cybersecurity", "UI/UX Design", "Figma", "Git", "Linux",
    // Soft Skills
    "Project Management", "Team Leadership", "Public Speaking", "Technical Writing"
] as const

export const MODERATOR_EMAIL = 'alhassankhann2004@gmail.com'

export type Badge = {
    id: string
    label: string
    icon: string
    description: string
}

export const BADGES: Badge[] = [
    { id: 'pioneer', label: 'Pioneer', icon: '🏅', description: 'Created first post' },
    { id: 'popular', label: 'Popular', icon: '❤️', description: 'A post with 10+ likes' },
    { id: 'collaborator', label: 'Collaborator', icon: '🤝', description: 'Sent a contribution' },
    { id: 'complete', label: 'Complete Profile', icon: '✅', description: 'Filled out full profile' },
    { id: 'prolific', label: 'Prolific', icon: '🔥', description: '5+ posts published' },
]

export function computeBadges(profile: {
    full_name?: string | null
    university?: string | null
    skills?: string[] | null
    bio?: string | null
}, stats: {
    projectCount: number
    maxLikes: number
    contributionCount: number
}): Badge[] {
    const earned: Badge[] = []

    // Pioneer: has at least 1 post
    if (stats.projectCount >= 1) {
        earned.push(BADGES.find(b => b.id === 'pioneer')!)
    }

    // Popular: any post with 10+ likes
    if (stats.maxLikes >= 10) {
        earned.push(BADGES.find(b => b.id === 'popular')!)
    }

    // Collaborator: sent a contribution
    if (stats.contributionCount >= 1) {
        earned.push(BADGES.find(b => b.id === 'collaborator')!)
    }

    // Complete Profile: has name, university, skills, bio
    if (profile.full_name && profile.university && profile.skills && profile.skills.length > 0 && profile.bio) {
        earned.push(BADGES.find(b => b.id === 'complete')!)
    }

    // Prolific: 5+ posts
    if (stats.projectCount >= 5) {
        earned.push(BADGES.find(b => b.id === 'prolific')!)
    }

    return earned
}
