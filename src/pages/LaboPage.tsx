const LaboPage = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-gray-50">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-70" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-100 rounded-full blur-3xl opacity-70" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16">
          {/* Header */}
          <div className="text-center">
            <span className="inline-block text-xs font-semibold tracking-wider uppercase text-blue-700 bg-blue-100 px-3 py-1 rounded-full mb-4">
              Qualité, Précision, Confidentialité
            </span>
            <h1 className="text-4xl sm:text-4xl font-bold text-gray-900 mb-4">
              Laboratoire d'analyse et d'expérimentations
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Analyses fiables, délais rapides et accompagnement par des
              experts. Prenez rendez-vous pour vos prélèvements et tests avec un
              suivi personnalisé.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#appointment"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
              >
                Prendre rendez-vous
              </a>
              <a
                href="#services"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-gray-900 font-medium border border-gray-200 hover:border-gray-300 shadow-sm"
              >
                Voir nos services
              </a>
            </div>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="rounded-xl bg-white shadow-sm border border-gray-100 p-4">
                <div className="text-2xl font-bold text-gray-900">10k+</div>
                <div className="text-sm text-gray-500">Analyses réalisées</div>
              </div>
              <div className="rounded-xl bg-white shadow-sm border border-gray-100 p-4">
                <div className="text-2xl font-bold text-gray-900">24-48h</div>
                <div className="text-sm text-gray-500">Délais de résultats</div>
              </div>
              <div className="rounded-xl bg-white shadow-sm border border-gray-100 p-4">
                <div className="text-2xl font-bold text-gray-900">100%</div>
                <div className="text-sm text-gray-500">Confidentialité</div>
              </div>
              <div className="rounded-xl bg-white shadow-sm border border-gray-100 p-4">
                <div className="text-2xl font-bold text-gray-900">ISO</div>
                <div className="text-sm text-gray-500">Normes de qualité</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Nos services</h2>
            <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
              Un panel complet d'analyses et d'expérimentations pour répondre
              aux besoins des particuliers, entreprises et chercheurs.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group rounded-2xl bg-white border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
              <div className="h-12 w-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-700 font-semibold">
                A1
              </div>
              <h3 className="mt-4 font-semibold text-lg text-gray-900">
                Analyses biologiques
              </h3>
              <p className="mt-2 text-gray-600">
                Hématologie, biochimie, sérologie, microbiologie, parasitologie
                et plus.
              </p>
              <div className="mt-4 text-sm text-blue-700 font-medium">
                En savoir plus →
              </div>
            </div>
            <div className="group rounded-2xl bg-white border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
              <div className="h-12 w-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-700 font-semibold">
                A2
              </div>
              <h3 className="mt-4 font-semibold text-lg text-gray-900">
                Tests environnementaux
              </h3>
              <p className="mt-2 text-gray-600">
                Analyse d'eau, air, sols, surfaces et contrôle d'hygiène.
              </p>
              <div className="mt-4 text-sm text-blue-700 font-medium">
                En savoir plus →
              </div>
            </div>
            <div className="group rounded-2xl bg-white border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
              <div className="h-12 w-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-700 font-semibold">
                A3
              </div>
              <h3 className="mt-4 font-semibold text-lg text-gray-900">
                R&D et prototypage
              </h3>
              <p className="mt-2 text-gray-600">
                Expérimentations scientifiques, tests de matériaux, mise au
                point de procédés.
              </p>
              <div className="mt-4 text-sm text-blue-700 font-medium">
                En savoir plus →
              </div>
            </div>
            <div className="group rounded-2xl bg-white border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
              <div className="h-12 w-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-700 font-semibold">
                A4
              </div>
              <h3 className="mt-4 font-semibold text-lg text-gray-900">
                Contrôle qualité
              </h3>
              <p className="mt-2 text-gray-600">
                Validation de lots, conformité réglementaire, traçabilité et
                rapports.
              </p>
              <div className="mt-4 text-sm text-blue-700 font-medium">
                En savoir plus →
              </div>
            </div>
            <div className="group rounded-2xl bg-white border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
              <div className="h-12 w-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-700 font-semibold">
                A5
              </div>
              <h3 className="mt-4 font-semibold text-lg text-gray-900">
                Analyses alimentaires
              </h3>
              <p className="mt-2 text-gray-600">
                Sécurité, composition, allergènes et durabilité des produits.
              </p>
              <div className="mt-4 text-sm text-blue-700 font-medium">
                En savoir plus →
              </div>
            </div>
            <div className="group rounded-2xl bg-white border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
              <div className="h-12 w-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-700 font-semibold">
                A6
              </div>
              <h3 className="mt-4 font-semibold text-lg text-gray-900">
                Conseil et interprétation
              </h3>
              <p className="mt-2 text-gray-600">
                Restitution claire des résultats et recommandations par des
                experts.
              </p>
              <div className="mt-4 text-sm text-blue-700 font-medium">
                En savoir plus →
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-xl border border-gray-200 p-6 text-center">
              <div className="text-xl font-semibold text-gray-900">
                Équipe experte
              </div>
              <div className="text-gray-600 mt-1">
                Ingénieurs et biologistes qualifiés
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 p-6 text-center">
              <div className="text-xl font-semibold text-gray-900">
                Technologies avancées
              </div>
              <div className="text-gray-600 mt-1">
                Instrumentation de pointe
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 p-6 text-center">
              <div className="text-xl font-semibold text-gray-900">
                Traçabilité
              </div>
              <div className="text-gray-600 mt-1">
                Processus sécurisés et auditables
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 p-6 text-center">
              <div className="text-xl font-semibold text-gray-900">
                Support réactif
              </div>
              <div className="text-gray-600 mt-1">
                Assistance du lundi au samedi
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Comment ça marche
            </h2>
            <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
              Un parcours simple, rapide et transparent.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="rounded-2xl bg-white border border-gray-200 p-6 text-center">
              <div className="mx-auto h-10 w-10 rounded-full bg-blue-600/10 text-blue-700 flex items-center justify-center font-semibold">
                1
              </div>
              <div className="mt-4 font-semibold text-gray-900">Demande</div>
              <div className="text-gray-600 text-sm">
                Choisissez un service et une date
              </div>
            </div>
            <div className="rounded-2xl bg-white border border-gray-200 p-6 text-center">
              <div className="mx-auto h-10 w-10 rounded-full bg-blue-600/10 text-blue-700 flex items-center justify-center font-semibold">
                2
              </div>
              <div className="mt-4 font-semibold text-gray-900">
                Prélèvement
              </div>
              <div className="text-gray-600 text-sm">Au labo ou sur site</div>
            </div>
            <div className="rounded-2xl bg-white border border-gray-200 p-6 text-center">
              <div className="mx-auto h-10 w-10 rounded-full bg-blue-600/10 text-blue-700 flex items-center justify-center font-semibold">
                3
              </div>
              <div className="mt-4 font-semibold text-gray-900">Analyse</div>
              <div className="text-gray-600 text-sm">Avec contrôle qualité</div>
            </div>
            <div className="rounded-2xl bg-white border border-gray-200 p-6 text-center">
              <div className="mx-auto h-10 w-10 rounded-full bg-blue-600/10 text-blue-700 flex items-center justify-center font-semibold">
                4
              </div>
              <div className="mt-4 font-semibold text-gray-900">Résultats</div>
              <div className="text-gray-600 text-sm">
                Rapport et recommandations
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="appointment" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10">
            <div className="">
              <h2 className="text-3xl font-bold text-gray-900">
                Prendre rendez-vous
              </h2>
              <p className="mt-2 text-gray-600">
                Remplissez le formulaire et nous vous confirmerons votre
                rendez-vous par email.
              </p>
              <div className="mt-6 rounded-2xl border border-gray-200 p-6">
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
                      Type d'analyse
                    </label>
                    <select
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      required
                    >
                      <option value="">Sélectionner</option>
                      <option>Biologique</option>
                      <option>Environnementale</option>
                      <option>Alimentaire</option>
                      <option>R&D / Expérimentation</option>
                      <option>Contrôle qualité</option>
                    </select>
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Date souhaitée
                    </label>
                    <input
                      type="date"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Créneau horaire
                    </label>
                    <input
                      type="time"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Message
                    </label>
                    <textarea
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      rows={4}
                      placeholder="Précisez votre besoin (facultatif)"
                    />
                  </div>
                  <div className="sm:col-span-2 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      Nous respectons la confidentialité de vos données.
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
            <div className="">
              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                <img
                  src="/images/pexels-chokniti-khongchum-1197604-2280571.jpg"
                  alt="Laboratoire"
                  className="w-full h-72 object-cover"
                />
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-gray-50 p-4">
                      <div className="text-2xl font-bold text-gray-900">
                        +20
                      </div>
                      <div className="text-sm text-gray-600">
                        Techniciens & ingénieurs
                      </div>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-4">
                      <div className="text-2xl font-bold text-gray-900">
                        +50
                      </div>
                      <div className="text-sm text-gray-600">
                        Paramètres analysés
                      </div>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-4">
                      <div className="text-2xl font-bold text-gray-900">
                        6j/7
                      </div>
                      <div className="text-sm text-gray-600">Disponibilité</div>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-4">
                      <div className="text-2xl font-bold text-gray-900">
                        24h
                      </div>
                      <div className="text-sm text-gray-600">Urgences</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 grid sm:grid-cols-3 gap-4">
                <div className="rounded-xl border border-gray-200 p-4 text-center">
                  <div className="text-sm font-semibold text-gray-900">
                    Horaires
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Lun - Sam: 08:00 - 18:00
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 p-4 text-center">
                  <div className="text-sm font-semibold text-gray-900">
                    Téléphone
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    +33 1 23 45 67 89
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 p-4 text-center">
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

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Analyses populaires
            </h2>
            <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
              Des forfaits clairs pour les besoins les plus fréquents. Demandez
              un devis pour des besoins spécifiques.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
              <div className="text-sm font-semibold text-blue-700">
                Biologie
              </div>
              <div className="mt-2 text-xl font-semibold text-gray-900">
                Bilan standard
              </div>
              <div className="mt-1 text-3xl font-bold text-gray-900">49€</div>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>Hémogramme</li>
                <li>Glycémie</li>
                <li>Bilan lipidique</li>
              </ul>
              <a
                href="#appointment"
                className="mt-6 inline-flex items-center justify-center w-full px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
              >
                Choisir
              </a>
            </div>
            <div className="rounded-2xl bg-white border-2 border-blue-600 p-6 shadow-md">
              <div className="text-sm font-semibold text-blue-700">
                Environnement
              </div>
              <div className="mt-2 text-xl font-semibold text-gray-900">
                Analyse d'eau
              </div>
              <div className="mt-1 text-3xl font-bold text-gray-900">79€</div>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>Paramètres physico-chimiques</li>
                <li>Microbiologie</li>
                <li>Rapport détaillé</li>
              </ul>
              <a
                href="#appointment"
                className="mt-6 inline-flex items-center justify-center w-full px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
              >
                Choisir
              </a>
            </div>
            <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
              <div className="text-sm font-semibold text-blue-700">
                Agroalimentaire
              </div>
              <div className="mt-2 text-xl font-semibold text-gray-900">
                Sécurité alimentaire
              </div>
              <div className="mt-1 text-3xl font-bold text-gray-900">99€</div>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>Allergènes</li>
                <li>Microbiologie</li>
                <li>Etiquetage nutritionnel</li>
              </ul>
              <a
                href="#appointment"
                className="mt-6 inline-flex items-center justify-center w-full px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
              >
                Choisir
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Ils nous font confiance
              </h2>
              <p className="mt-2 text-gray-600">
                Des clients satisfaits par la qualité de nos services et la
                clarté de nos rapports.
              </p>
              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-gray-200 p-5">
                  <div className="text-gray-900 font-medium">
                    Service rapide et fiable
                  </div>
                  <div className="text-gray-600 mt-1 text-sm">
                    Résultats en moins de 24h pour une urgence. Équipe très
                    professionnelle.
                  </div>
                  <div className="mt-2 text-sm text-gray-500">— A. Martin</div>
                </div>
                <div className="rounded-xl border border-gray-200 p-5">
                  <div className="text-gray-900 font-medium">
                    Rapports clairs
                  </div>
                  <div className="text-gray-600 mt-1 text-sm">
                    Interprétation pédagogique et recommandations actionnables.
                  </div>
                  <div className="mt-2 text-sm text-gray-500">— B. Dupont</div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">FAQ</h2>
              <div className="mt-4 divide-y divide-gray-200 rounded-2xl border border-gray-200 overflow-hidden">
                <details className="p-5 open:bg-gray-50">
                  <summary className="cursor-pointer font-medium text-gray-900">
                    Comment recevoir mes résultats ?
                  </summary>
                  <div className="mt-2 text-gray-600 text-sm">
                    Vous recevez un lien sécurisé par email ainsi qu'un rapport
                    PDF.
                  </div>
                </details>
                <details className="p-5 open:bg-gray-50">
                  <summary className="cursor-pointer font-medium text-gray-900">
                    Proposez-vous des interventions sur site ?
                  </summary>
                  <div className="mt-2 text-gray-600 text-sm">
                    Oui, nos équipes peuvent se déplacer pour les prélèvements
                    et audits.
                  </div>
                </details>
                <details className="p-5 open:bg-gray-50">
                  <summary className="cursor-pointer font-medium text-gray-900">
                    Puis-je avoir un devis personnalisé ?
                  </summary>
                  <div className="mt-2 text-gray-600 text-sm">
                    Bien sûr, décrivez votre besoin via le formulaire et nous
                    revenons vers vous.
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12">
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
      </footer>
    </div>
  );
};

export default LaboPage;
