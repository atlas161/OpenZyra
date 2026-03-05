
<p align="center">
  <img src="public/Github.png" alt="OpenZyra"/>
</p>

**Analysez vos relevés d'appels OVH en un clic**

[![Open Source](https://img.shields.io/badge/Open%20Source-100%25-brightgreen)](https://github.com/atlas161/OpenZyra)
[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?logo=react)](https://reactjs.org/)
[![100% Client-side](https://img.shields.io/badge/100%25-Client--side-blue)](https://openzyra.netlify.app)

[🚀 **Lancer l'application**](https://openzyra.netlify.app)

---

## ✨ Qu'est-ce que OpenZyra ?

OpenZyra est un outil d'analyse de relevés d'appels **100% gratuit et open-source**, conçu pour fonctionner entièrement dans votre navigateur web. Importez simplement vos fichiers CSV OVH et obtenez instantanément des statistiques détaillées sur vos appels.

### 🔒 Vos données restent privées

Contrairement à d'autres solutions, **OpenZyra ne stocke jamais vos données** :
- ❌ Aucun serveur backend
- ❌ Aucune base de données externe
- ❌ Aucune transmission de vos fichiers CSV
- ✅ Traitement 100% côté client (dans votre navigateur)

---

## 🚀 Fonctionnalités

- 📈 **Statistiques en temps réel** : Taux de réponse, durées moyennes, top agents
- 📊 **Graphiques interactifs** : Distribution horaire et journalière des appels
- 🔍 **Filtres avancés** : Par date, heure, appelant, statut
- 📄 **Export PDF** : Générez des rapports professionnels
- 📁 **Support CSV & ZIP** : Importez vos exports OVH directement
- 💾 **Sauvegarde de projet** : Exportez et réimportez vos analyses

---

## 🛠️ Installation locale

### Prérequis
- [Node.js](https://nodejs.org/) (version 18 ou supérieure)
- npm ou yarn

### Installation

```bash
# Cloner le repository
git clone https://github.com/atlas161/OpenZyra.git
cd openzyra

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:3080`

### Build pour production

```bash
npm run build
```

Les fichiers de production seront générés dans le dossier `dist/`.

---

## 📖 Comment utiliser OpenZyra

### 1. Exportez vos données OVH

Connectez-vous à votre [espace client OVH](https://www.ovhtelecom.fr/manager/) et téléchargez vos relevés d'appels en format CSV.

### 2. Importez dans OpenZyra

1. Ouvrez [OpenZyra](https://openzyra.netlify.app)
2. Glissez-déposez votre fichier CSV ou cliquez sur "Sélectionner des fichiers"
3. Configurez vos lignes téléphoniques (NDI/SIP)
4. Visualisez vos statistiques !

### 3. Explorez vos données

- Utilisez les filtres pour affiner l'analyse
- Consultez les graphiques horaires et journaliers
- Exportez des rapports PDF
- Sauvegardez votre projet au format ZIP

---

## 🎨 Personnalisation du thème

OpenZyra utilise un thème "Bleu Pastel" moderne avec Tailwind CSS. Les couleurs principales sont :
- **Primaire** : `blue-600` (boutons, accents)
- **Fond** : Dégradé `slate-50` → `blue-50` → `indigo-50`
- **Texte** : `slate-800` pour les titres, `slate-600` pour le corps

---

## 🏗️ Architecture

```
OpenZyra/
├── components/          # Composants React
│   ├── LandingPage.tsx  # Page d'accueil
│   ├── Header.tsx       # Barre de navigation
│   ├── Sidebar.tsx      # Panneau latéral
│   ├── StatsCards.tsx   # Cartes de statistiques
│   ├── ChartsSection.tsx # Graphiques
│   ├── CallTable.tsx    # Tableau des appels
│   ├── ConfigModal.tsx  # Configuration lignes
│   └── pdf/            # Composants PDF
├── utils/              # Fonctions utilitaires
│   ├── csv.ts         # Parsing CSV
│   ├── processing.ts   # Traitement des données
│   ├── formatters.ts # Formatage
│   └── schedule.ts   # Horaires d'ouverture
├── types.ts           # Types TypeScript
├── index.tsx          # Point d'entrée
└── vite.config.ts     # Configuration Vite
```

---

## 🤝 Contribuer

Les contributions sont les bienvenues ! Voici comment participer :

1. **Fork** le projet
2. Créez une **branche** (`git checkout -b feature/amazing-feature`)
3. **Committez** vos changements (`git commit -m 'Add amazing feature'`)
4. **Push** vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une **Pull Request**

### Idées de contributions

- 🌐 Traductions
- 🎨 Nouveaux thèmes de couleur
- 📊 Nouveaux types de graphiques
- 🔧 Amélioration des performances
- 🐛 Corrections de bugs
- 📖 Documentation

---

## 📄 Licence

Ce projet est sous licence **GNU General Public License v3.0 (GPL-3.0)** - voir le fichier [LICENSE](https://github.com/atlas161/OpenZyra/blob/main/LICENSE) pour plus de détails.

```
Copyright (C) 2024 OpenZyra Contributors

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.
```

---

## 🙏 Remerciements

- [React](https://reactjs.org/) - Bibliothèque UI
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Recharts](https://recharts.org/) - Graphiques
- [@react-pdf/renderer](https://react-pdf.org/) - Génération PDF

---

## 📧 Contact & Support

- 🐛 **Bug report** : [Ouvrir une issue](https://github.com/atlas161/OpenZyra/issues)
- 💡 **Suggestions** : [Discussions GitHub](https://github.com/atlas161/OpenZyra/discussions)
- 📧 **Email** : contact@example.com

---

<p align="center">
  <strong>⭐ Star ce repo si OpenZyra vous est utile ! ⭐</strong>
</p>

<p align="center">
  Made with 💙 by the OpenZyra community
</p>
