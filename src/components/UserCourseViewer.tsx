import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft, Play, CheckCircle, Clock, BookOpen, ChevronDown, ChevronRight,
  Bookmark, MessageSquare, FileText, Download, PlayCircle, Pause
} from 'lucide-react';
import { useCourses } from '../contexts/CoursesContext';
import { Course, Section, Lecture, formatDuration, formatTimestamp } from '../types/courses';
import { getMediaUrl } from '../utils/mediaUrl';

interface UserCourseViewerProps {
  course: Course;
  onBack: () => void;
}

const UserCourseViewer: React.FC<UserCourseViewerProps> = ({ course, onBack }) => {
  const {
    completeLecture,
    saveLectureProgress,
    notes,
    bookmarks,
    fetchNotes,
    fetchBookmarks,
    createNote,
    createBookmark,
    deleteNote,
    deleteBookmark,
  } = useCourses();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentSection, setCurrentSection] = useState<Section | null>(null);
  const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'content' | 'notes' | 'qa'>('content');
  const [noteContent, setNoteContent] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize with first incomplete lecture
  useEffect(() => {
    if (course.sections.length > 0) {
      // Find first incomplete lecture
      for (const section of course.sections) {
        const incompleteLecture = section.lectures.find(l => !l.isCompleted);
        if (incompleteLecture) {
          setCurrentSection(section);
          setCurrentLecture(incompleteLecture);
          setExpandedSections(new Set([section.id]));
          return;
        }
      }
      // All complete, default to first lecture
      setCurrentSection(course.sections[0]);
      setCurrentLecture(course.sections[0].lectures[0] || null);
      setExpandedSections(new Set([course.sections[0].id]));
    }
  }, [course]);

  // Load notes and bookmarks
  useEffect(() => {
    fetchNotes(course.id);
    fetchBookmarks(course.id);
  }, [course.id, fetchNotes, fetchBookmarks]);

  // Calculate progress
  const allLectures = course.sections.flatMap(s => s.lectures);
  const completedLectures = allLectures.filter(l => l.isCompleted).length;
  const progressPercentage = allLectures.length > 0
    ? Math.round((completedLectures / allLectures.length) * 100)
    : 0;

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

  const selectLecture = (section: Section, lecture: Lecture) => {
    // Save current progress before switching
    if (currentLecture && videoRef.current) {
      saveLectureProgress(currentLecture.id, Math.floor(videoRef.current.currentTime));
    }
    setCurrentSection(section);
    setCurrentLecture(lecture);
    setExpandedSections(prev => new Set([...prev, section.id]));
  };

  const handleLectureComplete = async () => {
    if (currentLecture && !currentLecture.isCompleted) {
      await completeLecture(currentLecture.id);
    }
  };

  const handleNextLecture = () => {
    if (!currentLecture || !currentSection) return;

    const currentIndex = currentSection.lectures.findIndex(l => l.id === currentLecture.id);

    // Try next lecture in current section
    if (currentIndex < currentSection.lectures.length - 1) {
      selectLecture(currentSection, currentSection.lectures[currentIndex + 1]);
      return;
    }

    // Try first lecture of next section
    const sectionIndex = course.sections.findIndex(s => s.id === currentSection.id);
    if (sectionIndex < course.sections.length - 1) {
      const nextSection = course.sections[sectionIndex + 1];
      if (nextSection.lectures.length > 0) {
        selectLecture(nextSection, nextSection.lectures[0]);
      }
    }
  };

  const handlePreviousLecture = () => {
    if (!currentLecture || !currentSection) return;

    const currentIndex = currentSection.lectures.findIndex(l => l.id === currentLecture.id);

    // Try previous lecture in current section
    if (currentIndex > 0) {
      selectLecture(currentSection, currentSection.lectures[currentIndex - 1]);
      return;
    }

    // Try last lecture of previous section
    const sectionIndex = course.sections.findIndex(s => s.id === currentSection.id);
    if (sectionIndex > 0) {
      const prevSection = course.sections[sectionIndex - 1];
      if (prevSection.lectures.length > 0) {
        selectLecture(prevSection, prevSection.lectures[prevSection.lectures.length - 1]);
      }
    }
  };

  const handleAddNote = async () => {
    if (!currentLecture || !noteContent.trim()) return;
    const timestamp = videoRef.current ? Math.floor(videoRef.current.currentTime) : 0;
    await createNote(currentLecture.id, noteContent, timestamp);
    setNoteContent('');
  };

  const handleAddBookmark = async () => {
    if (!currentLecture || !videoRef.current) return;
    const timestamp = Math.floor(videoRef.current.currentTime);
    await createBookmark(currentLecture.id, `Marque-page à ${formatTimestamp(timestamp)}`, timestamp);
  };

  const handleVideoTimeUpdate = () => {
    // Auto-save progress every 30 seconds
    if (videoRef.current && currentLecture) {
      const currentTime = Math.floor(videoRef.current.currentTime);
      if (currentTime > 0 && currentTime % 30 === 0) {
        saveLectureProgress(currentLecture.id, currentTime);
      }
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    handleLectureComplete();
  };

  // Filter notes and bookmarks for current lecture
  const currentNotes = notes.filter(n => n.lectureId === currentLecture?.id);
  const currentBookmarks = bookmarks.filter(b => b.lectureId === currentLecture?.id);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border-b border-gray-200 p-4">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour à mes formations
        </button>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            {progressPercentage}% complété ({completedLectures}/{allLectures.length} leçons)
          </div>
          <div className="w-32 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Video Player */}
          <div className="bg-black">
            <div className="max-w-5xl mx-auto">
              <div className="aspect-video relative">
                {currentLecture?.videoUrl ? (
                  <video
                    ref={videoRef}
                    key={currentLecture.id}
                    className="w-full h-full"
                    controls
                    onTimeUpdate={handleVideoTimeUpdate}
                    onEnded={handleVideoEnded}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  >
                    <source src={currentLecture.videoUrl} type="video/mp4" />
                    Votre navigateur ne supporte pas la lecture vidéo.
                  </video>
                ) : (
                  <div className="flex items-center justify-center h-full text-white">
                    <div className="text-center">
                      <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Vidéo de démonstration</p>
                      <p className="text-sm opacity-75">La vidéo sera disponible prochainement</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Lecture Info & Tabs */}
          <div className="flex-1 overflow-y-auto bg-white">
            <div className="max-w-5xl mx-auto p-6">
              {/* Lecture Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{currentLecture?.title}</h2>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{formatDuration(currentLecture?.duration || 0)}</span>
                    <span className="mx-2">•</span>
                    <span>{currentSection?.title}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleAddBookmark}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    title="Ajouter un marque-page"
                  >
                    <Bookmark className="h-5 w-5" />
                  </button>
                  {currentLecture && !currentLecture.isCompleted && (
                    <button
                      onClick={handleLectureComplete}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Marquer comme terminé
                    </button>
                  )}
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-8">
                  {[
                    { id: 'content', label: 'Description', icon: FileText },
                    { id: 'notes', label: `Notes (${currentNotes.length})`, icon: BookOpen },
                    { id: 'qa', label: 'Q&A', icon: MessageSquare },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center py-3 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      <tab.icon className="h-4 w-4 mr-2" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              {activeTab === 'content' && (
                <div>
                  {currentLecture?.description ? (
                    <p className="text-gray-700 whitespace-pre-line">{currentLecture.description}</p>
                  ) : (
                    <p className="text-gray-500">Aucune description pour cette leçon.</p>
                  )}

                  {/* Resources */}
                  {currentLecture?.resources && currentLecture.resources.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-semibold text-gray-900 mb-3">Ressources téléchargeables</h3>
                      <div className="space-y-2">
                        {currentLecture.resources.map((resource) => (
                          <a
                            key={resource.id}
                            href={resource.fileUrl}
                            download
                            className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <Download className="h-5 w-5 text-gray-500 mr-3" />
                            <span className="text-gray-700">{resource.title}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'notes' && (
                <div>
                  {/* Add Note */}
                  <div className="mb-6">
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        placeholder="Ajouter une note à ce moment de la vidéo..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
                      />
                      <button
                        onClick={handleAddNote}
                        disabled={!noteContent.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Ajouter
                      </button>
                    </div>
                  </div>

                  {/* Notes List */}
                  {currentNotes.length > 0 ? (
                    <div className="space-y-3">
                      {currentNotes.map((note) => (
                        <div key={note.id} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <button
                              onClick={() => {
                                if (videoRef.current) {
                                  videoRef.current.currentTime = note.timestamp;
                                }
                              }}
                              className="text-sm text-blue-600 hover:underline"
                            >
                              {formatTimestamp(note.timestamp)}
                            </button>
                            <button
                              onClick={() => deleteNote(note.id)}
                              className="text-red-500 text-sm hover:underline"
                            >
                              Supprimer
                            </button>
                          </div>
                          <p className="text-gray-700">{note.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      Aucune note pour cette leçon. Ajoutez-en une!
                    </p>
                  )}
                </div>
              )}

              {activeTab === 'qa' && (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>La section Q&A sera bientôt disponible.</p>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handlePreviousLecture}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Leçon précédente
                </button>
                <button
                  onClick={handleNextLecture}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Leçon suivante
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Curriculum */}
        <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto hidden lg:block">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-bold text-gray-900">Contenu du cours</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {course.sections.map((section, sectionIndex) => (
              <div key={section.id}>
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center text-left">
                    {expandedSections.has(section.id) ? (
                      <ChevronDown className="h-4 w-4 text-gray-500 mr-2" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-500 mr-2" />
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">
                        Section {sectionIndex + 1}
                      </h4>
                      <p className="text-xs text-gray-500 truncate max-w-[180px]">
                        {section.title}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {section.lectures.filter(l => l.isCompleted).length}/{section.lectures.length}
                  </span>
                </button>

                {expandedSections.has(section.id) && (
                  <div className="bg-gray-50">
                    {section.lectures.map((lecture, lectureIndex) => (
                      <button
                        key={lecture.id}
                        onClick={() => selectLecture(section, lecture)}
                        className={`w-full flex items-center p-3 pl-8 text-left hover:bg-gray-100 transition-colors ${currentLecture?.id === lecture.id ? 'bg-blue-50 border-l-2 border-blue-600' : ''
                          }`}
                      >
                        <div className="mr-3 flex-shrink-0">
                          {lecture.isCompleted ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : currentLecture?.id === lecture.id ? (
                            <PlayCircle className="h-4 w-4 text-blue-600" />
                          ) : (
                            <div className="w-4 h-4 border border-gray-300 rounded-full" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm text-gray-900 truncate">
                            {lectureIndex + 1}. {lecture.title}
                          </h5>
                          <p className="text-xs text-gray-500">
                            {formatDuration(lecture.duration)}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCourseViewer;