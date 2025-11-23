import {
  LogOut,
  Menu,
  MessageCircle,
  // Search,
  Settings,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import type { FC } from "react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { useMessaging } from "../../contexts/MessagingContext";

interface HeaderProps {
  onToggleMessaging: () => void;
}

const Header: FC<HeaderProps> = ({ onToggleMessaging }) => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { unreadCount } = useMessaging();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      // Close user dropdown when clicking outside
      if (
        showUserMenu &&
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setShowUserMenu(false);
      }
      // Close mobile menu when clicking outside of it and the toggle
      if (
        isMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node)
      ) {
        const target = e.target as HTMLElement;
        const isToggle = target.closest("#mobile-menu-toggle");
        if (!isToggle) setIsMenuOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowUserMenu(false);
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [showUserMenu, isMenuOpen]);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate("/");
  };

  const navItems = [
    { path: "/", label: "Accueil" },
    { path: "/courses", label: "Formations" },
    { path: "/shop", label: "Boutique" },
    { path: "/labo", label: "Laboratoire" },
    { path: "/prestations", label: "Prestations" },
  ];

  return (
    <header className="bg-white/80 supports-[backdrop-filter]:bg-white/60 backdrop-blur shadow-sm border-b border-gray-200 fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 mr-2">
            <div className="logo">
              <img
                src="/images/THE7E_LOGO.png"
                className="w-9 h-9 object-contain"
              />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">THE7E</span>
              <div className="text-xs text-gray-600">THE SEVEN ENGINEER</div>
            </div>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? "text-blue-700 bg-blue-50"
                    : "text-gray-700 hover:text-blue-700 hover:bg-gray-50"
                }`}
                aria-current={
                  location.pathname === item.path ? "page" : undefined
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Barre de recherche */}
          {/* <div className="hidden md:flex flex-1 max-w-xs mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                aria-label="Rechercher"
              />
            </div>
          </div> */}

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {user && (
              <button
                onClick={onToggleMessaging}
                className="relative p-2 text-gray-700 hover:text-blue-700 transition-colors"
                aria-label="Ouvrir la messagerie"
              >
                <MessageCircle className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-5 min-w-[1.25rem] px-1 flex items-center justify-center">
                    <span className="sr-only">Messages non lus</span>
                    {unreadCount}
                  </span>
                )}
              </button>
            )}

            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-blue-700 transition-colors"
              aria-label="Voir le panier"
            >
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] rounded-full h-5 min-w-[1.25rem] px-1 flex items-center justify-center">
                  <span className="sr-only">Articles dans le panier</span>
                  {itemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-haspopup="menu"
                  aria-expanded={showUserMenu}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="h-4 w-4" />
                      <span>Mon Profil</span>
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Administration</span>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Connexion
              </Link>
            )}

            {/* Menu mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700"
              id="mobile-menu-toggle"
              aria-label="Ouvrir le menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div
            className="md:hidden border-t border-gray-200 py-4"
            id="mobile-menu"
            ref={mobileMenuRef}
            role="dialog"
            aria-label="Menu mobile"
          >
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? "text-blue-700 bg-blue-50"
                      : "text-gray-700 hover:text-blue-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={
                    location.pathname === item.path ? "page" : undefined
                  }
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            {/* <div className="mt-4 px-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600"
                  aria-label="Rechercher"
                />
              </div>
            </div> */}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
