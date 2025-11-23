import {
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle,
  Layers,
  Quote,
  Server,
  Settings,
  Star,
  Wrench,
} from "lucide-react";

const BureauPage = () => {
  return (
    <div
      className="min-h-full bg-gray-50"
      style={{ minHeight: "calc(100vh - 64px)" }}
    >
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-100 rounded-full blur-3xl opacity-60" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 text-sm text-gray-700 shadow-sm">
              <Briefcase className="h-4 w-4 text-blue-700" />
              Bureau d'études & Services
            </div>
            <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900">
              Concevoir. Dimensionner. Déployer.
            </h1>
            <p className="mt-3 text-lg sm:text-xl text-gray-600">
              De l'idée à la mise en production: études, dimensionnement
              d'infrastructures, développement logiciel et intégration.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#dimensionnement"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
              >
                Demander une prestation
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <a
                href="#services"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-gray-900 font-medium border border-gray-200 hover:border-gray-300 shadow-sm"
              >
                Voir nos services
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Nos prestations
            </h2>
            <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
              Un panel de services pour accélérer vos projets techniques et
              garantir la fiabilité de vos infrastructures.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group rounded-2xl bg-white border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
              <div className="h-12 w-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-700">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-lg text-gray-900">
                Études & conception
              </h3>
              <p className="mt-2 text-gray-600">
                Cadrage, architecture, modélisation et spécifications
                techniques.
              </p>
              <div className="mt-4 text-sm text-blue-700 font-medium">
                En savoir plus →
              </div>
            </div>

            <div className="group rounded-2xl bg-white border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
              <div className="h-12 w-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-700">
                <Server className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-lg text-gray-900">
                Dimensionnement d'infrastructure
              </h3>
              <p className="mt-2 text-gray-600">
                Réseaux, systèmes, cloud, data center, observabilité et
                sécurité.
              </p>
              <div className="mt-4 text-sm text-blue-700 font-medium">
                Calculs, sizing et BOM →
              </div>
            </div>

            <div className="group rounded-2xl bg-white border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
              <div className="h-12 w-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-700">
                <Wrench className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-lg text-gray-900">
                Dév. logiciel & web
              </h3>
              <p className="mt-2 text-gray-600">
                Applications web, API, intégrations, e-commerce et outils
                métiers.
              </p>
              <div className="mt-4 text-sm text-blue-700 font-medium">
                Stack moderne & CI/CD →
              </div>
            </div>

            <div className="group rounded-2xl bg-white border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
              <div className="h-12 w-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-700">
                <Settings className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-lg text-gray-900">
                Cloud & DevOps
              </h3>
              <p className="mt-2 text-gray-600">
                Conteneurs, IaC, pipelines, supervision et optimisation des
                coûts.
              </p>
              <div className="mt-4 text-sm text-blue-700 font-medium">
                AWS, Azure, GCP →
              </div>
            </div>

            <div className="group rounded-2xl bg-white border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
              <div className="h-12 w-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-700">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-lg text-gray-900">
                IoT & systèmes embarqués
              </h3>
              <p className="mt-2 text-gray-600">
                Capteurs, gateways, télémétrie, dashboards et maintenance.
              </p>
              <div className="mt-4 text-sm text-blue-700 font-medium">
                Du prototype au déploiement →
              </div>
            </div>

            <div className="group rounded-2xl bg-white border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
              <div className="h-12 w-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-700">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-lg text-gray-900">
                Cybersécurité & audit
              </h3>
              <p className="mt-2 text-gray-600">
                Hardening, tests d'intrusion, conformité et sensibilisation.
              </p>
              <div className="mt-4 text-sm text-blue-700 font-medium">
                Mesures & priorisation →
              </div>
            </div>
          </div>

          {/* Atouts */}
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-xl border border-gray-200 p-6 text-center">
              <div className="text-xl font-semibold text-gray-900">+120</div>
              <div className="text-gray-600 mt-1">Projets livrés</div>
            </div>
            <div className="rounded-xl border border-gray-200 p-6 text-center">
              <div className="text-xl font-semibold text-gray-900">98%</div>
              <div className="text-gray-600 mt-1">Clients satisfaits</div>
            </div>
            <div className="rounded-xl border border-gray-200 p-6 text-center">
              <div className="text-xl font-semibold text-gray-900">20+</div>
              <div className="text-gray-600 mt-1">Experts</div>
            </div>
            <div className="rounded-xl border border-gray-200 p-6 text-center">
              <div className="text-xl font-semibold text-gray-900">10</div>
              <div className="text-gray-600 mt-1">Pays couverts</div>
            </div>
          </div>
        </div>
      </section>

      {/* Processus */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Comment ça marche
            </h2>
            <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
              Un parcours clair, rapide et collaboratif.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="rounded-2xl bg-white border border-gray-200 p-6 text-center">
              <div className="mx-auto h-10 w-10 rounded-full bg-blue-600/10 text-blue-700 flex items-center justify-center font-semibold">
                1
              </div>
              <div className="mt-4 font-semibold text-gray-900">
                Expression du besoin
              </div>
              <div className="text-gray-600 text-sm">
                Cadrage, objectifs et contraintes
              </div>
            </div>
            <div className="rounded-2xl bg-white border border-gray-200 p-6 text-center">
              <div className="mx-auto h-10 w-10 rounded-full bg-blue-600/10 text-blue-700 flex items-center justify-center font-semibold">
                2
              </div>
              <div className="mt-4 font-semibold text-gray-900">
                Études & dimensionnement
              </div>
              <div className="text-gray-600 text-sm">
                Architecture cible et chiffrage
              </div>
            </div>
            <div className="rounded-2xl bg-white border border-gray-200 p-6 text-center">
              <div className="mx-auto h-10 w-10 rounded-full bg-blue-600/10 text-blue-700 flex items-center justify-center font-semibold">
                3
              </div>
              <div className="mt-4 font-semibold text-gray-900">
                Implémentation
              </div>
              <div className="text-gray-600 text-sm">
                Build, intégration, tests
              </div>
            </div>
            <div className="rounded-2xl bg-white border border-gray-200 p-6 text-center">
              <div className="mx-auto h-10 w-10 rounded-full bg-blue-600/10 text-blue-700 flex items-center justify-center font-semibold">
                4
              </div>
              <div className="mt-4 font-semibold text-gray-900">
                Transition & support
              </div>
              <div className="text-gray-600 text-sm">
                Run, documentation et transfert
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dimensionnement - Formulaire */}
      <section id="dimensionnement" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Demande de dimensionnement
              </h2>
              <p className="mt-2 text-gray-600">
                Remplissez ce formulaire, nous revenons vers vous avec une
                proposition technique et un chiffrage.
              </p>
              <div className="mt-6 rounded-2xl border border-gray-200 p-6 bg-white">
                <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="nom@exemple.com"
                      required
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="Ex: +33 6 12 34 56 78"
                      required
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Type d'infrastructure
                    </label>
                    <select
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      required
                    >
                      <option value="">Sélectionner</option>
                      <option>Réseau</option>
                      <option>Système</option>
                      <option>Cloud</option>
                      <option>Data center</option>
                      <option>Logiciel</option>
                    </select>
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Budget estimatif
                    </label>
                    <input
                      type="text"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="Ex: 10 000 €"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Délai souhaité
                    </label>
                    <input
                      type="text"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="Ex: 8 semaines"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Description du besoin
                    </label>
                    <textarea
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      rows={4}
                      placeholder="Contexte, volume, SLA, contraintes..."
                    />
                  </div>
                  <div className="sm:col-span-2 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      Vos données restent confidentielles et ne sont jamais
                      partagées.
                    </p>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                    >
                      Envoyer la demande
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div>
              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white">
                <img
                  src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1600&auto=format&fit=crop"
                  alt="Architecture et infrastructure"
                  className="w-full h-72 object-cover"
                />
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-gray-50 p-4">
                      <div className="text-2xl font-bold text-gray-900">
                        +30%
                      </div>
                      <div className="text-sm text-gray-600">
                        Coûts optimisés
                      </div>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-4">
                      <div className="text-2xl font-bold text-gray-900">
                        99.9%
                      </div>
                      <div className="text-sm text-gray-600">Disponibilité</div>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-4">
                      <div className="text-2xl font-bold text-gray-900">x2</div>
                      <div className="text-sm text-gray-600">
                        Vitesse de déploiement
                      </div>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-4">
                      <div className="text-2xl font-bold text-gray-900">
                        -40%
                      </div>
                      <div className="text-sm text-gray-600">
                        Incidents majeurs
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 grid sm:grid-cols-3 gap-4">
                <div className="rounded-xl border border-gray-200 p-4 text-center bg-white">
                  <div className="text-sm font-semibold text-gray-900">
                    Horaires
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Lun - Sam: 08:00 - 18:00
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 p-4 text-center bg-white">
                  <div className="text-sm font-semibold text-gray-900">
                    Téléphone
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    +33 1 23 45 67 89
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 p-4 text-center bg-white">
                  <div className="text-sm font-semibold text-gray-900">
                    Adresse
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Paris, France
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Réalisations & témoignages */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Réalisations récentes
            </h2>
            <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
              Quelques cas concrets livrés avec résultats mesurables.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Case 1 */}
            <div className="rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1600&auto=format&fit=crop"
                alt="Datacenter entreprise"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="text-sm font-semibold text-blue-700">
                  Data center
                </div>
                <div className="mt-1 text-lg font-semibold text-gray-900">
                  Modernisation SI d'une PME
                </div>
                <ul className="mt-3 space-y-1 text-sm text-gray-600">
                  <li>• Migration vers une architecture hyperconvergée</li>
                  <li>• Supervision centralisée et PRA</li>
                  <li>• -25% coûts d'exploitation</li>
                </ul>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                  <span>Client: AURATECH</span>
                  <span>Secteur: Industrie</span>
                </div>
                <div className="mt-4 flex items-center gap-1 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <div className="mt-3 text-sm text-gray-700 italic flex items-start gap-2">
                  <Quote className="h-4 w-4 text-gray-400 mt-0.5" />
                  "Accompagnement exemplaire et résultats au rendez-vous."
                </div>
              </div>
            </div>

            {/* Case 2 */}
            <div className="rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1600&auto=format&fit=crop"
                alt="Application web"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="text-sm font-semibold text-blue-700">
                  Développement
                </div>
                <div className="mt-1 text-lg font-semibold text-gray-900">
                  Portail e-commerce B2B
                </div>
                <ul className="mt-3 space-y-1 text-sm text-gray-600">
                  <li>• Architecture microservices</li>
                  <li>• CI/CD et monitoring</li>
                  <li>• +45% CA en 6 mois</li>
                </ul>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                  <span>Client: NEXA</span>
                  <span>Secteur: Distribution</span>
                </div>
                <div className="mt-4 flex items-center gap-1 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <div className="mt-3 text-sm text-gray-700 italic flex items-start gap-2">
                  <Quote className="h-4 w-4 text-gray-400 mt-0.5" />
                  "Livraison rapide, code propre et très bonne communication."
                </div>
              </div>
            </div>

            {/* Case 3 */}
            <div className="rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1600&auto=format&fit=crop"
                alt="Déploiement réseau"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="text-sm font-semibold text-blue-700">
                  Réseaux
                </div>
                <div className="mt-1 text-lg font-semibold text-gray-900">
                  Déploiement Wi-Fi multisite
                </div>
                <ul className="mt-3 space-y-1 text-sm text-gray-600">
                  <li>• Audit RF et plan de couverture</li>
                  <li>• NAC et segmentation</li>
                  <li>• +70% satisfaction utilisateurs</li>
                </ul>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                  <span>Client: OCEALIA</span>
                  <span>Secteur: Services</span>
                </div>
                <div className="mt-4 flex items-center gap-1 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <div className="mt-3 text-sm text-gray-700 italic flex items-start gap-2">
                  <Quote className="h-4 w-4 text-gray-400 mt-0.5" />
                  "Exécution maîtrisée et support réactif."
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Offres populaires */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Offres populaires
            </h2>
            <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
              Des packs clairs et actionnables. Contactez-nous pour un devis
              personnalisé.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
              <div className="text-sm font-semibold text-blue-700">Web</div>
              <div className="mt-2 text-xl font-semibold text-gray-900">
                Site vitrine
              </div>
              <div className="mt-1 text-3xl font-bold text-gray-900">990€</div>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>Design responsive</li>
                <li>SEO de base</li>
                <li>Formulaire de contact</li>
              </ul>
              <a
                href="#dimensionnement"
                className="mt-6 inline-flex items-center justify-center w-full px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
              >
                Commander
              </a>
            </div>

            <div className="rounded-2xl bg-white border-2 border-blue-600 p-6 shadow-md">
              <div className="text-sm font-semibold text-blue-700">Réseaux</div>
              <div className="mt-2 text-xl font-semibold text-gray-900">
                Déploiement PME
              </div>
              <div className="mt-1 text-3xl font-bold text-gray-900">
                2 900€
              </div>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>Audit et plan d'adressage</li>
                <li>Switching & Wi‑Fi managé</li>
                <li>Documentation et transfert</li>
              </ul>
              <a
                href="#dimensionnement"
                className="mt-6 inline-flex items-center justify-center w-full px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
              >
                Commander
              </a>
            </div>

            <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
              <div className="text-sm font-semibold text-blue-700">Cloud</div>
              <div className="mt-2 text-xl font-semibold text-gray-900">
                Migration Cloud
              </div>
              <div className="mt-1 text-3xl font-bold text-gray-900">
                Sur devis
              </div>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>Évaluation de charge</li>
                <li>Architecture cible & IaC</li>
                <li>Optimisation des coûts</li>
              </ul>
              <a
                href="#dimensionnement"
                className="mt-6 inline-flex items-center justify-center w-full px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
              >
                Commander
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Ils nous font confiance
              </h2>
              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-gray-200 p-5 bg-white">
                  <div className="text-gray-900 font-medium">
                    Exécution de bout en bout
                  </div>
                  <div className="text-gray-600 mt-1 text-sm">
                    Pilotage clair, jalons respectés et documentation complète.
                  </div>
                  <div className="mt-2 text-sm text-gray-500">— C. Bernard</div>
                </div>
                <div className="rounded-xl border border-gray-200 p-5 bg-white">
                  <div className="text-gray-900 font-medium">
                    Expertise & pédagogie
                  </div>
                  <div className="text-gray-600 mt-1 text-sm">
                    Une équipe technique accessible et très orientée résultats.
                  </div>
                  <div className="mt-2 text-sm text-gray-500">— S. Diallo</div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">FAQ</h2>
              <div className="mt-4 divide-y divide-gray-200 rounded-2xl border border-gray-200 overflow-hidden bg-white">
                <details className="p-5 open:bg-gray-50">
                  <summary className="cursor-pointer font-medium text-gray-900">
                    Combien de temps pour une étude ?
                  </summary>
                  <div className="mt-2 text-gray-600 text-sm">
                    Selon l'ampleur, entre 1 et 4 semaines. Les urgences sont
                    possibles.
                  </div>
                </details>
                <details className="p-5 open:bg-gray-50">
                  <summary className="cursor-pointer font-medium text-gray-900">
                    Faites-vous des forfaits ?
                  </summary>
                  <div className="mt-2 text-gray-600 text-sm">
                    Oui, pour des besoins standards. Pour du spécifique, nous
                    réalisons un devis.
                  </div>
                </details>
                <details className="p-5 open:bg-gray-50">
                  <summary className="cursor-pointer font-medium text-gray-900">
                    Intervention sur site ?
                  </summary>
                  <div className="mt-2 text-gray-600 text-sm">
                    Possible selon la localisation. Nous opérons aussi à
                    distance.
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-xl bg-gray-100 p-5">
              <div className="text-sm text-gray-500">Contact</div>
              <div className="mt-1 text-gray-900 font-medium">
                contact@the7e.com
              </div>
            </div>
            <div className="rounded-xl bg-gray-100 p-5">
              <div className="text-sm text-gray-500">Téléphone</div>
              <div className="mt-1 text-gray-900 font-medium">
                +33 1 23 45 67 89
              </div>
            </div>
            <div className="rounded-xl bg-gray-100 p-5">
              <div className="text-sm text-gray-500">Adresse</div>
              <div className="mt-1 text-gray-900 font-medium">
                Paris, France
              </div>
            </div>
            <div className="rounded-xl bg-gray-100 p-5">
              <div className="text-sm text-gray-500">Disponibilité</div>
              <div className="mt-1 text-gray-900 font-medium">
                Lun - Sam: 08:00 - 18:00
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BureauPage;
