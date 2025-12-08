import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

// Backend base URL for media files
const BACKEND_URL = 'http://localhost:8000';

// Helper to build full image URL
const getFullImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  // If already a full URL, return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  // Otherwise, prepend backend URL
  return `${BACKEND_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  isCompleted?: boolean;
  order_index: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  image: string;
  duration: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  category: string;
  rating: number;
  studentsCount: number;
  lessons: Lesson[];
  isEnrolled?: boolean;
  progress?: number;
}

interface CoursesContextType {
  courses: Course[];
  addCourse: (courseData: FormData) => Promise<void>;
  updateCourse: (id: string, courseData: FormData) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  enrollInCourse: (courseId: string) => Promise<void>;
  markLessonComplete: (courseId: string, lessonId: string) => Promise<void>;
  fetchCourses: () => Promise<void>;
  fetchCourseById: (id: string) => Promise<Course | undefined>;
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

  const fetchCourses = async () => {
    try {
      const response: any = await apiService.getCourses();
      // Handle both {courses: [...]} and direct array formats
      const coursesArray = response?.courses || response || [];
      const mappedCourses: Course[] = (Array.isArray(coursesArray) ? coursesArray : []).map((c: any) => ({
        id: c.id?.toString() ?? '',
        title: c.title ?? '',
        description: c.description ?? '',
        instructor: c.instructor ?? '',
        price: Number(c.price) || 0,
        image: getFullImageUrl(c.image ?? ''),
        duration: c.duration ?? '',
        level: c.level ?? 'Débutant',
        category: c.category ?? '',
        rating: Number(c.rating) || 0,
        studentsCount: Number(c.students_count) || 0,
        lessons: [],
        isEnrolled: c.is_enrolled === 1 || c.is_enrolled === true,
        progress: Number(c.progress) || 0,
      }));
      setCourses(mappedCourses);
    } catch (error: any) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchCourseById = async (id: string): Promise<Course | undefined> => {
    try {
      const response: any = await apiService.getCourse(id);
      // Handle both {course: {...}} and direct object formats
      const courseData: any = response?.course || response;
      if (!courseData) return undefined;
      return {
        id: courseData.id?.toString() ?? '',
        title: courseData.title ?? '',
        description: courseData.description ?? '',
        instructor: courseData.instructor ?? '',
        price: Number(courseData.price) || 0,
        image: getFullImageUrl(courseData.image ?? ''),
        duration: courseData.duration ?? '',
        level: courseData.level ?? 'Débutant',
        category: courseData.category ?? '',
        rating: Number(courseData.rating) || 0,
        studentsCount: Number(courseData.students_count) || 0,
        lessons: (courseData.lessons || []).map((l: any) => ({
          id: l.id?.toString() ?? '',
          title: l.title ?? '',
          duration: l.duration ?? '',
          videoUrl: l.video_url ?? '',
          isCompleted: l.is_completed === 1 || l.is_completed === true,
          order_index: Number(l.order_index) || 0,
        })),
        isEnrolled: courseData.is_enrolled === 1 || courseData.is_enrolled === true,
        progress: Number(courseData.progress) || 0,
      };
    } catch (error: any) {
      console.error(`Error fetching course ${id}:`, error);
      return undefined;
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const addCourse = async (courseData: FormData) => {
    try {
      await apiService.createCourse(courseData);
      await fetchCourses();
    } catch (error: any) {
      console.error('Error adding course:', error);
      throw error;
    }
  };

  const updateCourse = async (id: string, courseData: FormData) => {
    try {
      await apiService.updateCourse(id, courseData);
      await fetchCourses();
    } catch (error: any) {
      console.error('Error updating course:', error);
      throw error;
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      await apiService.deleteCourse(id);
      await fetchCourses();
    } catch (error: any) {
      console.error('Error deleting course:', error);
      throw error;
    }
  };

  const enrollInCourse = async (courseId: string) => {
    try {
      await apiService.enrollInCourse(courseId);
      await fetchCourses();
    } catch (error: any) {
      console.error('Error enrolling in course:', error);
      throw error;
    }
  };

  const markLessonComplete = async (courseId: string, lessonId: string) => {
    try {
      await apiService.completeLesson(courseId, lessonId);
      const updatedCourse = await fetchCourseById(courseId);
      if (updatedCourse) {
        setCourses(prev =>
          prev.map(c => (c.id === courseId ? updatedCourse : c))
        );
      }
    } catch (error: any) {
      console.error('Error marking lesson complete:', error);
      throw error;
    }
  };

  const value: CoursesContextType = {
    courses,
    addCourse,
    updateCourse,
    deleteCourse,
    enrollInCourse,
    markLessonComplete,
    fetchCourses,
    fetchCourseById,
  };

  return <CoursesContext.Provider value={value}>{children}</CoursesContext.Provider>;
};