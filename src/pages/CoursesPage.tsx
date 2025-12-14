import { BookOpen, Clock, Filter, Search, Star, Users } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCourses } from "../contexts/CoursesContext";
import { formatDuration, getLevelLabel } from "../types/courses";
import { getMediaUrl } from "../utils/mediaUrl";

const CoursesPage: React.FC = () => {
  const { courses, loading } = useCourses();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");

  const categories = [...new Set(courses.map((course) => course.category).filter(Boolean))];
  const levels = ['beginner', 'intermediate', 'advanced'];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || course.category === selectedCategory;
    const matchesLevel = !selectedLevel || course.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-gray-50">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-70" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-100 rounded-full blur-3xl opacity-70" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12">
          {/* Header */}
          <div className="text-center">
            <span className="inline-block text-xs font-semibold tracking-wider uppercase text-blue-700 bg-blue-100 px-3 py-1 rounded-full mb-4">
              Formations techniques
            </span>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Nos Pôles de Formation
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Développez vos compétences avec nos formations professionnelles conçues par des experts.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher une formation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Toutes les catégories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les niveaux</option>
              {levels.map((level) => (
                <option key={level} value={level}>
                  {getLevelLabel(level as any)}
                </option>
              ))}
            </select>

            <button className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Filter className="h-5 w-5 mr-2" />
              Filtrer
            </button>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredCourses.length} formation
            {filteredCourses.length > 1 ? "s" : ""} trouvée
            {filteredCourses.length > 1 ? "s" : ""}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des formations...</p>
          </div>
        )}

        {/* Courses Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
              >
                <div className="relative">
                  <img
                    src={getMediaUrl(course.thumbnail)}
                    alt={course.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-medium">
                    {getLevelLabel(course.level)}
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                    {course.category}
                  </div>
                  {course.discountPrice && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                      PROMO
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  {course.subtitle && (
                    <p className="text-gray-500 text-sm mb-2 line-clamp-1">
                      {course.subtitle}
                    </p>
                  )}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span>Par {typeof course.instructor === 'string' ? course.instructor : course.instructor.name}</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium ml-1">
                          {course.averageRating.toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">
                          ({course.totalReviews})
                        </span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Users className="h-4 w-4 mr-1" />
                        <span className="text-sm">{course.totalStudents}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{formatDuration(course.totalDuration)}</span>
                    <span className="mx-2">•</span>
                    <BookOpen className="h-4 w-4 mr-1" />
                    <span>{course.totalLectures} leçons</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline space-x-2">
                      {course.discountPrice ? (
                        <>
                          <span className="text-2xl font-bold text-blue-600">
                            {course.discountPrice}€
                          </span>
                          <span className="text-lg text-gray-400 line-through">
                            {course.price}€
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-blue-600">
                          {course.price}€
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/course/${course.id}`}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Voir le cours
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Aucune formation trouvée
            </h3>
            <p className="text-gray-600">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
