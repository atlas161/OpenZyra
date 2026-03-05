import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Send, 
  Mail, 
  User, 
  MessageSquare, 
  Code2, 
  Bug, 
  Lightbulb,
  HelpCircle,
  Server,
  HandHeart,
  FileQuestion,
  CheckCircle2,
  AlertCircle,
  Github
} from 'lucide-react';

interface ContactPageProps {
  onBack: () => void;
}

// Subject options for open source project
const SUBJECT_OPTIONS = [
  {
    value: 'api-ovh',
    label: 'Connexion API OVH',
    icon: Server,
    description: 'Aide pour connecter l\'API OVH ou questions sur l\'intégration',
    color: 'blue'
  },
  {
    value: 'contribute',
    label: 'Contribuer au projet',
    icon: HandHeart,
    description: 'Proposer une contribution, signaler un bug, soumettre une PR',
    color: 'emerald'
  },
  {
    value: 'feature-request',
    label: 'Suggestion de fonctionnalité',
    icon: Lightbulb,
    description: 'Proposer une nouvelle fonctionnalité ou amélioration',
    color: 'amber'
  },
  {
    value: 'bug-report',
    label: 'Signaler un bug',
    icon: Bug,
    description: 'Rapporter un problème technique ou un comportement inattendu',
    color: 'red'
  },
  {
    value: 'technical-help',
    label: 'Aide technique',
    icon: Code2,
    description: 'Questions sur l\'installation, la configuration ou l\'utilisation',
    color: 'violet'
  },
  {
    value: 'custom-dev',
    label: 'Développement sur mesure',
    icon: FileQuestion,
    description: 'Demande de fonctionnalité personnalisée ou fork privé',
    color: 'indigo'
  },
  {
    value: 'other',
    label: 'Autre demande',
    icon: HelpCircle,
    description: 'Toute autre question ou demande particulière',
    color: 'slate'
  }
];

