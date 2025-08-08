# 🚀 Déployer Love Quest sur GitHub + Vercel

## Option 1: Via GitHub.com (Plus Simple)

### 1. Créer le repo sur GitHub
1. Allez sur [github.com](https://github.com)
2. Connectez-vous ou créez un compte
3. Cliquez sur le bouton vert **"New"** ou **"+"** → **"New repository"**
4. Nom du repo: `love-quest`
5. Description: "Revolutionary dating app - One Week, One Match"
6. Choisissez **Public**
7. NE PAS initialiser avec README (on a déjà le code)
8. Cliquez **"Create repository"**

### 2. Connecter votre code local
GitHub vous donnera ces commandes. Copiez-collez dans votre terminal :

```bash
cd love-quest
git remote add origin https://github.com/VOTRE_USERNAME/love-quest.git
git branch -M main
git push -u origin main
```

Si GitHub demande vos identifiants :
- Username: votre nom d'utilisateur GitHub
- Password: créez un token sur github.com/settings/tokens

### 3. Déployer sur Vercel
1. Allez sur [vercel.com/new](https://vercel.com/new)
2. Cliquez **"Import from GitHub"**
3. Autorisez Vercel à accéder à GitHub
4. Sélectionnez le repo `love-quest`
5. Cliquez **"Deploy"**
6. Attendez 2 minutes... ✨ C'est en ligne !

## Option 2: Avec GitHub CLI (si installé)

```bash
# Dans le dossier love-quest
cd love-quest

# Login GitHub CLI
gh auth login
# Choisissez: GitHub.com → HTTPS → Login with browser

# Créer et pousser le repo
gh repo create love-quest --public --source=. --remote=origin --push

# Votre repo est maintenant sur GitHub !
# URL: https://github.com/VOTRE_USERNAME/love-quest
```

Puis allez sur Vercel.com pour importer le projet.

## 📱 Tester sur Mobile

Une fois déployé, testez ABSOLUMENT sur mobile :
1. Ouvrez l'URL Vercel sur votre téléphone
2. Scrollez tout
3. Testez le formulaire email
4. Vérifiez que c'est fluide

## 🎯 Collecter du Feedback

Message type à envoyer à vos contacts :

```
Salut ! Je lance une nouvelle app de dating révolutionnaire.
Au lieu de swiper 100 personnes, tu matches avec UNE personne pour 7 jours.

Peux-tu me dire ce que tu en penses ? (2 min)
[VOTRE_URL_VERCEL]

Merci ! 🙏
```

## 📊 Analyser les Résultats

Dans la console du navigateur (F12) sur votre site :
```javascript
// Voir les emails collectés
JSON.parse(localStorage.getItem('waitlist'))

// Compter les inscrits
JSON.parse(localStorage.getItem('waitlist')).length
```

## 🔥 Tips Pro

1. **URL courte**: Utilisez [bit.ly](https://bit.ly) pour raccourcir l'URL Vercel
2. **Analytics**: Ajoutez Google Analytics rapidement :
   ```html
   <!-- Dans app/layout.tsx, dans <head> -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   ```

3. **A/B Test**: Créez 2 branches Git avec 2 versions différentes
   - `main`: Version actuelle
   - `test-b`: Version alternative
   - Déployez les 2 sur Vercel
   - Comparez les taux de conversion

## ⚡ Commandes Rapides

```bash
# Voir le statut Git
git status

# Faire des changements et redéployer
git add .
git commit -m "Update landing page"
git push

# Vercel redéploie automatiquement !
```

## 🎯 Objectifs Semaine 1

- [ ] 100 visiteurs uniques
- [ ] 15 emails collectés (15% conversion)
- [ ] 5 feedbacks détaillés
- [ ] 1 article de blog/post LinkedIn
- [ ] Identifier le message qui convertit le mieux

---

**Besoin d'aide ?** Demandez-moi !

**Prochaine étape :** Une fois 20+ emails collectés, on commence le vrai développement.