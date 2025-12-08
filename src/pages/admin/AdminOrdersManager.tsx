import {
    Check,
    Clock,
    Eye,
    Filter,
    RefreshCw,
    Search,
    X,
    Image as ImageIcon,
    CreditCard,
    User,
    Package,
    Calendar,
    Loader2
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { apiService } from "../../services/api";

// Backend URL for images
const BACKEND_URL = 'http://localhost:8000';

const getFullImageUrl = (imagePath: string): string => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    return `${BACKEND_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

interface Order {
    id: string;
    invoice_number: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
    payment_method: string;
    payment_proof: string;
    total: number;
    status: string;
    items: Array<{
        id: string;
        name: string;
        type: string;
        price: number;
        quantity: number;
    }>;
    created_at: string;
}

const AdminOrdersManager: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showProofModal, setShowProofModal] = useState(false);
    const [processingAction, setProcessingAction] = useState<string | null>(null);

    const fetchPendingOrders = async () => {
        setLoading(true);
        try {
            const response = await apiService.getPendingOrders();
            const ordersData = response?.orders || response || [];
            setOrders(Array.isArray(ordersData) ? ordersData : []);
        } catch (error) {
            console.error("Error fetching pending orders:", error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingOrders();
    }, []);

    const handleApprove = async (orderId: string) => {
        setProcessingAction(orderId);
        try {
            await apiService.approveOrder(orderId);
            await fetchPendingOrders();
            alert("Commande approuvée avec succès !");
        } catch (error) {
            console.error("Error approving order:", error);
            alert("Erreur lors de l'approbation de la commande");
        } finally {
            setProcessingAction(null);
        }
    };

    const handleReject = async (orderId: string) => {
        const reason = prompt("Raison du rejet (optionnel):");
        setProcessingAction(orderId);
        try {
            await apiService.rejectOrder(orderId, reason || "");
            await fetchPendingOrders();
            alert("Commande rejetée");
        } catch (error) {
            console.error("Error rejecting order:", error);
            alert("Erreur lors du rejet de la commande");
        } finally {
            setProcessingAction(null);
        }
    };

    const viewPaymentProof = (order: Order) => {
        setSelectedOrder(order);
        setShowProofModal(true);
    };

    const filteredOrders = orders.filter(
        (order) =>
            order.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getPaymentMethodLabel = (method: string) => {
        const methods: { [key: string]: string } = {
            mobile_money: "Mobile Money",
            orange_money: "Orange Money",
            bank_transfer: "Virement bancaire",
        };
        return methods[method] || method;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Commandes en attente
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {orders.length} commande(s) en attente d'approbation
                    </p>
                </div>
                <button
                    onClick={fetchPendingOrders}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Actualiser
                </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Rechercher par n° facture, client..."
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

            {/* Orders List */}
            {loading ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Chargement des commandes...</p>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        Aucune commande en attente
                    </h3>
                    <p className="text-gray-500">
                        Toutes les commandes ont été traitées
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
                        >
                            {/* Order Header */}
                            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 px-6 py-4 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                            <Clock className="h-5 w-5 text-orange-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">
                                                Facture #{order.invoice_number}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                <Calendar className="inline h-3 w-3 mr-1" />
                                                {formatDate(order.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                                        En attente d'approbation
                                    </span>
                                </div>
                            </div>

                            {/* Order Content */}
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Client Info */}
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-gray-500 flex items-center">
                                            <User className="h-4 w-4 mr-2" />
                                            Client
                                        </h4>
                                        <p className="font-medium text-gray-900">{order.user?.name || "N/A"}</p>
                                        <p className="text-sm text-gray-600">{order.user?.email || "N/A"}</p>
                                    </div>

                                    {/* Payment Info */}
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-gray-500 flex items-center">
                                            <CreditCard className="h-4 w-4 mr-2" />
                                            Paiement
                                        </h4>
                                        <p className="font-medium text-gray-900">
                                            {getPaymentMethodLabel(order.payment_method)}
                                        </p>
                                        <button
                                            onClick={() => viewPaymentProof(order)}
                                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                                        >
                                            <ImageIcon className="h-4 w-4 mr-1" />
                                            Voir la preuve de paiement
                                        </button>
                                    </div>

                                    {/* Total */}
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-gray-500 flex items-center">
                                            <Package className="h-4 w-4 mr-2" />
                                            Total
                                        </h4>
                                        <p className="text-2xl font-bold text-green-600">
                                            {Number(order.total).toFixed(2)} €
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {order.items?.length || 0} article(s)
                                        </p>
                                    </div>
                                </div>

                                {/* Items List */}
                                {order.items && order.items.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <h4 className="text-sm font-medium text-gray-500 mb-2">Articles commandés</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {order.items.map((item, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                                                >
                                                    {item.name} x{item.quantity}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end space-x-3">
                                    <button
                                        onClick={() => handleReject(order.id)}
                                        disabled={processingAction === order.id}
                                        className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center disabled:opacity-50"
                                    >
                                        {processingAction === order.id ? (
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                            <X className="h-4 w-4 mr-2" />
                                        )}
                                        Rejeter
                                    </button>
                                    <button
                                        onClick={() => handleApprove(order.id)}
                                        disabled={processingAction === order.id}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
                                    >
                                        {processingAction === order.id ? (
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                            <Check className="h-4 w-4 mr-2" />
                                        )}
                                        Approuver
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Payment Proof Modal */}
            {showProofModal && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowProofModal(false)}
                    />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">
                                Preuve de paiement - #{selectedOrder.invoice_number}
                            </h2>
                            <button
                                onClick={() => setShowProofModal(false)}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500">Client:</span>
                                    <span className="ml-2 font-medium">{selectedOrder.user?.name}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Méthode:</span>
                                    <span className="ml-2 font-medium">
                                        {getPaymentMethodLabel(selectedOrder.payment_method)}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Montant:</span>
                                    <span className="ml-2 font-medium text-green-600">
                                        {Number(selectedOrder.total).toFixed(2)} €
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Date:</span>
                                    <span className="ml-2 font-medium">
                                        {formatDate(selectedOrder.created_at)}
                                    </span>
                                </div>
                            </div>
                            {selectedOrder.payment_proof ? (
                                <img
                                    src={getFullImageUrl(selectedOrder.payment_proof)}
                                    alt="Preuve de paiement"
                                    className="w-full rounded-lg border border-gray-200"
                                />
                            ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-lg">
                                    <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">Aucune preuve de paiement fournie</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrdersManager;