export const ContactPage: React.FC<ContactPageProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Encode form data for Netlify
    const form = e.target as HTMLFormElement;
    const formDataNetlify = new FormData(form);
    
    try {
      const response = await fetch('/', {
        method: 'POST',
        body: formDataNetlify,
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        throw new Error('Erreur lors de l\'envoi du formulaire');
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'envoi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const selectedSubject = SUBJECT_OPTIONS.find(s => s.value === formData.subject);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Header */}
      <header className="relative z-50 w-full px-6 py-6 border-b border-slate-200/50 bg-white/80 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-[#1F4597] transition-colors p-2 hover:bg-[#5087FF]/10"
          >
            <ArrowLeft size={20} />
          </button>
          <img src="/medias/OpenZyra.webp" alt="OpenZyra" className="h-10 w-auto" />
        </div>
      </header>

      <main className={`max-w-4xl mx-auto px-6 py-12 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Introduction */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#5087FF]/10 text-[#1F4597] text-sm font-medium mb-4">
            <Mail size={16} />
            Formulaire de contact
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Une question ? Une idée ?
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Que vous souhaitiez contribuer à OpenZyra, signaler un problème, ou simplement poser une question, 
            ce formulaire est le meilleur moyen de nous joindre. Nous répondons généralement sous 24-48h.
          </p>
        </div>

        {/* Why contact us */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-3">
              <HandHeart size={20} className="text-[#1F4597]" />
            </div>
            <h3 className="font-semibold text-slate-800 mb-1">Contribuer</h3>
            <p className="text-sm text-slate-500">
              Proposez votre aide, signalez des bugs ou soumettez des idées pour améliorer OpenZyra
            </p>
          </div>
          
          <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-3">
              <Server size={20} className="text-emerald-600" />
            </div>
            <h3 className="font-semibold text-slate-800 mb-1">API OVH</h3>
            <p className="text-sm text-slate-500">
              Besoin d'aide pour l'intégration API ou des questions sur la connexion OVH ?
            </p>
          </div>
          
          <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center mb-3">
              <Lightbulb size={20} className="text-violet-600" />
            </div>
            <h3 className="font-semibold text-slate-800 mb-1">Suggestions</h3>
            <p className="text-sm text-slate-500">
              Une fonctionnalité manquante ? Faites-nous part de vos besoins spécifiques
            </p>
          </div>
        </div>

        {/* Form or Success Message */}
        {!isSubmitted ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8 md:p-10">
            <form 
              onSubmit={handleSubmit} 
              className="space-y-6"
              name="contact"
              method="POST"
              data-netlify="true"
              netlify-honeypot="bot-field"
              data-netlify-recaptcha="true"
            >
              {/* Hidden input for Netlify form handling */}
              <input type="hidden" name="form-name" value="contact" />
              
              {/* Honeypot field - hidden from users, catches bots */}
              <p className="hidden">
                <label>
                  Don't fill this out if you're human: <input name="bot-field" />
                </label>
              </p>
              
              {/* Subject as hidden input for Netlify */}
              <input type="hidden" name="subject" value={formData.subject} />

              {/* Name & Email Row */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                    <span className="flex items-center gap-2">
                      <User size={16} />
                      Votre nom
                    </span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/80 border border-slate-200/50 
                             focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all
                             placeholder:text-slate-400"
                    placeholder="Jean Dupont"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    <span className="flex items-center gap-2">
                      <Mail size={16} />
                      Votre email
                    </span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/80 border border-slate-200/50 
                             focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all
                             placeholder:text-slate-400"
                    placeholder="jean@exemple.com"
                  />
                </div>
              </div>

              {/* Subject Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  <span className="flex items-center gap-2">
                    <MessageSquare size={16} />
                    Sujet de votre demande
                  </span>
                </label>
                <div className="grid sm:grid-cols-2 gap-3">
                  {SUBJECT_OPTIONS.map((subject) => {
                    const Icon = subject.icon;
                    const isSelected = formData.subject === subject.value;
                    return (
                      <button
                        key={subject.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, subject: subject.value }))}
                        className={`
                          p-4 rounded-xl border-2 text-left transition-all
                          ${isSelected 
                            ? `border-${subject.color}-400 bg-${subject.color}-50` 
                            : 'border-slate-200/50 bg-white/60 hover:border-slate-300'
                          }
                        `}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`
                            w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                            ${isSelected ? `bg-${subject.color}-100` : 'bg-slate-100'}
                          `}>
                            <Icon size={20} className={isSelected ? `text-${subject.color}-600` : 'text-slate-500'} />
                          </div>
                          <div>
                            <div className={`font-medium text-sm ${isSelected ? `text-${subject.color}-700` : 'text-slate-700'}`}>
                              {subject.label}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                              {subject.description}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                  <span className="flex items-center gap-2">
                    <MessageSquare size={16} />
                    Votre message
                  </span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-white/80 border border-slate-200/50 
                           focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all
                           placeholder:text-slate-400 resize-none"
                  placeholder={selectedSubject 
                    ? `Décrivez votre demande concernant : ${selectedSubject.label.toLowerCase()}...`
                    : "Décrivez votre demande en détail..."
                  }
                />
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
                  <AlertCircle size={20} />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Netlify reCAPTCHA */}
              <div data-netlify-recaptcha="true" className="flex justify-center" />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !formData.subject}
                className={`
                  w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-lg
                  transition-all duration-300
                  ${isSubmitting || !formData.subject
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#5087FF] to-[#1F4597] text-white hover:shadow-lg hover:shadow-[#5087FF]/25 hover:-translate-y-0.5'
                  }
                `}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Envoyer ma demande
                  </>
                )}
              </button>

              {/* Privacy note */}
              <p className="text-center text-xs text-slate-400">
                Vos informations sont utilisées uniquement pour répondre à votre demande. 
                Pas de spam, pas de revente de données.
              </p>
            </form>
          </div>
        ) : (
          /* Success State */
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              Message envoyé avec succès !
            </h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              Merci de nous avoir contacté. Nous avons bien reçu votre demande 
              concernant <span className="font-medium text-slate-800">{selectedSubject?.label}</span> et nous vous répondrons dans les plus brefs délais.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({ name: '', email: '', subject: '', message: '' });
                }}
                className="px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors"
              >
                Nouveau message
              </button>
              <button
                onClick={onBack}
                className="px-6 py-3 rounded-xl bg-[#1F4597] text-white font-medium hover:bg-[#1F4597] transition-colors"
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
        )}

        {/* Alternative contact methods */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <a 
            href="https://github.com/atlas161/OpenZyra"
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-5 rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-200/50 hover:border-[#5087FF]/50 hover:bg-white/80 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-[#5087FF]/10 group-hover:text-[#1F4597] transition-colors">
              <Github size={24} className="text-slate-600 group-hover:text-[#1F4597]" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">GitHub</h4>
              <p className="text-sm text-slate-500">Issues, PRs et discussions</p>
            </div>
            <ArrowLeft size={16} className="ml-auto text-slate-400 rotate-180" />
          </a>
          
          <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-200/50">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Mail size={24} className="text-[#1F4597]" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">Email direct</h4>
              <p className="text-sm text-slate-500">openzyra@angelo-pro.fr</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactPage;
