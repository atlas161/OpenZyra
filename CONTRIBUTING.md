# Guide de Contribution - OpenZyra

Merci de votre intérêt pour contribuer à OpenZyra ! Ce document vous guide pour participer au projet efficacement.

## 🚀 Pour commencer

### Prérequis

- [Node.js](https://nodejs.org/) (version 18 ou supérieure)
- npm ou yarn
- Git

### Installation locale

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

## 🌿 Workflow de contribution

### 1. Fork et clone

1. Fork le repository sur GitHub
2. Clonez votre fork localement

### 2. Créer une branche

```bash
git checkout -b feature/nom-de-votre-feature
# ou
git checkout -b fix/description-du-bug
```

**Conventions de nommage des branches :**
- `feature/` - Nouvelle fonctionnalité
- `fix/` - Correction de bug
- `docs/` - Documentation
- `refactor/` - Refactoring

### 3. Développer

- Suivez les conventions de code existantes
- Ajoutez des commentaires si nécessaire
- Testez vos changements localement avec `npm run build`

### 4. Commit

```bash
git add .
git commit -m "feat: description courte de la fonctionnalité"
```

**Convention de commits (simplifiée) :**
- `feat:` - Nouvelle fonctionnalité
- `fix:` - Correction de bug
- `docs:` - Documentation
- `refactor:` - Refactoring
- `style:` - Formatage (sans changement de code)

### 5. Push et Pull Request

```bash
git push origin feature/nom-de-votre-feature
```

Ouvrez ensuite une Pull Request sur GitHub avec :
- Un titre clair et descriptif
- Une description détaillée des changements
- Référence aux issues concernées (si applicable)

## 📋 Types de contributions

### 🐛 Signaler un bug

Ouvrez une [Issue](https://github.com/atlas161/OpenZyra/issues) avec :
- **Titre** : Description concise du problème
- **Description** :
  - Étapes pour reproduire
  - Comportement attendu vs observé
  - Screenshots (si applicable)
  - Environnement (OS, navigateur, version)

### 💡 Suggérer une fonctionnalité

Ouvrez une Issue avec le label `enhancement` :
- Décrivez le besoin
- Expliquez la solution proposée
- Mentionnez les alternatives envisagées

### 📝 Améliorer la documentation

- Corrections de typos
- Traductions
- Tutoriels
- Exemples d'utilisation

### 🔧 Bonnes pratiques de code

#### TypeScript / React

- Utilisez des composants fonctionnels
- Typez toutes les props avec des interfaces
- Utilisez `React.FC<>` pour les composants
- Préférez les imports absolus avec `@/`

```typescript
// ✅ Bon
interface ButtonProps {
  label: string;
  onClick: () => void;
}

export const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  return <button onClick={onClick}>{label}</button>;
};
```

#### Styling (Tailwind CSS)

- Suivez la palette de couleurs existante (violet/bleu)
- Utilisez des classes cohérentes
- Préférez les utilitaires Tailwind au CSS custom

```tsx
// ✅ Bon
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
  Cliquez ici
</button>
```

#### Structure des fichiers

```
/components        - Composants React
  /pdf            - Composants de génération PDF
/utils            - Fonctions utilitaires
/types.ts         - Types TypeScript partagés
```

## 🧪 Tests

Actuellement, le projet n'a pas de suite de tests automatisés. Avant de soumettre :

1. **Build** : Vérifiez que `npm run build` passe sans erreur
2. **TypeScript** : Assurez-vous qu'il n'y a pas d'erreurs de type
3. **Manuel** : Testez vos changements dans le navigateur

## 🎨 Design et UI

Si vous proposez des changements d'interface :
- Respectez le thème actuel (bleu pastel)
- Assurez la responsivité (mobile/desktop)
- Maintenez la cohérence visuelle

## 🌍 Traductions

Pour ajouter une nouvelle langue :
1. Créez un fichier dans le dossier `locales/`
2. Suivez la structure des fichiers existants
3. Mettez à jour le sélecteur de langue

## ⚖️ Licence

En contribuant, vous acceptez que vos contributions soient licenciées sous la **GNU GPL v3**, comme le reste du projet.

## 💬 Besoin d'aide ?

- 📧 Email : contact@openzyra.app
- 🐛 Issues : [GitHub Issues](https://github.com/atlas161/OpenZyra/issues)
- 💬 Discussions : [GitHub Discussions](https://github.com/atlas161/OpenZyra/discussions)

## 🙏 Merci !

Chaque contribution compte, quelle que soit sa taille. Merci d'aider à améliorer OpenZyra !

---

*Dernière mise à jour : Mars 2026*
