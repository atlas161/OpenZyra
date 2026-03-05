import React, { useEffect } from 'react';
import { ArrowLeft, HelpCircle, Calculator, Filter, Clock, Phone, Users, FileQuestion, Lightbulb, Shield, Sparkles } from 'lucide-react';

interface DocumentationPageProps {
  onBack: () => void;
}

// Animated background component - Soft pastel blue gradient (matching LandingPage)
const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Base gradient - soft blue pastel */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-[#5087FF]/10 to-[#1F4597]/80" />
      
      {/* Animated gradient orbs */}
      <div 
        className="absolute -top-40 -left-40 w-[800px] h-[800px] rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(147,197,253,0.4) 0%, rgba(191,219,254,0.2) 50%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'float 25s ease-in-out infinite'
        }}
      />
      
      <div 
        className="absolute top-1/4 -right-32 w-[600px] h-[600px] rounded-full opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(165,180,252,0.4) 0%, rgba(199,210,254,0.2) 50%, transparent 70%)',
          filter: 'blur(70px)',
          animation: 'float 30s ease-in-out infinite reverse'
        }}
      />
      
      <div 
        className="absolute -bottom-40 left-1/3 w-[700px] h-[700px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(96,165,250,0.3) 0%, rgba(147,197,253,0.15) 50%, transparent 70%)',
          filter: 'blur(90px)',
          animation: 'float 35s ease-in-out infinite 5s'
        }}
      />
      
      {/* Subtle dot pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #3b82f6 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
      `}</style>
    </div>
  );
};

export const DocumentationPage: React.FC<DocumentationPageProps> = ({ onBack }) => {
  
  // S'assurer que le scroll est actif sur la page
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'unset';
  }, []);

  return (
    <div className="min-h-screen font-sans text-slate-700 relative">
      <AnimatedBackground />
      
      {/* Navbar - pastel blue theme */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[#5087FF]/30 shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
             <div className="flex items-center gap-3">
                <img src="/medias/OpenZyra.webp" alt="OpenZyra" width="192" height="40" className="h-10 w-auto" />
             </div>
             <button 
                onClick={onBack} 
                className="flex items-center gap-2 px-4 py-2 bg-[#1F4597] hover:bg-[#1F4597] text-white rounded-xl transition-all font-medium text-sm shadow-md hover:shadow-lg"
            >
                <ArrowLeft size={16} />
                <span className="hidden sm:inline">Retour à l'application</span>
                <span className="sm:hidden">Retour</span>
             </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-10">
        
        {/* Security Banner - 100% Client-side */}
        <div className="mb-8 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <Shield size={24} className="text-emerald-600" />
          </div>
          <div>
            <h3 className="font-semibold text-emerald-900 mb-1 flex items-center gap-2">
              <Sparkles size={16} className="text-emerald-600" />
              Application 100% Client-side
            </h3>
            <p className="text-sm text-emerald-700">
              Vos données ne quittent jamais votre ordinateur. OpenZyra fonctionne entièrement dans votre navigateur 
              sans serveur backend. Aucun fichier CSV n'est uploadé ou stocké sur un serveur externe.
            </p>
          </div>
        </div>

        {/* Section Concept Clé */}
        <section className="mb-12">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl shadow-blue-900/5 border border-[#5087FF]/30 overflow-hidden">
                <div className="bg-gradient-to-r from-[#5087FF] to-[#1F4597] px-8 py-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Filter size={28} className="text-white/80"/>
                        Procédure d'Analyse OpenZyra
                    </h2>
                </div>
                <div className="p-8 space-y-8 text-slate-700 leading-relaxed">
                    <div className="prose prose-blue max-w-none">
                        <p className="text-lg">
                            Objectif : Extraire les véritables indicateurs de performance (KPIs) de votre service client à partir d'un fichier brut, en excluant la pollution des appels hors horaires.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                            <div className="bg-[#5087FF]/10/80 p-5 rounded-xl border border-[#5087FF]/30 hover:shadow-md transition-shadow">
                                <h4 className="font-bold text-[#1F4597] flex items-center gap-2 mb-2"><Users size={18}/> La Session d'Appel</h4>
                                <p className="text-sm text-slate-600">Un seul appel physique d'un client génère de multiples lignes (menu, sonneries...). On regroupe toutes ces lignes pour reconstituer le parcours complet.</p>
                            </div>
                            <div className="bg-amber-50/80 p-5 rounded-xl border border-amber-200 hover:shadow-md transition-shadow">
                                <h4 className="font-bold text-amber-700 flex items-center gap-2 mb-2"><Clock size={18}/> La Plage Horaire</h4>
                                <p className="text-sm text-slate-600">Les indicateurs (attente, manqués) ne sont calculés que sur les heures d'ouverture. Le reste est classé "Hors Ouverture".</p>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">ÉTAPE 1 : Reconstituer les appels uniques</h3>
                        <p>
                            Nous isolons chaque appel client. En triant par numéro d'appelant et par chronologie, nous fusionnons les lignes qui se suivent à quelques secondes d'intervalle.
                            <br/><strong>Résultat :</strong> Un bloc de lignes représente désormais 1 Appel Unique (la Session).
                        </p>

                        <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">ÉTAPE 2 : Filtrer sur la ligne principale</h3>
                        <p>
                            On ne traite que les appels destinés aux clients. Si le <strong>Numéro Principal (NDI)</strong> apparaît dans le bloc, on garde l'appel. Sinon (ex: appel direct entre collègues), il est exclu.
                        </p>

                        <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">ÉTAPE 3 : Le filtre d'ouverture</h3>
                        <p>
                            On compare l'heure de début de l'appel avec vos horaires configurés.
                        </p>
                        <ul className="list-none pl-0 space-y-2">
                            <li className="flex items-center gap-2"><span className="text-amber-500">☀️</span> <strong>Pendant les horaires</strong> : L'équipe était censée être là.</li>
                            <li className="flex items-center gap-2"><span className="text-slate-400">🌙</span> <strong>Hors plages horaires</strong> : Le cabinet était fermé.</li>
                        </ul>

                        <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">ÉTAPE 4 : Déterminer le statut</h3>
                        <div className="space-y-4">
                            <div className="border-l-4 border-slate-300 pl-4 py-1">
                                <strong>🌙 Statut "Hors Ouverture"</strong><br/>
                                Concerne la pile "Hors plages horaires". Ce n'est pas un appel manqué, juste un appel reçu quand c'était fermé.
                            </div>
                            <div className="border-l-4 border-green-500 pl-4 py-1">
                                <strong>✅ Statut "Répondu"</strong><br/>
                                Concerne la pile "Pendant les horaires". Au moins un poste interne (SIP) a une <strong>durée supérieure à 0</strong> (l'équipe a décroché).
                            </div>
                            <div className="border-l-4 border-red-500 pl-4 py-1">
                                <strong>❌ Statut "Manqué" (Vrai abandon)</strong><br/>
                                Concerne la pile "Pendant les horaires". Tous les postes internes ont une durée de 0. Personne n'a pu prendre l'appel.
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">ÉTAPE 5 : Calculer le Temps d'Attente Réel</h3>
                        <p className="text-sm bg-yellow-50 p-3 rounded border border-yellow-100 mb-4">
                            ⚠️ S'applique UNIQUEMENT aux appels "Répondu" ou "Manqué". Les appels "Hors Ouverture" sont exclus (durée = 0).
                        </p>
                        <p>
                            La formule appliquée est :
                        </p>
                        <div className="bg-slate-900 text-white p-4 rounded-lg text-sm text-center my-4">
                            Temps Global (NDI) - Temps de Conversation (SIP) = Vrai Temps d'Attente
                        </div>
                        <p>
                            On prend la durée totale enregistrée sur le numéro principal (NDI) et on soustrait la durée cumulée de conversation sur les postes internes (SIP).
                        </p>
                    </div>
                </div>
            </div>
        </section>

        {/* Grille des définitions */}
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Calculator size={24} className="text-[#1F4597]" />
            Définitions des Indicateurs
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
             {/* Appels Totaux */}
             <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-[#5087FF]/30 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5087FF]/10 to-[#5087FF]/5 flex items-center justify-center">
                        <Phone size={24} className="text-[#1F4597]" />
                    </div>
                    <h4 className="font-bold text-lg text-slate-800">Appels Entrants</h4>
                </div>
                <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                    Nombre total de tentatives de contact uniques, peu importe le résultat ou l'heure.
                </p>
            </div>

            {/* Appels Traités */}
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-green-200 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                        <Users size={24} className="text-green-600" />
                    </div>
                    <h4 className="font-bold text-lg text-slate-800">Répondus (Groupe)</h4>
                </div>
                <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                    Appels ayant abouti à une conversation avec un humain (décroché sur poste SIP).
                </p>
                <div className="bg-green-50 p-3 rounded-lg text-xs text-green-800 border border-green-200">
                    Statut : <span className="font-bold">Répondu</span>
                </div>
            </div>

            {/* Appels Perdus */}
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-red-200 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-100 to-rose-100 flex items-center justify-center">
                        <Phone size={24} className="text-red-500 rotate-45" />
                    </div>
                    <h4 className="font-bold text-lg text-slate-800">Perdus (Vrais Manqués)</h4>
                </div>
                <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                     Un appel est <strong>Manqué</strong> si le numéro principal (NDI) a reçu l'appel <strong>dans les horaires d'ouverture</strong>, mais qu'aucune ligne interne (SIP) n'a décroché (aucune durée de conversation enregistrée sur un poste). <br/>
                     <em className="text-xs text-slate-500">Note: Une durée d'attente sur le NDI seul ne compte pas comme une réponse.</em>
                </p>
                <div className="bg-red-50 p-3 rounded-lg text-xs text-red-800 border border-red-200">
                    Statut : <span className="font-bold">Manqué</span>
                </div>
            </div>

             {/* Hors Ouverture */}
             <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-gray-100 flex items-center justify-center">
                        <Clock size={24} className="text-slate-500" />
                    </div>
                    <h4 className="font-bold text-lg text-slate-800">Hors Ouverture</h4>
                </div>
                <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                    Appels reçus en dehors des plages horaires configurées. Ils ne sont <strong>pas comptabilisés</strong> comme des appels manqués car le cabinet était fermé.
                </p>
                <div className="bg-slate-100 p-3 rounded-lg text-xs text-slate-600 border border-slate-200">
                    Statut : <span className="font-bold">Hors Ouverture</span>
                </div>
            </div>

            {/* Durée Moyenne d'Appel */}
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-[#5087FF]/30 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                        <Calculator size={24} className="text-[#1F4597]" />
                    </div>
                    <h4 className="font-bold text-lg text-slate-800">Durée Moyenne d'Appel</h4>
                </div>
                <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                    Moyenne de la durée de communication (sur les lignes SIP) pour l'ensemble des appels ayant abouti.
                </p>
                <div className="bg-[#5087FF]/10 p-3 rounded-lg text-xs text-[#1F4597] border border-[#5087FF]/30">
                    Calcul : Durée Totale / Appels Répondus
                </div>
            </div>

            {/* Temps d'Attente Moyen */}
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-orange-200 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                        <Clock size={24} className="text-orange-600" />
                    </div>
                    <h4 className="font-bold text-lg text-slate-800">Temps d'Attente Moyen</h4>
                </div>
                <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                    Temps moyen passé par l'appelant dans la file d'attente ou le serveur vocal (SVI). Ce temps correspond à la durée mesurée sur le ou les numéros principaux de type <strong>NDI</strong>.
                </p>
                <div className="bg-orange-50 p-3 rounded-lg text-xs text-orange-800 border border-orange-200">
                    Calcul : Σ (Durée sur NDI) / Appels Répondus
                </div>
            </div>
        </div>

        {/* FAQ Section */}
        <section>
             <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <FileQuestion size={24} className="text-[#1F4597]" />
                Foire Aux Questions
            </h3>
            
            <div className="space-y-4">
                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-[#5087FF]/30 shadow-md hover:shadow-lg transition-all">
                    <h5 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#5087FF]/10 flex items-center justify-center text-[#1F4597] text-xs">1</span>
                        Pourquoi mes chiffres sont différents de mon téléphone ?
                    </h5>
                    <p className="text-sm text-slate-600">
                        Les téléphones affichent souvent les "appels bruts". Si un appel sonne sur 3 postes, le téléphone voit 3 événements. OpenZyra consolide cela en 1 seul événement pour vous donner la vraie charge de travail.
                    </p>
                </div>

                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-[#5087FF]/30 shadow-md hover:shadow-lg transition-all">
                    <h5 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#5087FF]/10 flex items-center justify-center text-[#1F4597] text-xs">2</span>
                        Comment sont comptés les appels répétés ?
                    </h5>
                    <p className="text-sm text-slate-600">
                        Si un numéro appelle plusieurs fois d'affilée (avec moins de 30 minutes entre chaque tentative), cela est compté comme un seul incident. Si l'un des appels est décroché, l'ensemble est considéré comme "Répondu".
                    </p>
                </div>

                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-[#5087FF]/30 shadow-md hover:shadow-lg transition-all">
                    <h5 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#5087FF]/10 flex items-center justify-center text-[#1F4597] text-xs">3</span>
                        Comment est calculé le taux de réponse ?
                    </h5>
                    <p className="text-sm text-slate-600">
                        C'est simplement : <code className="bg-[#5087FF]/10 text-[#1F4597] px-2 py-0.5 rounded font-medium">Nombre d'appels répondus / Nombre d'appels totaux</code>. Cela représente l'efficacité pure de votre groupe à absorber le flux entrant.
                    </p>
                </div>

                 <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-[#5087FF]/30 shadow-md hover:shadow-lg transition-all">
                    <h5 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#5087FF]/10 flex items-center justify-center text-[#1F4597] text-xs">4</span>
                        Puis-je voir quel employé a décroché ?
                    </h5>
                    <p className="text-sm text-slate-600">
                        Oui, dans le tableau détaillé en bas de page, la colonne "Répondu Par" indique précisément quelle ligne du groupe a pris l'appel.
                    </p>
                </div>

                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-[#5087FF]/30 shadow-md hover:shadow-lg transition-all">
                    <h5 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#5087FF]/10 flex items-center justify-center text-[#1F4597] text-xs">5</span>
                        Mes données sont-elles sécurisées ?
                    </h5>
                    <p className="text-sm text-slate-600">
                        Absolument. OpenZyra est une application 100% frontend - tout le traitement se fait dans votre navigateur. Vos fichiers CSV ne sont jamais uploadés sur un serveur. 
                        <strong className="text-[#1F4597]"> Vos données restent sur votre ordinateur.</strong>
                    </p>
                </div>

                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-[#5087FF]/30 shadow-md hover:shadow-lg transition-all">
                    <h5 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#5087FF]/10 flex items-center justify-center text-[#1F4597] text-xs">6</span>
                        Que contient l'export ZIP complet ?
                    </h5>
                    <p className="text-sm text-slate-600">
                        Le bouton "Tout (ZIP)" génère une archive contenant : la configuration du projet (config.json), les données brutes CSV (données filtrées), et le rapport PDF complet avec les graphiques. C'est la sauvegarde complète de votre analyse.
                    </p>
                </div>
            </div>
        </section>

      </main>

       <footer className="bg-white/80 backdrop-blur-sm py-8 text-center border-t border-[#5087FF]/30 mt-12">
            <div className="flex items-center justify-center gap-2 mb-2">
                <img src="/medias/OpenZyra.webp" alt="OpenZyra" width="154" height="32" className="h-8 w-auto" />
            </div>
            <p className="text-slate-500 text-sm">Documentation Open Source - v3.0</p>
            <p className="text-slate-400 text-xs mt-1">100% Client-side • Vos données restent privées</p>
        </footer>
    </div>
  );
};
