import React, { useState } from 'react';
import {
  Plus, Edit, Trash2, Search, Filter, Upload, ChevronDown, ChevronRight,
  GripVertical, Video, FileText, PlayCircle, X, Save, FolderPlus
} from 'lucide-react';
import { useCourses } from '../../contexts/CoursesContext';
import { Course, Section, Lecture, formatDuration, getLevelLabel } from '../../types/courses';
import { getMediaUrl } from '../../utils/mediaUrl';

const AdminCoursesManager: React.FC = () => {
  const {
    courses,
    createCourse,
    updateCourse,
    deleteCourse,
    createSection,
    updateSection,
    deleteSection,
    createLecture,
    updateLecture,
    deleteLecture,
    fetchCourse,
  } = useCourses();

  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showLectureModal, setShowLectureModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [courseSubmitting, setCourseSubmitting] = useState(false);

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (typeof course.instructor === 'string'
      ? course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      : course.instructor.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // ============== COURSE HANDLERS ==============

  const handleCourseSubmit = async (courseData: FormData) => {
    setCourseSubmitting(true);
    try {
      if (editingCourse) {
        await updateCourse(editingCourse.id, courseData);
      } else {
        await createCourse(courseData);
      }
      setShowCourseModal(false);
      setEditingCourse(null);
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Erreur lors de la sauvegarde de la formation');
    } finally {
      setCourseSubmitting(false);
    }
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setShowCourseModal(true);
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette formation et tout son contenu ?')) {
      try {
        await deleteCourse(courseId);
        if (selectedCourse?.id === courseId) {
          setSelectedCourse(null);
        }
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleManageCourse = async (course: Course) => {
    const fullCourse = await fetchCourse(course.id);
    if (fullCourse) {
      setSelectedCourse(fullCourse);
    }
  };

  // ============== SECTION HANDLERS ==============

  const handleAddSection = () => {
    setEditingSection(null);
    setShowSectionModal(true);
  };

  const handleEditSection = (section: Section) => {
    setEditingSection(section);
    setShowSectionModal(true);
  };

  const handleSectionSubmit = async (data: { title: string; description?: string }) => {
    try {
      if (editingSection) {
        await updateSection(editingSection.id, data);
      } else if (selectedCourse) {
        await createSection(selectedCourse.id, data);
      }
      setShowSectionModal(false);
      setEditingSection(null);
      // Refresh course data
      if (selectedCourse) {
        const updated = await fetchCourse(selectedCourse.id);
        if (updated) setSelectedCourse(updated);
      }
    } catch (error) {
      console.error('Error saving section:', error);
      alert('Erreur lors de la sauvegarde de la section');
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette section et toutes ses leçons ?')) {
      try {
        await deleteSection(sectionId);
        if (selectedCourse) {
          const updated = await fetchCourse(selectedCourse.id);
          if (updated) setSelectedCourse(updated);
        }
      } catch (error) {
        console.error('Error deleting section:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  // ============== LECTURE HANDLERS ==============

  const handleAddLecture = (sectionId: string) => {
    setSelectedSectionId(sectionId);
    setEditingLecture(null);
    setShowLectureModal(true);
  };

  const handleEditLecture = (lecture: Lecture, sectionId: string) => {
    setSelectedSectionId(sectionId);
    setEditingLecture(lecture);
    setShowLectureModal(true);
  };

  const handleLectureSubmit = async (lectureData: FormData) => {
    try {
      if (editingLecture) {
        await updateLecture(editingLecture.id, lectureData);
      } else if (selectedSectionId) {
        await createLecture(selectedSectionId, lectureData);
      }
      setShowLectureModal(false);
      setEditingLecture(null);
      setSelectedSectionId(null);
      // Refresh course data
      if (selectedCourse) {
        const updated = await fetchCourse(selectedCourse.id);
        if (updated) setSelectedCourse(updated);
      }
    } catch (error) {
      console.error('Error saving lecture:', error);
      alert('Erreur lors de la sauvegarde de la leçon');
    }
  };

  const handleDeleteLecture = async (lectureId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette leçon ?')) {
      try {
        await deleteLecture(lectureId);
        if (selectedCourse) {
          const updated = await fetchCourse(selectedCourse.id);
          if (updated) setSelectedCourse(updated);
        }
      } catch (error) {
        console.error('Error deleting lecture:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  // ============== RENDER COURSE LIST ==============

  if (!selectedCourse) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des formations</h1>
          <button
            onClick={() => setShowCourseModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle formation
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher une formation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="h-5 w-5 mr-2" />
              Filtres
            </button>
          </div>
        </div>

        {/* Courses Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Formation</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Sections</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Leçons</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Prix</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Étudiants</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCourses.map(course => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        {course.thumbnail && (
                          <img
                            src={getMediaUrl(course.thumbnail)}
                            alt={course.title}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <h3 className="font-medium text-gray-900">{course.title}</h3>
                          <p className="text-sm text-gray-500">
                            {formatDuration(course.totalDuration)} • {getLevelLabel(course.level)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{course.totalSections || course.sections?.length || 0}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{course.totalLectures}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{course.price}€</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{course.totalStudents}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleManageCourse(course)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                          title="Gérer le contenu"
                        >
                          <FolderPlus className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditCourse(course)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Course Modal */}
        {showCourseModal && (
          <CourseModal
            course={editingCourse}
            onSubmit={handleCourseSubmit}
            onClose={() => {
              setShowCourseModal(false);
              setEditingCourse(null);
            }}
            isLoading={courseSubmitting}
          />
        )}
      </div>
    );
  }

  // ============== RENDER COURSE CURRICULUM EDITOR ==============

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSelectedCourse(null)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{selectedCourse.title}</h1>
            <p className="text-gray-500">Gérer les sections et les leçons</p>
          </div>
        </div>
        <button
          onClick={handleAddSection}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une section
        </button>
      </div>

      {/* Sections & Lectures */}
      <div className="bg-white rounded-xl shadow-sm">
        {selectedCourse.sections.length === 0 ? (
          <div className="p-12 text-center">
            <FolderPlus className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune section</h3>
            <p className="text-gray-600 mb-6">Commencez par créer une section pour organiser vos leçons</p>
            <button
              onClick={handleAddSection}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Créer la première section
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {selectedCourse.sections.map((section, sectionIndex) => (
              <div key={section.id} className="p-4">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-2">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="flex items-center space-x-3 flex-1 text-left"
                  >
                    <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                    {expandedSections.has(section.id) ? (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-500" />
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Section {sectionIndex + 1}: {section.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {section.lectures.length} leçon{section.lectures.length > 1 ? 's' : ''} • {formatDuration(section.totalDuration)}
                      </p>
                    </div>
                  </button>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleAddLecture(section.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                      title="Ajouter une leçon"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEditSection(section)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Modifier"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSection(section.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Lectures */}
                {expandedSections.has(section.id) && (
                  <div className="ml-10 mt-4 space-y-2">
                    {section.lectures.length === 0 ? (
                      <div className="p-4 bg-gray-50 rounded-lg text-center">
                        <p className="text-gray-500 text-sm">Aucune leçon dans cette section</p>
                        <button
                          onClick={() => handleAddLecture(section.id)}
                          className="text-blue-600 text-sm font-medium mt-2 hover:underline"
                        >
                          + Ajouter une leçon
                        </button>
                      </div>
                    ) : (
                      section.lectures.map((lecture, lectureIndex) => (
                        <div
                          key={lecture.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                        >
                          <div className="flex items-center space-x-3">
                            <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                            {lecture.contentType === 'video' ? (
                              <PlayCircle className="h-5 w-5 text-blue-600" />
                            ) : lecture.contentType === 'article' ? (
                              <FileText className="h-5 w-5 text-green-600" />
                            ) : (
                              <Video className="h-5 w-5 text-purple-600" />
                            )}
                            <div>
                              <h4 className="font-medium text-gray-900 text-sm">
                                {lectureIndex + 1}. {lecture.title}
                              </h4>
                              <p className="text-xs text-gray-500">
                                {formatDuration(lecture.duration)}
                                {lecture.isPreview && ' • Aperçu gratuit'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleEditLecture(lecture, section.id)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                              title="Modifier"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteLecture(lecture.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                              title="Supprimer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section Modal */}
      {showSectionModal && (
        <SectionModal
          section={editingSection}
          onSubmit={handleSectionSubmit}
          onClose={() => {
            setShowSectionModal(false);
            setEditingSection(null);
          }}
        />
      )}

      {/* Lecture Modal */}
      {showLectureModal && (
        <LectureModal
          lecture={editingLecture}
          onSubmit={handleLectureSubmit}
          onClose={() => {
            setShowLectureModal(false);
            setEditingLecture(null);
            setSelectedSectionId(null);
          }}
        />
      )}
    </div>
  );
};

// ============== COURSE MODAL ==============

interface CourseModalProps {
  course: Course | null;
  onSubmit: (courseData: FormData) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
}

const CourseModal: React.FC<CourseModalProps> = ({ course, onSubmit, onClose, isLoading }) => {
  const [formData, setFormData] = useState({
    title: course?.title || '',
    subtitle: course?.subtitle || '',
    description: course?.description || '',
    price: course?.price || 0,
    discountPrice: course?.discountPrice || '',
    level: course?.level || 'beginner',
    category: course?.category || '',
    language: course?.language || 'Français',
  });
  const [whatYouWillLearn, setWhatYouWillLearn] = useState<string[]>(course?.whatYouWillLearn || ['']);
  const [requirements, setRequirements] = useState<string[]>(course?.requirements || ['']);
  const [targetAudience, setTargetAudience] = useState<string[]>(course?.targetAudience || ['']);
  const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null);
  const [selectedPromoVideo, setSelectedPromoVideo] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append('title', formData.title);
    data.append('subtitle', formData.subtitle);
    data.append('description', formData.description);
    data.append('price', formData.price.toString());
    if (formData.discountPrice) {
      data.append('discount_price', formData.discountPrice.toString());
    }
    data.append('level', formData.level);
    data.append('category', formData.category);
    data.append('language', formData.language);

    data.append('what_you_will_learn', JSON.stringify(whatYouWillLearn.filter(Boolean)));
    data.append('requirements', JSON.stringify(requirements.filter(Boolean)));
    data.append('target_audience', JSON.stringify(targetAudience.filter(Boolean)));

    if (selectedThumbnail) {
      data.append('thumbnail', selectedThumbnail);
    }
    if (selectedPromoVideo) {
      data.append('promo_video', selectedPromoVideo);
    }

    onSubmit(data);
  };

  const addListItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => [...prev, '']);
  };

  const updateListItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number, value: string) => {
    setter(prev => prev.map((item, i) => i === index ? value : item));
  };

  const removeListItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">
            {course ? 'Modifier la formation' : 'Nouvelle formation'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Sous-titre</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              required
            />
          </div>

          {/* Price & Category */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prix (€) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prix promo (€)</label>
              <input
                type="number"
                value={formData.discountPrice}
                onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Niveau *</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="beginner">Débutant</option>
                <option value="intermediate">Intermédiaire</option>
                <option value="advanced">Avancé</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie *</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Media */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Miniature</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedThumbnail(e.target.files?.[0] || null)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vidéo promotionnelle</label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setSelectedPromoVideo(e.target.files?.[0] || null)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* What you'll learn */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ce que vous apprendrez</label>
            {whatYouWillLearn.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateListItem(setWhatYouWillLearn, index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Maîtriser les bases de React"
                />
                {whatYouWillLearn.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeListItem(setWhatYouWillLearn, index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addListItem(setWhatYouWillLearn)}
              className="text-blue-600 text-sm font-medium hover:underline"
            >
              + Ajouter un point
            </button>
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prérequis</label>
            {requirements.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateListItem(setRequirements, index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Connaissances de base en JavaScript"
                />
                {requirements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeListItem(setRequirements, index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addListItem(setRequirements)}
              className="text-blue-600 text-sm font-medium hover:underline"
            >
              + Ajouter un prérequis
            </button>
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Public cible</label>
            {targetAudience.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateListItem(setTargetAudience, index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Développeurs web débutants"
                />
                {targetAudience.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeListItem(setTargetAudience, index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addListItem(setTargetAudience)}
              className="text-blue-600 text-sm font-medium hover:underline"
            >
              + Ajouter une cible
            </button>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {course ? 'Modifier' : 'Créer'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============== SECTION MODAL ==============

interface SectionModalProps {
  section: Section | null;
  onSubmit: (data: { title: string; description?: string }) => void;
  onClose: () => void;
}

const SectionModal: React.FC<SectionModalProps> = ({ section, onSubmit, onClose }) => {
  const [title, setTitle] = useState(section?.title || '');
  const [description, setDescription] = useState(section?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description: description || undefined });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {section ? 'Modifier la section' : 'Nouvelle section'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Titre de la section *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Introduction au cours"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description (optionnel)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Une brève description de cette section"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {section ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============== LECTURE MODAL ==============

interface LectureModalProps {
  lecture: Lecture | null;
  onSubmit: (lectureData: FormData) => void;
  onClose: () => void;
}

const LectureModal: React.FC<LectureModalProps> = ({ lecture, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: lecture?.title || '',
    description: lecture?.description || '',
    contentType: lecture?.contentType || 'video',
    isPreview: lecture?.isPreview || false,
    isDownloadable: lecture?.isDownloadable || false,
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('content_type', formData.contentType);
    data.append('is_preview', formData.isPreview ? 'true' : 'false');
    data.append('is_downloadable', formData.isDownloadable ? 'true' : 'false');

    if (videoFile) {
      data.append('video_file', videoFile);
    }

    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {lecture ? 'Modifier la leçon' : 'Nouvelle leçon'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Introduction au module"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type de contenu</label>
            <select
              value={formData.contentType}
              onChange={(e) => setFormData({ ...formData, contentType: e.target.value as any })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="video">Vidéo</option>
              <option value="article">Article</option>
              <option value="quiz">Quiz</option>
            </select>
          </div>

          {formData.contentType === 'video' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fichier vidéo</label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="lecture-video"
                />
                <label
                  htmlFor="lecture-video"
                  className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg flex items-center space-x-2 border border-gray-300"
                >
                  <Upload className="h-5 w-5" />
                  <span>{videoFile ? videoFile.name : 'Choisir une vidéo'}</span>
                </label>
              </div>
              {lecture?.videoUrl && !videoFile && (
                <p className="text-xs text-gray-500 mt-2">Vidéo actuelle conservée si aucun nouveau fichier</p>
              )}
            </div>
          )}

          <div className="flex items-center space-x-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPreview}
                onChange={(e) => setFormData({ ...formData, isPreview: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">Aperçu gratuit</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isDownloadable}
                onChange={(e) => setFormData({ ...formData, isDownloadable: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">Téléchargeable</span>
            </label>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {lecture ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCoursesManager;