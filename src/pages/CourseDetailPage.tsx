import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Globe,
  Play,
  PlayCircle,
  ShoppingCart,
  Star,
  Users,
  Video,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useCourses } from "../contexts/CoursesContext";
import { Course, Section, Lecture, formatDuration, getLevelLabel } from "../types/courses";
import { getMediaUrl } from "../utils/mediaUrl";

const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchCourse, enrollInCourse } = useCourses();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "curriculum" | "reviews">("overview");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadCourse = async () => {
      if (id) {
        setLoading(true);
        const courseData = await fetchCourse(id);
        if (courseData) {
          setCourse(courseData);
          // Expand first section by default
          if (courseData.sections.length > 0) {
            setExpandedSections(new Set([courseData.sections[0].id]));
          }
        }
        setLoading(false);
      }
    };
    loadCourse();
  }, [id, fetchCourse]);

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

  const handleEnroll = async () => {
    if (!course) return;

    if (user) {
      try {
        await enrollInCourse(course.id);
        // Refresh course to get updated isEnrolled status
        const updated = await fetchCourse(course.id);
        if (updated) setCourse(updated);
      } catch (error) {
        console.error('Error enrolling:', error);
        alert('Erreur lors de l\'inscription');
      }
    } else {
      // Add to cart for guest users
      try {
        await addToCart(course.id, "course", 1);
        alert('Formation ajoutée au panier!');
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    }
  };

  const handleStartLearning = () => {
    if (course) {
      navigate(`/course/${course.id}/learn`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de la formation...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Formation non trouvée
          </h2>
          <Link to="/courses" className="text-blue-600 hover:text-blue-700">
            ← Retour aux formations
          </Link>
        </div>
      </div>
    );
  }

  const instructorName = typeof course.instructor === 'string' ? course.instructor : course.instructor.name;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            to="/courses"
            className="inline-flex items-center text-gray-300 hover:text-white mb-6"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour aux formations
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-4 flex items-center space-x-3">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {course.category}
                </span>
                <span className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm">
                  {getLevelLabel(course.level)}
                </span>
              </div>

              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              {course.subtitle && (
                <p className="text-xl text-gray-300 mb-4">{course.subtitle}</p>
              )}
              <p className="text-lg text-gray-300 mb-6">{course.description}</p>

              <div className="flex flex-wrap items-center gap-6 text-sm mb-6">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                  <span className="font-medium">{course.averageRating.toFixed(1)}</span>
                  <span className="text-gray-400 ml-1">
                    ({course.totalReviews} avis)
                  </span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Users className="h-5 w-5 mr-1" />
                  <span>{course.totalStudents} étudiants</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Clock className="h-5 w-5 mr-1" />
                  <span>{formatDuration(course.totalDuration)}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <BookOpen className="h-5 w-5 mr-1" />
                  <span>{course.totalLectures} leçons</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Globe className="h-5 w-5 mr-1" />
                  <span>{course.language}</span>
                </div>
              </div>

              <p className="text-gray-300">
                Créé par <span className="text-white font-medium">{instructorName}</span>
              </p>
              {course.lastUpdated && (
                <p className="text-gray-400 text-sm mt-2">
                  Dernière mise à jour: {new Date(course.lastUpdated).toLocaleDateString('fr-FR')}
                </p>
              )}
            </div>

            {/* Sidebar Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden sticky top-24">
                {/* Video Preview */}
                <div className="relative">
                  {course.promoVideo ? (
                    <video
                      src={course.promoVideo}
                      poster={getMediaUrl(course.thumbnail)}
                      className="w-full h-48 object-cover"
                      controls
                    />
                  ) : (
                    <div className="relative">
                      <img
                        src={getMediaUrl(course.thumbnail)}
                        alt={course.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <PlayCircle className="h-16 w-16 text-white opacity-80" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {/* Price */}
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center space-x-3">
                      {course.discountPrice ? (
                        <>
                          <span className="text-3xl font-bold text-gray-900">
                            {course.discountPrice}€
                          </span>
                          <span className="text-xl text-gray-400 line-through">
                            {course.price}€
                          </span>
                        </>
                      ) : (
                        <span className="text-3xl font-bold text-gray-900">
                          {course.price}€
                        </span>
                      )}
                    </div>

                    {course.isEnrolled ? (
                      <button
                        onClick={handleStartLearning}
                        className="w-full mt-4 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
                      >
                        <Play className="h-5 w-5 mr-2" />
                        Continuer l'apprentissage
                      </button>
                    ) : (
                      <button
                        onClick={handleEnroll}
                        className="w-full mt-4 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        {user ? "S'inscrire maintenant" : "Ajouter au panier"}
                      </button>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span>{formatDuration(course.totalDuration)} de contenu vidéo</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span>{course.totalLectures} leçons</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span>Accès à vie</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span>Certificat de fin de formation</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span>Support 24/7</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span>Garantie 30 jours</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* What you'll learn */}
            {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Ce que vous apprendrez
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.whatYouWillLearn.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="flex space-x-8">
                {[
                  { id: "overview", label: "Aperçu" },
                  { id: "curriculum", label: "Programme" },
                  { id: "reviews", label: "Avis" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Description */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    À propos de cette formation
                  </h3>
                  <p className="text-gray-600 whitespace-pre-line">{course.description}</p>
                </div>

                {/* Requirements */}
                {course.requirements && course.requirements.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Prérequis
                    </h3>
                    <ul className="space-y-2">
                      {course.requirements.map((req, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-gray-400 mr-3">•</span>
                          <span className="text-gray-700">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Target Audience */}
                {course.targetAudience && course.targetAudience.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      À qui s'adresse cette formation
                    </h3>
                    <ul className="space-y-2">
                      {course.targetAudience.map((target, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{target}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === "curriculum" && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900">
                    Contenu de la formation
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {course.sections.length} sections • {course.totalLectures} leçons • {formatDuration(course.totalDuration)} de durée totale
                  </p>
                </div>

                <div className="divide-y divide-gray-200">
                  {course.sections.map((section, sectionIndex) => (
                    <div key={section.id}>
                      {/* Section Header */}
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center">
                          {expandedSections.has(section.id) ? (
                            <ChevronDown className="h-5 w-5 text-gray-500 mr-3" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-gray-500 mr-3" />
                          )}
                          <div className="text-left">
                            <h4 className="font-semibold text-gray-900">
                              Section {sectionIndex + 1}: {section.title}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {section.lectures.length} leçons • {formatDuration(section.totalDuration)}
                            </p>
                          </div>
                        </div>
                      </button>

                      {/* Section Lectures */}
                      {expandedSections.has(section.id) && (
                        <div className="bg-gray-50 divide-y divide-gray-200">
                          {section.lectures.map((lecture, lectureIndex) => (
                            <div
                              key={lecture.id}
                              className="flex items-center justify-between px-6 py-3 pl-14"
                            >
                              <div className="flex items-center space-x-3">
                                {lecture.contentType === 'video' ? (
                                  <PlayCircle className="h-5 w-5 text-gray-400" />
                                ) : lecture.contentType === 'article' ? (
                                  <FileText className="h-5 w-5 text-gray-400" />
                                ) : (
                                  <Video className="h-5 w-5 text-gray-400" />
                                )}
                                <div>
                                  <h5 className="text-gray-900 text-sm">
                                    {lectureIndex + 1}. {lecture.title}
                                  </h5>
                                  {lecture.isPreview && (
                                    <span className="text-xs text-blue-600 font-medium">
                                      Aperçu gratuit
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                {lecture.resources && lecture.resources.length > 0 && (
                                  <Download className="h-4 w-4 text-gray-400" />
                                )}
                                <span className="text-sm text-gray-500">
                                  {formatDuration(lecture.duration)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Avis des étudiants
                </h3>

                {/* Rating Summary */}
                <div className="flex items-center mb-8">
                  <div className="text-center mr-8">
                    <div className="text-5xl font-bold text-gray-900">
                      {course.averageRating.toFixed(1)}
                    </div>
                    <div className="flex items-center justify-center mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < Math.round(course.averageRating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                            }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-500 text-sm mt-1">
                      {course.totalReviews} avis
                    </p>
                  </div>
                </div>

                {/* Placeholder reviews */}
                <div className="space-y-6">
                  {[1, 2, 3].map((review) => (
                    <div
                      key={review}
                      className="border-b border-gray-200 pb-6 last:border-0"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium text-gray-900">
                              Étudiant {review}
                            </h4>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="h-4 w-4 text-yellow-400 fill-current"
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600">
                            Excellente formation ! Les explications sont claires
                            et les exercices pratiques très utiles pour bien comprendre les concepts.
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Similar Courses */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Formations similaires
              </h3>
              <p className="text-gray-500 text-sm">
                Découvrez d'autres formations dans la catégorie {course.category}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
