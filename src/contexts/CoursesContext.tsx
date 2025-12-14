import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import {
  Course,
  Section,
  Lecture,
  EnrollmentProgress,
  Note,
  Bookmark,
  formatDuration,
} from '../types/courses';

// Backend base URL for media files (Cloudinary URLs are already full)
const BACKEND_URL = 'https://site--the7e1--vm5pf569dg4m.code.run';

// Helper to build full media URL
const getFullMediaUrl = (mediaPath: string): string => {
  if (!mediaPath) return '';
  // If already a full URL (Cloudinary or other), return as-is
  if (mediaPath.startsWith('http://') || mediaPath.startsWith('https://')) {
    return mediaPath;
  }
  // Otherwise, prepend backend URL
  return `${BACKEND_URL}${mediaPath.startsWith('/') ? '' : '/'}${mediaPath}`;
};

// ============== MAPPERS ==============

const mapLecture = (l: any): Lecture => ({
  id: l.id?.toString() ?? '',
  title: l.title ?? '',
  description: l.description ?? '',
  contentType: l.content_type ?? 'video',
  orderIndex: Number(l.order_index) || 0,
  videoUrl: l.video_url ? getFullMediaUrl(l.video_url) : null,
  duration: Number(l.duration) || 0,
  articleContent: l.article_content ?? null,
  isPreview: l.is_preview === true || l.is_preview === 1,
  isDownloadable: l.is_downloadable === true || l.is_downloadable === 1,
  resources: (l.resources || []).map((r: any) => ({
    id: r.id?.toString() ?? '',
    title: r.title ?? '',
    fileUrl: getFullMediaUrl(r.file_url ?? r.file ?? ''),
    fileSize: Number(r.file_size) || 0,
  })),
  isCompleted: l.is_completed === true || l.is_completed === 1,
  videoPosition: Number(l.video_position) || 0,
});

const mapSection = (s: any): Section => ({
  id: s.id?.toString() ?? '',
  title: s.title ?? '',
  description: s.description ?? '',
  orderIndex: Number(s.order_index) || 0,
  learningObjective: s.learning_objective ?? '',
  lecturesCount: Number(s.lectures_count) || (s.lectures?.length ?? 0),
  totalDuration: Number(s.total_duration) || 0,
  lectures: (s.lectures || []).map(mapLecture),
});

const mapCourse = (c: any): Course => ({
  id: c.id?.toString() ?? '',
  title: c.title ?? '',
  subtitle: c.subtitle ?? '',
  description: c.description ?? '',
  thumbnail: getFullMediaUrl(c.thumbnail ?? c.image ?? ''),
  promoVideo: c.promo_video ? getFullMediaUrl(c.promo_video) : null,

  category: c.category ?? '',
  subcategory: c.subcategory ?? '',
  level: c.level ?? 'beginner',
  language: c.language ?? 'Français',

  price: Number(c.price) || 0,
  discountPrice: c.discount_price ? Number(c.discount_price) : null,

  instructor: {
    id: c.instructor?.id?.toString() ?? '',
    name: c.instructor?.name ?? c.instructor ?? '',
    avatar: getFullMediaUrl(c.instructor?.avatar ?? ''),
    bio: c.instructor?.bio ?? '',
    totalStudents: Number(c.instructor?.total_students) || 0,
    totalCourses: Number(c.instructor?.total_courses) || 0,
    averageRating: Number(c.instructor?.average_rating) || 0,
  },

  whatYouWillLearn: c.what_you_will_learn ?? [],
  requirements: c.requirements ?? [],
  targetAudience: c.target_audience ?? [],

  totalDuration: Number(c.total_duration) || 0,
  totalLectures: Number(c.total_lectures) || 0,
  totalSections: Number(c.total_sections) || (c.sections?.length ?? 0),
  averageRating: Number(c.average_rating ?? c.rating) || 0,
  totalReviews: Number(c.total_reviews) || 0,
  totalStudents: Number(c.total_students ?? c.students_count) || 0,

  sections: (c.sections || []).map(mapSection),

  isEnrolled: c.is_enrolled === true || c.is_enrolled === 1,
  progress: c.progress ? mapEnrollmentProgress(c.progress) : null,

  lastUpdated: c.last_updated ?? c.updated_at ?? '',
});

const mapEnrollmentProgress = (p: any): EnrollmentProgress => ({
  id: p.id?.toString() ?? '',
  enrolledAt: p.enrolled_at ?? '',
  progressPercentage: Number(p.progress_percentage ?? p.progress) || 0,
  completedLectures: Number(p.completed_lectures) || 0,
  totalLectures: Number(p.total_lectures) || 0,
  totalTimeWatched: Number(p.total_time_watched) || 0,
  isCompleted: p.is_completed === true || p.is_completed === 1,
  completedAt: p.completed_at ?? null,
  lastLecture: p.last_lecture ? {
    id: p.last_lecture.id?.toString() ?? '',
    title: p.last_lecture.title ?? '',
    sectionTitle: p.last_lecture.section_title ?? '',
  } : null,
  lastVideoPosition: Number(p.last_video_position) || 0,
  certificate: p.certificate ? {
    id: p.certificate.id?.toString() ?? '',
    certificateNumber: p.certificate.certificate_number ?? '',
    issuedAt: p.certificate.issued_at ?? '',
    studentName: p.certificate.student_name ?? '',
    courseTitle: p.certificate.course_title ?? '',
    instructorName: p.certificate.instructor_name ?? '',
    completionDate: p.certificate.completion_date ?? '',
    pdfUrl: getFullMediaUrl(p.certificate.pdf_url ?? p.certificate.pdf_file ?? ''),
  } : null,
});

const mapNote = (n: any): Note => ({
  id: n.id?.toString() ?? '',
  lectureId: n.lecture_id?.toString() ?? n.lecture?.toString() ?? '',
  lectureTitle: n.lecture_title ?? '',
  content: n.content ?? '',
  timestamp: Number(n.timestamp) || 0,
  createdAt: n.created_at ?? '',
  updatedAt: n.updated_at ?? '',
});

const mapBookmark = (b: any): Bookmark => ({
  id: b.id?.toString() ?? '',
  lectureId: b.lecture_id?.toString() ?? b.lecture?.toString() ?? '',
  lectureTitle: b.lecture_title ?? '',
  title: b.title ?? '',
  timestamp: Number(b.timestamp) || 0,
  createdAt: b.created_at ?? '',
});

// ============== CONTEXT ==============

interface CoursesContextType {
  // État
  courses: Course[];
  currentCourse: Course | null;
  currentLecture: Lecture | null;
  enrollment: EnrollmentProgress | null;
  notes: Note[];
  bookmarks: Bookmark[];
  loading: boolean;
  error: string | null;

  // Actions - Formations
  fetchCourses: (params?: { category?: string; level?: string; search?: string }) => Promise<void>;
  fetchCourse: (id: string) => Promise<Course | undefined>;

  // Actions - Admin
  createCourse: (courseData: FormData) => Promise<void>;
  updateCourse: (id: string, courseData: FormData) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  createSection: (courseId: string, data: { title: string; description?: string }) => Promise<void>;
  updateSection: (sectionId: string, data: { title?: string; description?: string }) => Promise<void>;
  deleteSection: (sectionId: string) => Promise<void>;
  createLecture: (sectionId: string, lectureData: FormData) => Promise<void>;
  updateLecture: (lectureId: string, lectureData: FormData) => Promise<void>;
  deleteLecture: (lectureId: string) => Promise<void>;

  // Actions - Progression
  enrollInCourse: (courseId: string) => Promise<void>;
  completeLecture: (lectureId: string) => Promise<void>;
  saveLectureProgress: (lectureId: string, videoPosition: number) => Promise<void>;
  setCurrentLecture: (lecture: Lecture | null) => void;

  // Actions - Notes
  fetchNotes: (courseId: string) => Promise<void>;
  createNote: (lectureId: string, content: string, timestamp: number) => Promise<void>;
  updateNote: (noteId: string, content: string) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;

  // Actions - Bookmarks
  fetchBookmarks: (courseId: string) => Promise<void>;
  createBookmark: (lectureId: string, title: string, timestamp: number) => Promise<void>;
  deleteBookmark: (bookmarkId: string) => Promise<void>;

