# 📚 Guide de Gestion des Tutoriels

Ce document explique comment ajouter, modifier ou supprimer des tutoriels dans OpenZyra **sans écrire une ligne de code**.

---

## 🎯 Principe Simple

Les tutoriels sont stockés dans un fichier JSON (`data/tutorials.json`).  
Pour gérer les tutoriels, il suffit d'**éditer ce fichier**.

**Pas besoin d'interface admin. Pas besoin de redémarrer le serveur.**

---

## 📁 Emplacement du Fichier

```
OpenZyra - OPEN/
├── data/
│   └── tutorials.json          ← ÉDITER CE FICHIER
├── components/
│   └── TutorialsPage.tsx       ← Code (ne pas toucher)
└── ...
```

---

## ➕ Ajouter un Tutoriel

### Étape 1 : Ouvrir le fichier

Ouvrir `data/tutorials.json` dans un éditeur de texte (VS Code, Notepad++, etc.)

### Étape 2 : Copier un tutoriel existant

Repérer la fin d'un tutoriel (ligne avec `}`) et ajouter une virgule, puis coller le modèle :

```json
{
  "id": "votre-nouveau-tutoriel",
  "slug": "votre-nouveau-tutoriel",
  "title": "Titre accrocheur du tutoriel",
  "description": "Description courte pour le SEO (150-160 caractères max)",
  "category": "debutant",
  "difficulty": "Facile",
  "readTime": "5 min",
  "icon": "BookOpen",
  "tags": ["ovh", "csv", "tag-personnalise"],
  "seo": {
    "keywords": "mot clé 1, mot clé 2, mot clé 3",
    "metaDescription": "Description qui apparaîtra dans Google"
  },
  "steps": [
    {
      "step": 1,
      "title": "Première étape",
      "content": "Explications détaillées de l'étape 1.",
      "tip": "Astuce optionnelle pour faciliter cette étape"
    },
    {
      "step": 2,
      "title": "Deuxième étape",
      "content": "Explications détaillées de l'étape 2."
    }
  ],
  "relatedTutorials": ["id-autre-tutoriel"],
  "createdAt": "2026-03-04",
  "updatedAt": "2026-03-04"
}
```

### Étape 3 : Personnaliser les valeurs

