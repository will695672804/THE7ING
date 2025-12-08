import { ArrowLeft, Download, Printer as Print, Upload, X, Check, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { apiService } from "../services/api";

// Modal de paiement avec upload d'image
const PaymentModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (paymentMethod: string, proofImage: File) => Promise<void>;
  totalAmount: number;
}> = ({ isOpen, onClose, onSubmit, totalAmount }) => {
  const [paymentMethod, setPaymentMethod] = useState<string>("mobile_money");
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith("image/")) {
        setError("Veuillez sélectionner une image valide");
        return;
      }
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("L'image ne doit pas dépasser 5 Mo");
        return;
      }
      setProofImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!proofImage) {
      setError("Veuillez téléverser une preuve de paiement");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(paymentMethod, proofImage);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = () => {
    setProofImage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Confirmer le paiement</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Montant */}
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600 mb-1">Montant à payer</p>
            <p className="text-3xl font-bold text-blue-600">{totalAmount.toFixed(2)} €</p>
          </div>

          {/* Méthode de paiement */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Méthode de paiement
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("mobile_money")}
                className={`p-4 rounded-xl border-2 transition-all ${paymentMethod === "mobile_money"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <div className="text-center">
                  <span className="text-2xl mb-1 block">📱</span>
                  <span className="text-sm font-medium">Mobile Money</span>
                  <p className="text-xs text-gray-500 mt-1">+237 674 13 66 97</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("orange_money")}
                className={`p-4 rounded-xl border-2 transition-all ${paymentMethod === "orange_money"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <div className="text-center">
                  <span className="text-2xl mb-1 block">🍊</span>
                  <span className="text-sm font-medium">Orange Money</span>
                  <p className="text-xs text-gray-500 mt-1">+237 694 01 82 07</p>
                </div>
              </button>
            </div>
          </div>

          {/* Upload de preuve */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Preuve de paiement <span className="text-red-500">*</span>
            </label>

            {!proofImage ? (
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600 text-center">
                    <span className="font-medium text-blue-600">Cliquez pour téléverser</span>
                    <br />
                    <span className="text-xs text-gray-500">ou glissez-déposez l'image</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-2">PNG, JPG jusqu'à 5 Mo</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            ) : (
              <div className="relative">
                <img
                  src={previewUrl || ""}
                  alt="Preuve de paiement"
                  className="w-full h-40 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X size={16} />
                </button>
                <div className="absolute bottom-2 left-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
                  <Check size={14} />
                  Image ajoutée
                </div>
              </div>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !proofImage}
            className={`w-full py-4 rounded-xl font-medium text-lg transition-all flex items-center justify-center gap-2 ${isSubmitting || !proofImage
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl"
              }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Traitement en cours...
              </>
            ) : (
              <>
                <Check size={20} />
                Confirmer le paiement
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 text-center">
            En confirmant, vous acceptez nos conditions générales de vente.
            Votre commande sera validée après vérification du paiement.
          </p>
        </div>
      </div>
    </div>
  );
};

const InvoicePage: React.FC = () => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Générer un numéro de facture unique
  const invoiceNumber = `2025-${Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")}`;

  // Dates
  const today = new Date();
  const dueDate = new Date(today);
  dueDate.setDate(today.getDate() + 30);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Calculs TVA (20% comme dans l'application)
  const totalHT = total;
  const tvaRate = 0.2;
  const tvaAmount = totalHT * tvaRate;
  const totalTTC = totalHT + tvaAmount;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Simulation du téléchargement
    alert(
      "Fonctionnalité de téléchargement à implémenter avec un service backend"
    );
  };

  const handlePaymentSubmit = async (paymentMethod: string, proofImage: File) => {
    try {
      // Créer FormData pour envoyer l'image avec les données
      const formData = new FormData();
      formData.append("payment_method", paymentMethod);
      formData.append("payment_proof", proofImage);
      formData.append("total", totalTTC.toString());
      formData.append("invoice_number", invoiceNumber);

      // Ajouter les items du panier
      items.forEach((item, index) => {
        formData.append(`items[${index}][id]`, item.itemId);
        formData.append(`items[${index}][type]`, item.type);
        formData.append(`items[${index}][name]`, item.name);
        formData.append(`items[${index}][price]`, item.price.toString());
        formData.append(`items[${index}][quantity]`, item.quantity.toString());
      });

      await apiService.createOrderWithProof(formData);
      await clearCart();
      setShowPaymentModal(false);
      alert("Paiement effectué avec succès ! Merci pour votre commande.");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error processing payment:", error);
      throw error;
    }
  };

  if (items.length === 0) {
    return (
      <div
        className="min-h-full bg-gray-50 flex items-center justify-center"
        style={{ minHeight: "calc(100vh - 64px)" }}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Aucune facture à afficher
          </h2>
          <Link
            to="/cart"
            className="text-blue-600 flex justify-center items-center gap-2 hover:text-blue-700 text-sm"
          >
            <ArrowLeft size={18} /> Retour au panier
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Actions Header */}
        <div className="flex items-center justify-between mb-8 print:hidden">
          <Link
            to="/cart"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour au panier
          </Link>
          <div className="flex space-x-4">
            <button
              onClick={handlePrint}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Print className="h-4 w-4 mr-2" />
              Imprimer
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Télécharger PDF
            </button>
          </div>
        </div>

        {/* Invoice */}
        <div className="bg-white rounded-lg overflow-hidden invoice-content">
          <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center space-x-3">
                <div className="logo">
                  <img
                    src="/images/THE7E_LOGO.png"
                    className="w-11 h-11 object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-blue-600">
                    THE SEVEN ENGINEER
                  </h1>
                  <p className="text-gray-600">
                    Centre de Formation & Bureau d'Étude
                  </p>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  FACTURE - {invoiceNumber}
                </h2>
                <p className="text-gray-600">
                  Date de facturation: {formatDate(today)}
                </p>
                <p className="text-gray-600">Échéance: {formatDate(dueDate)}</p>
              </div>
            </div>

            {/* Company and Client Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-gray-900 mb-3">
                  THE SEVEN ENGINEER - Centre de formation
                </h3>
                <div className="text-gray-600 space-y-1">
                  <p>THE SEVEN ENGINEER</p>
                  <p>Ngaoundéré 3ème, Bini</p>
                  <p>Mini-cité la Marseillaise</p>
                  <p>À 100m de la nationale Ngaoundéré-Garoua</p>
                  <p>+237 674 13 66 97</p>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-3">
                  {user?.name || "Client"}
                </h3>
                <div className="text-gray-600 space-y-1">
                  <p>{user?.email || "email@example.com"}</p>
                  <p>Ngaoundéré</p>
                  <p>Cameroun</p>
                </div>
              </div>
            </div>

            {/* Thank you message */}
            <div className="mb-6">
              <p className="text-gray-700">
                Merci d'avoir choisi THE SEVEN ENGINEER !
              </p>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                      Qté
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                      Unité
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                      Prix unitaire
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                      TVA
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                      Montant
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {formatDate(today)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {typeof item.quantity === "number"
                          ? item.quantity.toFixed(2)
                          : "1.00"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {item.type === "course" ? "formation" : "pce"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {item.price.toFixed(2)} €
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        20,0 %
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {(item.price * item.quantity).toFixed(2)} €
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-64">
                <div className="flex justify-between py-2">
                  <span className="font-medium">Total HT</span>
                  <span className="font-medium">{totalHT.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium">TVA 20,0 %</span>
                  <span className="font-medium">{tvaAmount.toFixed(2)} €</span>
                </div>
                <div className="border-t border-gray-300 pt-2">
                  <div className="flex justify-between py-2">
                    <span className="text-lg font-bold">Total TTC</span>
                    <span className="text-lg font-bold">
                      {totalTTC.toFixed(2)} €
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">
                  Moyens de paiement:
                </h4>
                <div className="text-gray-600 space-y-1">
                  <p>Mobile Money: +237 674 13 66 97</p>
                  <p>Orange Money: +237 694 01 82 07</p>
                  <p>Virement bancaire disponible</p>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">
                  Conditions de paiement:
                </h4>
                <p className="text-gray-600">30 jours</p>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-gray-600 text-sm border-t border-gray-200 pt-6">
              <p className="font-medium">
                THE SEVEN ENGINEER - Centre de formation
              </p>
              <p>Ngaoundéré 3ème, Bini - Mini-cité la Marseillaise</p>
              <p>- "La qualité au service de tous" -</p>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <div className="mt-8 text-center print:hidden">
          <button
            onClick={() => setShowPaymentModal(true)}
            disabled={!user}
            className={`px-8 py-4 rounded-lg font-medium text-lg transition-colors ${user
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            Confirmer le paiement - {totalTTC.toFixed(2)} €
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSubmit={handlePaymentSubmit}
        totalAmount={totalTTC}
      />
    </div>
  );
};

export default InvoicePage;