  // Legacy support
  addCourse: (courseData: FormData) => Promise<void>;
  markLessonComplete: (courseId: string, lessonId: string) => Promise<void>;
}

const CoursesContext = createContext<CoursesContextType | undefined>(undefined);

export const useCourses = () => {
  const context = useContext(CoursesContext);
  if (!context) {
    throw new Error('useCourses must be used within a CoursesProvider');
  }
  return context;
};

export const CoursesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);
  const [enrollment, setEnrollment] = useState<EnrollmentProgress | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============== FETCH COURSES ==============

  const fetchCourses = useCallback(async (params?: { category?: string; level?: string; search?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response: any = await apiService.getCourses(params);
      const coursesArray = response?.courses || response || [];
      const mappedCourses = (Array.isArray(coursesArray) ? coursesArray : []).map(mapCourse);
      setCourses(mappedCourses);
    } catch (err: any) {
      console.error('Error fetching courses:', err);
      setError(err.message || 'Erreur lors du chargement des formations');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCourse = useCallback(async (id: string): Promise<Course | undefined> => {
    setLoading(true);
    setError(null);
    try {
      const response: any = await apiService.getCourse(id);
      const courseData = response?.course || response;
      if (!courseData) return undefined;

      const mapped = mapCourse(courseData);
      setCurrentCourse(mapped);

      // Update in courses list too
      setCourses(prev => {
        const index = prev.findIndex(c => c.id === id);
        if (index >= 0) {
          const newCourses = [...prev];
          newCourses[index] = mapped;
          return newCourses;
        }
        return prev;
      });

      return mapped;
    } catch (err: any) {
      console.error(`Error fetching course ${id}:`, err);
      setError(err.message || 'Erreur lors du chargement de la formation');
      return undefined;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // ============== ADMIN ACTIONS ==============

  const createCourse = async (courseData: FormData) => {
    try {
      await apiService.createCourse(courseData);
      await fetchCourses();
    } catch (err: any) {
      console.error('Error creating course:', err);
      throw err;
    }
  };

  const updateCourse = async (id: string, courseData: FormData) => {
    try {
      await apiService.updateCourse(id, courseData);
      await fetchCourses();
    } catch (err: any) {
      console.error('Error updating course:', err);
      throw err;
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      await apiService.deleteCourse(id);
      await fetchCourses();
    } catch (err: any) {
      console.error('Error deleting course:', err);
      throw err;
    }
  };

  const createSection = async (courseId: string, data: { title: string; description?: string }) => {
    try {
      await apiService.createSection(courseId, data);
      await fetchCourse(courseId);
    } catch (err: any) {
      console.error('Error creating section:', err);
      throw err;
    }
  };

  const updateSection = async (sectionId: string, data: { title?: string; description?: string }) => {
    try {
      await apiService.updateSection(sectionId, data);
      if (currentCourse) await fetchCourse(currentCourse.id);
    } catch (err: any) {
      console.error('Error updating section:', err);
      throw err;
    }
  };

  const deleteSection = async (sectionId: string) => {
    try {
      await apiService.deleteSection(sectionId);
      if (currentCourse) await fetchCourse(currentCourse.id);
    } catch (err: any) {
      console.error('Error deleting section:', err);
      throw err;
    }
  };

  const createLecture = async (sectionId: string, lectureData: FormData) => {
    try {
      await apiService.createLecture(sectionId, lectureData);
      if (currentCourse) await fetchCourse(currentCourse.id);
    } catch (err: any) {
      console.error('Error creating lecture:', err);
      throw err;
    }
  };

  const updateLecture = async (lectureId: string, lectureData: FormData) => {
    try {
      await apiService.updateLecture(lectureId, lectureData);
      if (currentCourse) await fetchCourse(currentCourse.id);
    } catch (err: any) {
      console.error('Error updating lecture:', err);
      throw err;
    }
  };

  const deleteLecture = async (lectureId: string) => {
    try {
      await apiService.deleteLecture(lectureId);
      if (currentCourse) await fetchCourse(currentCourse.id);
    } catch (err: any) {
      console.error('Error deleting lecture:', err);
      throw err;
    }
  };

  // ============== PROGRESSION ==============

  const enrollInCourse = async (courseId: string) => {
    try {
      await apiService.enrollInCourse(courseId);
      await fetchCourse(courseId);
    } catch (err: any) {
      console.error('Error enrolling in course:', err);
      throw err;
    }
  };

  const completeLecture = async (lectureId: string) => {
    try {
      await apiService.completeLecture(lectureId);
      if (currentCourse) {
        const updated = await fetchCourse(currentCourse.id);
        if (updated?.progress) {
          setEnrollment(updated.progress);
        }
      }
    } catch (err: any) {
      console.error('Error completing lecture:', err);
      throw err;
    }
  };

  const saveLectureProgress = async (lectureId: string, videoPosition: number) => {
    try {
      await apiService.saveLectureProgress(lectureId, { videoPosition });
    } catch (err: any) {
      console.error('Error saving lecture progress:', err);
      // Don't throw - this is a silent save
    }
  };

  // Legacy support
  const markLessonComplete = async (courseId: string, lessonId: string) => {
    await completeLecture(lessonId);
  };

  // ============== NOTES ==============

  const fetchNotes = async (courseId: string) => {
    try {
      const response: any = await apiService.getCourseNotes(courseId);
      const notesData = response?.notes || response || [];
      setNotes((Array.isArray(notesData) ? notesData : []).map(mapNote));
    } catch (err: any) {
      console.error('Error fetching notes:', err);
    }
  };

  const createNote = async (lectureId: string, content: string, timestamp: number) => {
    try {
      await apiService.createNote(lectureId, { content, timestamp });
      if (currentCourse) await fetchNotes(currentCourse.id);
    } catch (err: any) {
      console.error('Error creating note:', err);
      throw err;
    }
  };

  const updateNote = async (noteId: string, content: string) => {
    try {
      await apiService.updateNote(noteId, { content });
      if (currentCourse) await fetchNotes(currentCourse.id);
    } catch (err: any) {
      console.error('Error updating note:', err);
      throw err;
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      await apiService.deleteNote(noteId);
      setNotes(prev => prev.filter(n => n.id !== noteId));
    } catch (err: any) {
      console.error('Error deleting note:', err);
      throw err;
    }
  };

  // ============== BOOKMARKS ==============

  const fetchBookmarks = async (courseId: string) => {
    try {
      const response: any = await apiService.getCourseBookmarks(courseId);
      const bookmarksData = response?.bookmarks || response || [];
      setBookmarks((Array.isArray(bookmarksData) ? bookmarksData : []).map(mapBookmark));
    } catch (err: any) {
      console.error('Error fetching bookmarks:', err);
    }
  };

  const createBookmark = async (lectureId: string, title: string, timestamp: number) => {
    try {
      await apiService.createBookmark(lectureId, { title, timestamp });
      if (currentCourse) await fetchBookmarks(currentCourse.id);
    } catch (err: any) {
      console.error('Error creating bookmark:', err);
      throw err;
    }
  };

  const deleteBookmark = async (bookmarkId: string) => {
    try {
      await apiService.deleteBookmark(bookmarkId);
      setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
    } catch (err: any) {
      console.error('Error deleting bookmark:', err);
      throw err;
    }
  };

  // ============== CONTEXT VALUE ==============

  const value: CoursesContextType = {
    // État
    courses,
    currentCourse,
    currentLecture,
    enrollment,
    notes,
    bookmarks,
    loading,
    error,

    // Actions - Formations
    fetchCourses,
    fetchCourse,

    // Actions - Admin
    createCourse,
    updateCourse,
    deleteCourse,
    createSection,
    updateSection,
    deleteSection,
    createLecture,
    updateLecture,
    deleteLecture,

    // Actions - Progression
    enrollInCourse,
    completeLecture,
    saveLectureProgress,
    setCurrentLecture,

    // Actions - Notes
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,

    // Actions - Bookmarks
    fetchBookmarks,
    createBookmark,
    deleteBookmark,

    // Legacy support
    addCourse: createCourse,
    markLessonComplete,
  };

  return <CoursesContext.Provider value={value}>{children}</CoursesContext.Provider>;
};

// Re-export types for convenience
export type { Course, Section, Lecture, EnrollmentProgress, Note, Bookmark };
export { formatDuration };