| Champ | Description | Exemples |
|-------|-------------|----------|
| `id` | Identifiant unique (pas d'espaces) | `"configurer-sip"` |
| `slug` | URL du tutoriel (généralement = id) | `"configurer-sip"` |
| `title` | Titre affiché | `"Configurer sa ligne SIP"` |
| `category` | Niveau | `"debutant"`, `"intermediaire"`, `"avance"` |
| `difficulty` | Texte affiché | `"Facile"`, `"Moyen"`, `"Avancé"` |
| `readTime` | Temps de lecture | `"5 min"`, `"10 min"`, `"15 min"` |
| `icon` | Icône Lucide | `"Download"`, `"Settings"`, `"Clock"`, `"BarChart3"` |
| `tags` | Mots-clés pour recherche | `["ovh", "sip", "config"]` |

### Étape 4 : Sauvegarder et déployer

1. **Sauvegarder** le fichier
2. **Commit + Push** si vous utilisez Git
3. **Netlify** redéploye automatiquement (si build auto activé)
4. Le tutoriel apparaît instantanément sur le site

---

## ✏️ Modifier un Tutoriel

1. Localiser le tutoriel dans `data/tutorials.json` (recherchez par `id`)
2. Modifier le texte souhaité
3. Mettre à jour `updatedAt` avec la date du jour
4. Sauvegarder → Déployer

**Exemple :** Changer le titre
```json
// AVANT
"title": "Comment télécharger ses relevés"

// APRÈS
"title": "Comment télécharger ses relevés d'appels OVH (Guide 2026)"
```

---

## 🗑️ Supprimer un Tutoriel

### Méthode simple (recommandée)

1. Ouvrir `data/tutorials.json`
2. Localiser le tutoriel à supprimer
3. **Supprimer tout le bloc** du tutoriel (depuis `{` jusqu'au `}` correspondant)
4. **Vérifier la virgule** : Si vous supprimez le dernier tutoriel de la liste, retirez la virgule après le tutoriel précédent
5. Sauvegarder → Déployer

**⚠️ Attention aux virgules JSON :**

```json
// AVANT (3 tutoriels)
[
  { "id": "tuto-1", ... },
  { "id": "tuto-2", ... },
  { "id": "tuto-3", ... }    ← SUPPRIMER CELUI-CI
]

// APRÈS (2 tutoriels) - Retirer la virgule après tuto-2 !
[
  { "id": "tuto-1", ... },
  { "id": "tuto-2", ... }     ← PAS de virgule ici
]
```

---

## 🎨 Icônes Disponibles

Icônes Lucide React utilisables dans le champ `icon` :

| Icône | Nom à utiliser | Usage |
|-------|---------------|-------|
| 📥 | `Download` | Téléchargement, export |
| ⚙️ | `Settings` | Configuration, paramètres |
| ⏱️ | `Clock` | Temps, durée, attente |
| 📖 | `BookOpen` | Documentation, guide |
| 📊 | `BarChart3` | Statistiques, analytics |
| 📞 | `Phone` | Appels, téléphonie |
| 🔒 | `Lock` | Sécurité, confidentialité |
| 🎓 | `GraduationCap` | Formation, apprentissage |
| 💡 | `Lightbulb` | Astuces, conseils |
| 🔧 | `Wrench` | Outils, maintenance |

**Pour voir toutes les icônes :** [lucide.dev/icons](https://lucide.dev/icons/)

---

## 🔍 Vérifier le JSON

Avant de sauvegarder, vérifier que :

- [ ] Toutes les `"` (guillemets) sont fermées
- [ ] Les virgules `,` sont bien placées (pas avant `}` ou `]`)
- [ ] Pas de virgule après le dernier élément d'un objet
- [ ] Les crochets `[]` et accolades `{}` sont bien fermés

**Outil de validation :** [jsonlint.com](https://jsonlint.com/)

---

## 🌐 SEO - Optimisation Google

Pour que votre tutoriel soit bien référencé :

| Champ | Recommandation |
|-------|----------------|
| `title` | 50-60 caractères, mots-clés au début |
| `description` | 150-160 caractères, accroche claire |
| `seo.keywords` | 3-5 mots-clés séparés par des virgules |
| `seo.metaDescription` | Résumé qui s'affiche dans Google |
| `tags` | Mots que les utilisateurs pourraient chercher |

**Exemple SEO optimisé :**
```json
"title": "Comment analyser les appels manqués OVH",
"description": "Guide pour identifier et réduire vos appels manqués sur votre groupe téléphonique OVH avec OpenZyra.",
"seo": {
  "keywords": "appels manqués ovh, analyse appels, taux réponse, groupe téléphonique",
  "metaDescription": "Apprenez à analyser vos appels manqués OVH et améliorez votre taux de réponse. Guide étape par étape avec OpenZyra."
}
```

---

## 📋 Checklist Avant Publication

- [ ] `id` unique (pas de doublons)
- [ ] `slug` sans espaces ni caractères spéciaux
- [ ] Au moins 2 étapes dans `steps`
- [ ] Catégorie valide : `debutant`, `intermediaire`, ou `avance`
- [ ] Icône valide (voir liste ci-dessus)
- [ ] Dates `createdAt` et `updatedAt` au format `YYYY-MM-DD`
- [ ] JSON validé sur [jsonlint.com](https://jsonlint.com/)

---

## 🆘 En Cas de Problème

### Le site ne s'affiche plus après ma modification

1. **Vérifier le JSON** sur [jsonlint.com](https://jsonlint.com/)
2. **Chercher l'erreur** : Guillemet manquant, virgule en trop, etc.
3. **Corriger** et re-déployer

### Le tutoriel n'apparaît pas

- Vérifier que `id` est unique
- Vérifier la virgule après le tutoriel précédent
- Vider le cache du navigateur (Ctrl+F5)

### Besoin d'aide ?

Vérifier un tutoriel existant comme modèle dans `data/tutorials.json`.

---

## 📅 Mettre à Jour le Sitemap (Optionnel)

Pour un meilleur référencement Google, ajouter le nouveau tutoriel dans `sitemap.xml` :

```xml
<url>
  <loc>https://openzyra.netlify.app/#tutoriels/votre-slug</loc>
  <lastmod>2026-03-04</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

---

**💡 Rappel :** Pas besoin de coder. Juste éditer un fichier JSON. C'est tout ! 🎉
