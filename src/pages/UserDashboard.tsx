import {
  Award,
  BookOpen,
  Check,
  Clock,
  Settings,
  ShoppingBag,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import UserCourseViewer from "../components/UserCourseViewer";
import { useAuth } from "../contexts/AuthContext";
import { useCourses } from "../contexts/CoursesContext";
import { apiService } from "../services/api";
import { getMediaUrl } from "../utils/mediaUrl";

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const { courses } = useCourses();
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
  });
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<
    "overview" | "courses" | "orders" | "profile"
  >("overview");
  const [selectedCourseForViewing, setSelectedCourseForViewing] =
    useState<any>(null);

  const enrolledCourses = courses.filter((course) => course.isEnrolled);
  const completedCourses = enrolledCourses.filter(
    (course) => (course.progress?.progressPercentage ?? 0) === 100
  );

  // Helper to get instructor name
  const getInstructorName = (instructor: any): string => {
    if (typeof instructor === 'string') return instructor;
    return instructor?.name ?? '';
  };

  // Helper to get progress percentage
  const getProgress = (course: any): number => {
    if (typeof course.progress === 'number') return course.progress;
    return course.progress?.progressPercentage ?? 0;
  };

  const tabs = [
    { id: "overview", label: "Vue d'ensemble", icon: User },
    { id: "courses", label: "Mes Formations", icon: BookOpen },
    { id: "orders", label: "Mes Commandes", icon: ShoppingBag },
    { id: "profile", label: "Profil", icon: Settings },
  ];

  useEffect(() => {
    let isMounted = true;

    const loadProfileAndOrders = async () => {
      if (user) {
        try {
          const profileResponse = await apiService.getProfile();
          // Handle both {user: {...}} and direct user object formats
          const userData = profileResponse?.user || profileResponse;
          if (isMounted && userData) {
            setProfileData({
              name: userData.name || "",
              email: userData.email || "",
              phone: userData.phone || "",
              address: userData.address || "",
            });
          }

          const ordersResponse = await apiService.getMyOrders();
          // Handle both {orders: [...]} and direct array formats
          const ordersData = ordersResponse?.orders || ordersResponse || [];
          if (isMounted) {
            setUserOrders(Array.isArray(ordersData) ? ordersData : []);
          }
        } catch (error) {
          console.error("Error loading user data:", error);
        }
      }
    };
    loadProfileAndOrders();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); // Only re-run when user ID changes, not on every user object change

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      try {
        await apiService.updateProfile({
          name: profileData.name,
          phone: profileData.phone,
          address: profileData.address,
        });
        alert("Profil mis à jour avec succès !");
        // Optionally, refresh user in AuthContext if needed
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("Échec de la mise à jour du profil.");
      }
    }
  };

  return (
    <div
      className="min-h-full bg-gray-50 py-8"
      style={{ minHeight: "calc(100vh - 64px)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 mb-8">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-100 rounded-full blur-3xl opacity-60" />
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Tableau de bord
                </h1>
                <p className="text-gray-600 mt-1">Bienvenue, {user?.name}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveTab("courses")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Mes formations
                </button>
                <button
                  onClick={() => setActiveTab("profile")}
                  className="bg-white text-gray-900 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Mon profil
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-4 mb-6">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">{user?.name}</h3>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === tab.id
                      ? "bg-blue-50 text-blue-600 border border-blue-200"
                      : "text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <BookOpen className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Formations suivies
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {enrolledCourses.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="bg-green-100 p-3 rounded-lg">
                        <Award className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Formations terminées
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {completedCourses.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <Clock className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Heures d'apprentissage
                        </p>
                        <p className="text-2xl font-bold text-gray-900">42h</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Activité récente
                  </h2>
                  <div className="space-y-4">
                    {enrolledCourses.slice(0, 3).map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <img
                          src={getMediaUrl(course.thumbnail)}
                          alt={course.title}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {course.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Progression: {getProgress(course)}%
                          </p>
                        </div>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${getProgress(course)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "courses" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Mes Formations
                </h2>
                {selectedCourseForViewing ? (
                  <UserCourseViewer
                    course={selectedCourseForViewing}
                    onBack={() => setSelectedCourseForViewing(null)}
                  />
                ) : (
                  <>
                    {enrolledCourses.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {enrolledCourses.map((course) => (
                          <div
                            key={course.id}
                            className="border border-gray-200 rounded-lg p-4"
                          >
                            <img
                              src={getMediaUrl(course.thumbnail)}
                              alt={course.title}
                              className="w-full h-32 object-cover rounded-lg mb-4"
                            />
                            <h3 className="font-medium text-gray-900 mb-2">
                              {course.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                              {getInstructorName(course.instructor)}
                            </p>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-500">
                                Progression
                              </span>
                              <span className="text-sm font-medium">
                                {getProgress(course)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${getProgress(course)}%` }}
                              ></div>
                            </div>
                            <button
                              onClick={() =>
                                setSelectedCourseForViewing(course)
                              }
                              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Continuer
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Aucune formation suivie
                        </h3>
                        <p className="text-gray-600">
                          Découvrez nos formations pour commencer votre
                          apprentissage
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === "orders" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Mes Commandes
                </h2>
                {userOrders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Commande ID
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Articles
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Montant Total
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Statut
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {userOrders.map((order) => (
                          <tr key={order.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              #{order.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {order.items_summary}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {order.total_amount}€
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === "completed" || order.status === "delivered"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "processing" || order.status === "in_progress" || order.status === "in_delivery"
                                    ? "bg-blue-100 text-blue-800"
                                    : order.status === "cancelled"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                              >
                                {order.status === "pending" ? "En attente" :
                                  order.status === "processing" || order.status === "in_progress" ? "En cours" :
                                    order.status === "in_delivery" ? "En livraison" :
                                      order.status === "completed" || order.status === "delivered" ? "Livré" :
                                        order.status === "cancelled" ? "Annulé" : order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(order.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {(order.status === 'processing' || order.status === 'in_progress' || order.status === 'in_delivery') && (
                                <button
                                  onClick={async () => {
                                    if (confirm("Confirmez-vous avoir bien reçu cette commande ?")) {
                                      try {
                                        await apiService.confirmOrderDelivery(order.id);
                                        // Refresh orders
                                        const response = await apiService.getMyOrders();
                                        setUserOrders(response.orders || []);
                                        alert("Réception confirmée avec succès !");
                                      } catch (error) {
                                        console.error("Error confirming delivery:", error);
                                        alert("Erreur lors de la confirmation");
                                      }
                                    }
                                  }}
                                  className="text-green-600 hover:text-green-900 flex items-center"
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Confirmer réception
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Aucune commande
                    </h3>
                    <p className="text-gray-600">
                      Vos commandes apparaîtront ici
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "profile" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Informations du profil
                </h2>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Nom complet
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={profileData.email}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Téléphone
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          phone: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Adresse
                    </label>
                    <textarea
                      id="address"
                      rows={3}
                      value={profileData.address}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          address: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Sauvegarder les modifications
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div >
  );
};

export default UserDashboard;
