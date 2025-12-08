import React from 'react';
import {
  BarChart3,
  BookOpen,
  LayoutDashboard,
  MessageCircle,
  Plus,
  Settings,
  ShoppingBag,
  Users,
  Clock,
  Truck,
} from "lucide-react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AdminCoursesManager from "./AdminCoursesManager";
import AdminProductsManager from "./AdminProductsManager";
import AdminOrdersManager from "./AdminOrdersManager";
import AdminDeliveriesManager from "./AdminDeliveriesManager";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  /*const [activeTab, setActiveTab] = useState('overview');*/

  const sidebarItems = [
    {
      id: "overview",
      label: "Vue d'ensemble",
      icon: LayoutDashboard,
      path: "/admin",
    },
    {
      id: "orders",
      label: "Commandes",
      icon: Clock,
      path: "/admin/orders",
    },
    {
      id: "deliveries",
      label: "Livraisons",
      icon: Truck,
      path: "/admin/deliveries",
    },
    {
      id: "courses",
      label: "Formations",
      icon: BookOpen,
      path: "/admin/courses",
    },
    {
      id: "products",
      label: "Produits",
      icon: ShoppingBag,
      path: "/admin/products",
    },
    { id: "users", label: "Utilisateurs", icon: Users, path: "/admin/users" },
    {
      id: "messages",
      label: "Messages",
      icon: MessageCircle,
      path: "/admin/messages",
    },
    {
      id: "settings",
      label: "Paramètres",
      icon: Settings,
      path: "/admin/settings",
    },
  ];

  return (
    <div
      className="bg-gray-50 overflow-hidden"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <div className="flex overflow-hidden">
        {/* Sidebar */}
        <div
          className="w-64 bg-white shadow-sm border-r border-gray-200"
          style={{ height: "calc(100vh - 64px)" }}
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Administration</h2>
            <p className="text-sm text-gray-600">Bienvenue, {user?.name}</p>
          </div>

          <nav className="p-4 space-y-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path
                  ? "bg-blue-50 text-blue-600 border border-blue-200"
                  : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 h-[calc(100dvh)] overflow-auto pb-24">
          <Routes>
            <Route path="/" element={<AdminOverview />} />
            <Route path="/orders" element={<AdminOrdersManager />} />
            <Route path="/deliveries" element={<AdminDeliveriesManager />} />
            <Route path="/courses" element={<AdminCoursesManager />} />
            <Route path="/products" element={<AdminProductsManager />} />
            <Route path="/users" element={<AdminUsersManager />} />
            <Route path="/messages" element={<AdminMessagesManager />} />
            <Route path="/settings" element={<AdminSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const AdminOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-100 rounded-full blur-3xl opacity-60" />
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Vue d'ensemble</h1>
              <p className="text-gray-600 mt-1">Suivez les indicateurs clés et les activités récentes.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/admin/courses" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle formation
              </Link>
              <Link to="/admin/products" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau produit
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[{ icon: BookOpen, title: "Pôles de Formation", value: "10", color: "blue" },
        { icon: ShoppingBag, title: "Équipements", value: "150+", color: "green" },
        { icon: Users, title: "Apprenants", value: "200+", color: "purple" },
        { icon: BarChart3, title: "Services", value: "4", color: "orange" }].map((c, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg bg-${"blue" === c.color ? "blue" : "green" === c.color ? "green" : "purple" === c.color ? "purple" : "orange"}-100`}>
                  <c.icon className={`h-6 w-6 text-${"blue" === c.color ? "blue" : "green" === c.color ? "green" : "purple" === c.color ? "purple" : "orange"}-600`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{c.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{c.value}</p>
                </div>
              </div>
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">+5%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Activité récente
          </h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Nouvelle inscription à "Solaire Photovoltaïque"
                  </p>
                  <p className="text-xs text-gray-500">Il y a 2 heures</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Messages récents
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg"
              >
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Utilisateur {item}
                  </p>
                  <p className="text-xs text-gray-600">
                    Question sur la formation Domotique...
                  </p>
                  <p className="text-xs text-gray-500">Il y a 1 heure</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminUsersManager: React.FC = () => {
  const [search, setSearch] = React.useState("");
  const [role, setRole] = React.useState("");
  const [users] = React.useState(
    [
      { id: "1", name: "Alice Martin", email: "alice@example.com", role: "admin", status: "active", avatar: "" },
      { id: "2", name: "Bruno Dupont", email: "bruno@example.com", role: "user", status: "active", avatar: "" },
      { id: "3", name: "Claire Durand", email: "claire@example.com", role: "user", status: "suspended", avatar: "" },
      { id: "4", name: "David Leroy", email: "david@example.com", role: "user", status: "active", avatar: "" },
    ] as Array<{ id: string; name: string; email: string; role: "admin" | "user"; status: "active" | "suspended"; avatar?: string }>
  );
  const filtered = users.filter(u =>
    (role ? u.role === role : true) &&
    (search ? (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())) : true)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des utilisateurs</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Ajouter un utilisateur</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher par nom ou email..." className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <select value={role} onChange={e => setRole(e.target.value)} className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Tous les rôles</option>
            <option value="admin">Admin</option>
            <option value="user">Utilisateur</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Utilisateur</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Email</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Rôle</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Statut</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      {u.avatar ? (
                        <img src={u.avatar} className="w-9 h-9 rounded-full object-cover" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                          {u.name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{u.name}</div>
                        <div className="text-xs text-gray-500">ID: {u.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>{u.role === 'admin' ? "Admin" : "Utilisateur"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${u.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>{u.status === 'active' ? "Actif" : "Suspendu"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Modifier</button>
                      <button className="px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50">Supprimer</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AdminMessagesManager: React.FC = () => {
  const [conversations, setConversations] = React.useState(
    [
      { id: 'c1', user: { name: 'Alice Martin', email: 'alice@example.com' }, last: 'Merci pour votre retour!', unread: 2 },
      { id: 'c2', user: { name: 'Bruno Dupont', email: 'bruno@example.com' }, last: 'Quand est la prochaine session ?', unread: 0 },
      { id: 'c3', user: { name: 'Claire Durand', email: 'claire@example.com' }, last: "Je n'arrive pas à me connecter", unread: 1 },
    ]
  );
  const [activeId, setActiveId] = React.useState('c1');
  const [messages, setMessages] = React.useState<Record<string, Array<{ id: string; sender: 'user' | 'admin'; text: string; time: string }>>>(
    {
      c1: [
        { id: 'm1', sender: 'user', text: 'Bonjour, j’ai une question.', time: '09:12' },
        { id: 'm2', sender: 'admin', text: 'Bonjour Alice, je vous écoute.', time: '09:14' },
        { id: 'm3', sender: 'user', text: 'Merci pour votre retour!', time: '09:15' },
      ],
      c2: [
        { id: 'm1', sender: 'user', text: 'Quand est la prochaine session ?', time: 'Hier' },
      ],
      c3: [
        { id: 'm1', sender: 'user', text: "Je n'arrive pas à me connecter", time: '08:02' },
      ],
    }
  );
  const [draft, setDraft] = React.useState("");

  const send = () => {
    if (!draft.trim()) return;
    const newMsg = { id: String(Date.now()), sender: 'admin' as const, text: draft.trim(), time: 'Maintenant' };
    setMessages(prev => ({ ...prev, [activeId]: [...(prev[activeId] || []), newMsg] }));
    setDraft("");
    setConversations(prev => prev.map(c => c.id === activeId ? { ...c, last: newMsg.text, unread: 0 } : c));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Gestion des messages</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <input placeholder="Rechercher une conversation..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="max-h-[60vh] overflow-y-auto">
            {conversations.map(c => (
              <button key={c.id} onClick={() => setActiveId(c.id)} className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-50 ${activeId === c.id ? 'bg-blue-50' : ''}`}>
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                  {c.user.name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-900 line-clamp-1">{c.user.name}</div>
                    {c.unread > 0 && <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">{c.unread}</span>}
                  </div>
                  <div className="text-xs text-gray-500 line-clamp-1">{c.last}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <div className="font-medium text-gray-900">{conversations.find(c => c.id === activeId)?.user.name}</div>
            <div className="text-xs text-gray-500">{conversations.find(c => c.id === activeId)?.user.email}</div>
          </div>
          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            {(messages[activeId] || []).map(m => (
              <div key={m.id} className={`max-w-[80%] ${m.sender === 'admin' ? 'ml-auto' : ''}`}>
                <div className={`px-3 py-2 rounded-lg text-sm ${m.sender === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'}`}>{m.text}</div>
                <div className="text-[10px] text-gray-500 mt-1">{m.time}</div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <input value={draft} onChange={e => setDraft(e.target.value)} placeholder="Écrire un message..." className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button onClick={send} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Envoyer</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminSettings: React.FC = () => {
  const [siteName, setSiteName] = React.useState("THE7E");
  const [supportEmail, setSupportEmail] = React.useState("support@the7e.com");
  const [notifEnroll, setNotifEnroll] = React.useState(true);
  const [notifOrder, setNotifOrder] = React.useState(true);
  const [maintenance, setMaintenance] = React.useState(false);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Général</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Nom du site</label>
              <input value={siteName} onChange={e => setSiteName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Email de support</label>
              <input type="email" value={supportEmail} onChange={e => setSupportEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <div className="text-sm font-medium text-gray-900">Mode maintenance</div>
                <div className="text-xs text-gray-500">Affiche un message de maintenance aux visiteurs</div>
              </div>
              <button onClick={() => setMaintenance(v => !v)} className={`relative w-12 h-6 rounded-full ${maintenance ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <span className={`absolute top-0.5 ${maintenance ? 'right-0.5' : 'left-0.5'} w-5 h-5 bg-white rounded-full transition-all`} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <div className="text-sm font-medium text-gray-900">Nouvelle inscription à un cours</div>
                <div className="text-xs text-gray-500">Recevoir un email à chaque inscription</div>
              </div>
              <button onClick={() => setNotifEnroll(v => !v)} className={`relative w-12 h-6 rounded-full ${notifEnroll ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <span className={`absolute top-0.5 ${notifEnroll ? 'right-0.5' : 'left-0.5'} w-5 h-5 bg-white rounded-full transition-all`} />
              </button>
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <div className="text-sm font-medium text-gray-900">Nouvelle commande</div>
                <div className="text-xs text-gray-500">Recevoir un email pour chaque commande</div>
              </div>
              <button onClick={() => setNotifOrder(v => !v)} className={`relative w-12 h-6 rounded-full ${notifOrder ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <span className={`absolute top-0.5 ${notifOrder ? 'right-0.5' : 'left-0.5'} w-5 h-5 bg-white rounded-full transition-all`} />
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Sécurité</h2>
          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">Forcer la déconnexion de tous les utilisateurs</button>
            <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">Regénérer les clés API</button>
          </div>
          <div className="mt-6 text-right">
            <button className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Enregistrer les modifications</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
