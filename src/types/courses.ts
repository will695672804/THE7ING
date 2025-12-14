// ============== INTERFACES FORMATION STYLE UDEMY ==============

// Instructeur
export interface Instructor {
    id: string;
    name: string;
    avatar: string;
    bio: string;
    totalStudents: number;
    totalCourses: number;
    averageRating: number;
}

// Ressource téléchargeable
export interface LectureResource {
    id: string;
    title: string;
    fileUrl: string;
    fileSize: number;
}

// Leçon/Vidéo
export interface Lecture {
    id: string;
    title: string;
    description: string;
    contentType: 'video' | 'article' | 'quiz';
    orderIndex: number;

    videoUrl: string | null;
    duration: number;          // en secondes
    articleContent: string | null;

    isPreview: boolean;
    isDownloadable: boolean;
    resources: LectureResource[];

    // Pour utilisateur inscrit
    isCompleted: boolean;
    videoPosition: number;     // reprendre là où on s'est arrêté
}

// Section/Chapitre
export interface Section {
    id: string;
    title: string;
    description: string;
    orderIndex: number;
    learningObjective: string;
    lecturesCount: number;
    totalDuration: number;
    lectures: Lecture[];
}

// Progression d'inscription
export interface EnrollmentProgress {
    id: string;
    enrolledAt: string;
    progressPercentage: number;
    completedLectures: number;
    totalLectures: number;
    totalTimeWatched: number;
    isCompleted: boolean;
    completedAt: string | null;

    lastLecture: {
        id: string;
        title: string;
        sectionTitle: string;
    } | null;
    lastVideoPosition: number;

    certificate: Certificate | null;
}

// Certificat
export interface Certificate {
    id: string;
    certificateNumber: string;
    issuedAt: string;
    studentName: string;
    courseTitle: string;
    instructorName: string;
    completionDate: string;
    pdfUrl: string;
}

// Formation complète
export interface Course {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    thumbnail: string;
    promoVideo: string | null;

    category: string;
    subcategory: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    language: string;

    price: number;
    discountPrice: number | null;

    instructor: Instructor;

    whatYouWillLearn: string[];
    requirements: string[];
    targetAudience: string[];

    totalDuration: number;    // en secondes
    totalLectures: number;
    totalSections: number;
    averageRating: number;
    totalReviews: number;
    totalStudents: number;

    sections: Section[];

    isEnrolled: boolean;
    progress: EnrollmentProgress | null;

    lastUpdated: string;
}

// Note personnelle
export interface Note {
    id: string;
    lectureId: string;
    lectureTitle: string;
    content: string;
    timestamp: number;        // position vidéo en secondes
    createdAt: string;
    updatedAt: string;
}

// Marque-page
export interface Bookmark {
    id: string;
    lectureId: string;
    lectureTitle: string;
    title: string;
    timestamp: number;
    createdAt: string;
}

// Question Q&A
export interface Question {
    id: string;
    lectureId: string;
    user: {
        id: string;
        name: string;
        avatar: string;
    };
    title: string;
    content: string;
    isAnswered: boolean;
    isPinned: boolean;
    upvotes: number;
    answersCount: number;
    answers: Answer[];
    createdAt: string;
}

// Réponse Q&A
export interface Answer {
    id: string;
    user: {
        id: string;
        name: string;
        avatar: string;
    };
    content: string;
    isInstructorAnswer: boolean;
    isAccepted: boolean;
    upvotes: number;
    createdAt: string;
}

// Avis
export interface CourseReview {
    id: string;
    user: {
        id: string;
        name: string;
        avatar: string;
    };
    rating: number;
    title: string;
    comment: string;
    helpfulCount: number;
    createdAt: string;
}

// ============== TYPES POUR LES RÉPONSES API ==============

export interface CoursesListResponse {
    courses: Course[];
    pagination?: {
        total: number;
        page: number;
        perPage: number;
        totalPages: number;
    };
}

export interface CourseDetailResponse {
    course: Course;
}

export interface EnrollmentResponse {
    enrollment: EnrollmentProgress;
    lectureProgresses: {
        lectureId: string;
        isCompleted: boolean;
        completedAt: string | null;
        videoPosition: number;
    }[];
}

export interface NotesResponse {
    notes: Note[];
}

export interface BookmarksResponse {
    bookmarks: Bookmark[];
}

export interface QuestionsResponse {
    questions: Question[];
}

export interface ReviewsResponse {
    reviews: CourseReview[];
    averageRating: number;
    totalReviews: number;
    ratingDistribution: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
    };
}

// ============== HELPERS ==============

/**
 * Formate une durée en secondes en format lisible (ex: "2h 30min")
 */
export function formatDuration(seconds: number): string {
    if (!seconds || seconds <= 0) return '0 min';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
        return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
    }
    return `${minutes} min`;
}

/**
 * Formate un timestamp vidéo en format MM:SS ou HH:MM:SS
 */
export function formatTimestamp(seconds: number): string {
    if (!seconds || seconds <= 0) return '0:00';

    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
        return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Retourne le label de niveau en français
 */
export function getLevelLabel(level: Course['level']): string {
    const labels = {
        beginner: 'Débutant',
        intermediate: 'Intermédiaire',
        advanced: 'Avancé',
    };
    return labels[level] || level;
}

/**
 * Calcule le nombre total de leçons dans toutes les sections
 */
export function getTotalLectures(sections: Section[]): number {
    return sections.reduce((total, section) => total + section.lectures.length, 0);
}

/**
 * Calcule la durée totale de toutes les leçons
 */
export function getTotalDuration(sections: Section[]): number {
    return sections.reduce((total, section) => {
        return total + section.lectures.reduce((sectionTotal, lecture) => {
            return sectionTotal + (lecture.duration || 0);
        }, 0);
    }, 0);
}
