import {
    Check,
    Filter,
    MapPin,
    Package,
    Phone,
    RefreshCw,
    Search,
    Truck,
    User,
    Calendar,
    Loader2,
    CheckCircle,
    Clock,
    ShoppingBag
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { apiService } from "../../services/api";

interface Delivery {
    id: string;
    order_id: string;
    invoice_number: string;
    user: {
        id: string;
        name: string;
        email: string;
        phone?: string;
    };
    delivery_type: 'delivery' | 'pickup'; // livraison ou récupération
    status: 'pending' | 'in_progress' | 'completed';
    address?: string;
    items: Array<{
        id: string;
        name: string;
        type: string;
        quantity: number;
    }>;
    created_at: string;
    scheduled_date?: string;
}

const AdminDeliveriesManager: React.FC = () => {
    const [deliveries, setDeliveries] = useState<Delivery[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'active' | 'completed'>('all'); // active = in_progress/in_delivery
    const [filterType, setFilterType] = useState<'all' | 'delivery' | 'pickup'>('all');
    const [processingAction, setProcessingAction] = useState<string | null>(null);

    const fetchDeliveries = async () => {
        setLoading(true);
        try {
            const response = await apiService.getAllDeliveries();
            const deliveriesData = response?.deliveries || response || [];
            setDeliveries(Array.isArray(deliveriesData) ? deliveriesData : []);
        } catch (error) {
            console.error("Error fetching deliveries:", error);
            setDeliveries([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeliveries();
    }, []);

    const handleMarkAsDelivered = async (deliveryId: string) => {
        setProcessingAction(deliveryId);
        try {
            await apiService.markDeliveryCompleted(deliveryId);
            await fetchDeliveries();
            alert("Article marqué comme livré/récupéré !");
        } catch (error) {
            console.error("Error marking delivery as completed:", error);
            alert("Erreur lors de la mise à jour");
        } finally {
            setProcessingAction(null);
        }
    };

    const handleStartDelivery = async (deliveryId: string) => {
        setProcessingAction(deliveryId);
        try {
            await apiService.startDelivery(deliveryId);
            await fetchDeliveries();
            alert("Livraison/Récupération en cours !");
        } catch (error) {
            console.error("Error starting delivery:", error);
            alert("Erreur lors du démarrage");
        } finally {
            setProcessingAction(null);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const isPending = (status: string) => status === 'pending';
    const isActive = (status: string) => ['in_progress', 'in_delivery', 'processing'].includes(status);
    const isCompleted = (status: string) => ['completed', 'delivered'].includes(status);

    const filteredDeliveries = deliveries.filter((delivery) => {
        const matchesSearch =
            delivery.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            delivery.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            delivery.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType =
            filterType === 'all' ||
            delivery.delivery_type === filterType;

        let matchesStatus = true;
        if (filterStatus === 'pending') matchesStatus = isPending(delivery.status);
        if (filterStatus === 'active') matchesStatus = isActive(delivery.status);
        if (filterStatus === 'completed') matchesStatus = isCompleted(delivery.status);

        return matchesSearch && matchesType && matchesStatus;
    });

    const pendingCount = deliveries.filter(d => isPending(d.status)).length;
    const activeCount = deliveries.filter(d => isActive(d.status)).length;
    const completedCount = deliveries.filter(d => isCompleted(d.status)).length;

    // Delivery vs Pickup counts (total)
    const deliveryCount = deliveries.filter(d => d.delivery_type === 'delivery').length;
    const pickupCount = deliveries.filter(d => d.delivery_type === 'pickup').length;

    const getStatusColor = (status: string) => {
        if (isPending(status)) return 'bg-orange-100 text-orange-800';
        if (isActive(status)) return 'bg-blue-100 text-blue-800';
        if (isCompleted(status)) return 'bg-green-100 text-green-800';
        return 'bg-gray-100 text-gray-800';
    };

    const getStatusLabel = (status: string) => {
        if (isPending(status)) return 'En attente';
        if (status === 'in_delivery') return 'En livraison';
        if (isActive(status)) return 'En cours';
        if (isCompleted(status)) return 'Terminé';
        return status;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Livraisons & Récupérations
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {deliveries.length} commande(s) au total
                    </p>
                </div>
                <button
                    onClick={fetchDeliveries}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Actualiser
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div onClick={() => setFilterStatus('pending')} className={`cursor-pointer bg-white rounded-xl shadow-sm p-4 border-l-4 border-orange-500 hover:bg-orange-50 transition-colors ${filterStatus === 'pending' ? 'ring-2 ring-orange-500' : ''}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">En attente</p>
                            <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
                        </div>
                        <Clock className="h-8 w-8 text-orange-500" />
                    </div>
                </div>
                <div onClick={() => setFilterStatus('active')} className={`cursor-pointer bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500 hover:bg-blue-50 transition-colors ${filterStatus === 'active' ? 'ring-2 ring-blue-500' : ''}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">En cours</p>
                            <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
                        </div>
                        <Truck className="h-8 w-8 text-blue-500" />
                    </div>
                </div>
                <div onClick={() => setFilterStatus('completed')} className={`cursor-pointer bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500 hover:bg-green-50 transition-colors ${filterStatus === 'completed' ? 'ring-2 ring-green-500' : ''}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Terminées</p>
                            <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                </div>
                <div onClick={() => setFilterStatus('all')} className={`cursor-pointer bg-white rounded-xl shadow-sm p-4 border-l-4 border-gray-500 hover:bg-gray-50 transition-colors ${filterStatus === 'all' ? 'ring-2 ring-gray-500' : ''}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total</p>
                            <p className="text-2xl font-bold text-gray-900">{deliveries.length}</p>
                        </div>
                        <Package className="h-8 w-8 text-gray-500" />
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
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

                    {/* Type Filter */}
                    <div className="flex items-center space-x-2 border-r pr-4 mr-2">
                        <button
                            onClick={() => setFilterType('all')}
                            className={`px-3 py-2 rounded-lg text-sm transition-colors ${filterType === 'all'
                                ? 'bg-gray-800 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Tout Type
                        </button>
                        <button
                            onClick={() => setFilterType('delivery')}
                            className={`px-3 py-2 rounded-lg text-sm transition-colors flex items-center ${filterType === 'delivery'
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <Truck className="h-3 w-3 mr-1" />
                            Livraisons
                        </button>
                        <button
                            onClick={() => setFilterType('pickup')}
                            className={`px-3 py-2 rounded-lg text-sm transition-colors flex items-center ${filterType === 'pickup'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <ShoppingBag className="h-3 w-3 mr-1" />
                            Récupérations
                        </button>
                    </div>

                    {/* Status Filter Buttons (redundant with cards but good for explicit action) */}
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                        <option value="all">Tous les statuts</option>
                        <option value="pending">En attente</option>
                        <option value="active">En cours</option>
                        <option value="completed">Terminé</option>
                    </select>
                </div>
            </div>

            {/* Deliveries List */}
            {loading ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Chargement des livraisons...</p>
                </div>
            ) : filteredDeliveries.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <CheckCircle className="h-16 w-16 text-green-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        Aucune livraison en attente
                    </h3>
                    <p className="text-gray-500">
                        Toutes les commandes ont été livrées ou récupérées
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredDeliveries.map((delivery) => (
                        <div
                            key={delivery.id}
                            className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
                        >
                            {/* Delivery Header */}
                            <div className={`px-6 py-4 border-b border-gray-100 ${delivery.delivery_type === 'delivery'
                                ? 'bg-gradient-to-r from-purple-50 to-indigo-50'
                                : 'bg-gradient-to-r from-green-50 to-emerald-50'
                                }`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${delivery.delivery_type === 'delivery'
                                            ? 'bg-purple-100'
                                            : 'bg-green-100'
                                            }`}>
                                            {delivery.delivery_type === 'delivery' ? (
                                                <Truck className="h-5 w-5 text-purple-600" />
                                            ) : (
                                                <ShoppingBag className="h-5 w-5 text-green-600" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">
                                                {delivery.delivery_type === 'delivery' ? 'Livraison' : 'Récupération'} - #{delivery.invoice_number}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                <Calendar className="inline h-3 w-3 mr-1" />
                                                Commandé le {formatDate(delivery.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(delivery.status)}`}>
                                        {getStatusLabel(delivery.status)}
                                    </span>
                                </div>
                            </div>

                            {/* Delivery Content */}
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Client Info */}
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-gray-500 flex items-center">
                                            <User className="h-4 w-4 mr-2" />
                                            Client
                                        </h4>
                                        <p className="font-medium text-gray-900">{delivery.user?.name || "N/A"}</p>
                                        <p className="text-sm text-gray-600">{delivery.user?.email || "N/A"}</p>
                                        {delivery.user?.phone && (
                                            <a
                                                href={`tel:${delivery.user.phone}`}
                                                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                                            >
                                                <Phone className="h-3 w-3 mr-1" />
                                                {delivery.user.phone}
                                            </a>
                                        )}
                                    </div>

                                    {/* Address/Location */}
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-gray-500 flex items-center">
                                            <MapPin className="h-4 w-4 mr-2" />
                                            {delivery.delivery_type === 'delivery' ? 'Adresse de livraison' : 'Lieu de récupération'}
                                        </h4>
                                        {delivery.delivery_type === 'delivery' ? (
                                            <p className="text-gray-900">{delivery.address || "Non spécifiée"}</p>
                                        ) : (
                                            <div>
                                                <p className="font-medium text-gray-900">THE SEVEN ENGINEER</p>
                                                <p className="text-sm text-gray-600">Ngaoundéré 3ème, Bini</p>
                                                <p className="text-sm text-gray-600">Mini-cité la Marseillaise</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Items */}
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-gray-500 flex items-center">
                                            <Package className="h-4 w-4 mr-2" />
                                            Articles ({delivery.items?.length || 0})
                                        </h4>
                                        <div className="flex flex-wrap gap-1">
                                            {delivery.items?.slice(0, 3).map((item, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700"
                                                >
                                                    {item.name} x{item.quantity}
                                                </span>
                                            ))}
                                            {delivery.items && delivery.items.length > 3 && (
                                                <span className="text-xs text-gray-500">
                                                    +{delivery.items.length - 3} autres
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end space-x-3">
                                    {delivery.status === 'pending' && (
                                        <button
                                            onClick={() => handleStartDelivery(delivery.id)}
                                            disabled={processingAction === delivery.id}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
                                        >
                                            {processingAction === delivery.id ? (
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            ) : (
                                                <Truck className="h-4 w-4 mr-2" />
                                            )}
                                            Démarrer
                                        </button>
                                    )}
                                    {(delivery.status === 'pending' || delivery.status === 'in_progress') && (
                                        <button
                                            onClick={() => handleMarkAsDelivered(delivery.id)}
                                            disabled={processingAction === delivery.id}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
                                        >
                                            {processingAction === delivery.id ? (
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            ) : (
                                                <Check className="h-4 w-4 mr-2" />
                                            )}
                                            {delivery.delivery_type === 'delivery' ? 'Marquer livré' : 'Marquer récupéré'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminDeliveriesManager;
