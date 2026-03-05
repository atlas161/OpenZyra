import React, { useEffect } from 'react';
import { XCircle, HelpCircle, Calculator, Filter, Clock, Phone, Users } from 'lucide-react';

interface DocumentationModalProps {
  onClose: () => void;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({ onClose }) => {
  
  // Bloquer le scroll de l'arrière-plan à l'ouverture
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Modal */}
        <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <HelpCircle size={24} className="text-violet-400" />
            <div>
                <h2 className="text-xl font-bold">Comprendre vos Statistiques OpenZyra</h2>
                <p className="text-slate-400 text-xs">Glossaire et méthodologie de calcul OpenZyra</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition"><XCircle size={24} /></button>
        </div>
        
        {/* Content Scrollable */}
        <div className="p-8 overflow-y-auto space-y-8 text-slate-700">
            
            {/* Introduction sur le concept clé */}
            <div className="bg-violet-50 border border-violet-100 rounded-xl p-5">
                <h3 className="flex items-center gap-2 text-violet-800 font-bold text-lg mb-2">
                    <Filter size={20} />
                    Le Concept de "Session d'Appel" (Dédoublonnage)
                </h3>
                <p className="text-sm leading-relaxed text-violet-900">
                    Les fichiers bruts contiennent souvent plusieurs lignes pour un seul coup de fil (ex: ça sonne sur le poste A, puis le B, puis le C). 
                    Si nous comptions bêtement les lignes, vous auriez 3 appels.
                    <br/><br/>
                    <strong>Notre algorithme regroupe ces lignes :</strong> Si le même numéro appelle plusieurs fois ou fait sonner plusieurs lignes dans un intervalle de <strong>2 minutes</strong>, nous considérons qu'il s'agit d'une seule et même "Tentative d'appel" (Session).
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Appels Totaux */}
                <div className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                    <h4 className="flex items-center gap-2 font-bold text-slate-900 mb-3">
                        <Phone size={18} className="text-violet-500" />
                        Appels Totaux (Uniques)
                    </h4>
                    <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-semibold">Définition</p>
                    <p className="text-sm mb-4">C'est le nombre de visiteurs uniques (sessions) qui ont tenté de joindre votre entreprise sur la période donnée.</p>
                    
                    <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-semibold">Calcul</p>
                    <code className="block bg-slate-100 p-2 rounded text-xs text-slate-600">
                        Total des sessions uniques après dédoublonnage.
                    </code>
                </div>

                {/* Appels Traités */}
                <div className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                    <h4 className="flex items-center gap-2 font-bold text-slate-900 mb-3">
                        <Users size={18} className="text-green-600" />
                        Appels OpenZyra Répondus (Groupe)
                    </h4>
                    <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-semibold">Définition</p>
                    <p className="text-sm mb-4">Un appel est considéré comme "OpenZyra Répondu" si <strong>au moins une</strong> des lignes configurées dans votre groupe a décroché.</p>
                    
                    <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-semibold">Note Importante</p>
                    <p className="text-xs bg-green-50 text-green-800 p-2 rounded">
                        Si un appel sonne sur 3 postes du secrétariat et que le poste n°2 décroche, l'appel est compté comme 1 succès pour le groupe entier.
                    </p>
                </div>

                {/* Appels Perdus */}
                <div className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                    <h4 className="flex items-center gap-2 font-bold text-slate-900 mb-3">
                        <Phone size={18} className="text-red-500 rotate-45" />
                        Appels Perdus (Manqués)
                    </h4>
                    <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-semibold">Définition</p>
                    <p className="text-sm mb-4">Un appel est "Perdu" uniquement si <strong>aucune</strong> ligne du groupe n'a décroché avant que l'appelant ne raccroche ou ne tombe sur messagerie.</p>
                    
                    <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-semibold">Calcul</p>
                    <code className="block bg-slate-100 p-2 rounded text-xs text-slate-600">
                        Nb Appels Totaux - Nb Appels OpenZyra Répondus
                    </code>
                </div>

                 {/* Durée */}
                 <div className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                    <h4 className="flex items-center gap-2 font-bold text-slate-900 mb-3">
                        <Clock size={18} className="text-purple-500" />
                        Durée Totale
                    </h4>
                    <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-semibold">Définition</p>
                    <p className="text-sm mb-4">C'est le temps de communication cumulé (parlé) de tous les appels répondus.</p>
                    
                    <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-semibold">Précision</p>
                    <p className="text-sm text-slate-600">
                        Le temps de sonnerie n'est pas inclus. Seul le temps "décroché" est comptabilisé.
                    </p>
                </div>
            </div>

            {/* Footer FAQ */}
            <div className="bg-slate-50 p-6 rounded-xl mt-4">
                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Calculator size={18} />
                    Foire Aux Questions
                </h4>
                <div className="space-y-4">
                    <div>
                        <p className="text-sm font-bold text-slate-700">Pourquoi j'ai 100 lignes dans mon CSV mais seulement 80 appels ici ?</p>
                        <p className="text-sm text-slate-600">C'est normal. C'est l'effet du dédoublonnage. Si Mme Michu appelle 3 fois de suite en 1 minute parce qu'elle s'impatiente, nous comptons cela comme 1 seule intention d'appel (Session), pour ne pas fausser vos statistiques de performance.</p>
                    </div>
                    <div className="border-t border-slate-200 pt-4">
                        <p className="text-sm font-bold text-slate-700">Le taux de décroché est-il fiable ?</p>
                        <p className="text-sm text-slate-600">Oui, il représente la capacité réelle de votre équipe à absorber le flux. Formule : (Appels OpenZyra Répondus / Appels Totaux) * 100.</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="p-4 border-t bg-gray-50 flex justify-end">
            <button onClick={onClose} className="px-6 py-2 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-900 transition shadow-sm">
                J'ai compris
            </button>
        </div>
      </div>
    </div>
  );
};
