import React from 'react';
import { Scale, FileText, Github, ExternalLink } from 'lucide-react';

interface LegalPageProps {
  onBack: () => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ onBack }) => {
  return (
    <div className="h-screen overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="w-full px-6 py-4 border-b border-slate-200/40 bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/medias/OpenZyra.webp" alt="OpenZyra" className="h-8 w-auto" />
            <span className="text-slate-400 text-sm">Mentions légales</span>
          </div>
          <button
            onClick={onBack}
            className="text-slate-500 hover:text-[#1F4597] transition-colors text-sm"
          >
            Retour
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Mentions légales & Licence</h1>

        {/* Licence Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#1F4597]/10 flex items-center justify-center flex-shrink-0">
              <Scale className="text-[#1F4597]" size={24} />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-slate-900 mb-2">Licence</h2>
              <p className="text-slate-600 text-sm mb-4">
                OpenZyra est distribué sous licence <strong>GNU General Public License v3.0 (GPL-3.0)</strong>.
              </p>
              <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600 mb-4">
                <p className="mb-2">
                  <strong>Droits garantis :</strong>
                </p>
                <ul className="space-y-1 text-slate-500">
                  <li>• Exécuter le programme pour tout usage</li>
                  <li>• Étudier le fonctionnement du programme et l'adapter à vos besoins</li>
                  <li>• Redistribuer des copies du programme</li>
                  <li>• Améliorer le programme et publier vos modifications</li>
                </ul>
              </div>
              <a
                href="https://www.gnu.org/licenses/gpl-3.0.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#1F4597] hover:underline text-sm"
              >
                <FileText size={16} />
                Lire la licence complète (GPL-3.0)
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>

        {/* Open Source Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
              <Github className="text-slate-700" size={24} />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-slate-900 mb-2">Open Source</h2>
              <p className="text-slate-600 text-sm mb-4">
                Le code source d'OpenZyra est disponible publiquement. Vous pouvez consulter, 
                modifier et contribuer au projet.
              </p>
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://github.com/semastral/OpenZyra"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-800 transition-colors"
                >
                  <Github size={16} />
                  Voir sur GitHub
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Hébergement */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-3">Hébergement</h2>
          <p className="text-slate-600 text-sm">
            Ce site est hébergé par <strong>Netlify</strong>.
          </p>
          <p className="text-slate-500 text-sm mt-2">
            Adresse : https://openzyra.netlify.app
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-slate-200 text-center">
          <p className="text-slate-400 text-xs">
            © {new Date().getFullYear()} OpenZyra Contributors. 
            Sous licence GNU GPL v3.0.
          </p>
        </div>
      </main>
    </div>
  );
};

export default LegalPage;
