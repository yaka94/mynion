# 🍌 MYNION — le site d'apprentissage façon Mimo

Site **100 % statique** pour apprendre le langage MYNION (le Python des Minions)
avec un parcours interactif : leçons courtes, quiz, exercices à coder, XP,
série, Labo et dictionnaire. **Français & English.** Aucun serveur, aucune
dépendance : un fichier `index.html` (+ `og.png`, l'image d'aperçu pour les partages).

---

## 🚀 Héberger sur GitHub Pages (5 minutes)

### Étape 1 — Créer le dépôt

1. Va sur [github.com/new](https://github.com/new)
2. Nom du dépôt : `mynion` (ou ce que tu veux, **public**)
3. Clique sur **Create repository**

### Étape 2 — Ajouter le site

**Option A — sans rien installer (glisser-déposer) :**

1. Dans ton dépôt, clique sur **Add file → Upload files**
2. Glisse les fichiers **`index.html`** et **`og.png`** (l'image d'aperçu du lien
   nécessaire !)
3. **Commit changes**

**Option B — en ligne de commande :**

```bash
git clone https://github.com/TON-COMPTE/mynion.git
cd mynion
cp /chemin/vers/site/index.html /chemin/vers/site/og.png .
git add index.html og.png
git commit -m "🍌 MYNION en ligne !"
git push
```

### Étape 3 — Activer GitHub Pages

1. Dans le dépôt : **Settings → Pages**
2. **Source** : *Deploy from a branch*
3. **Branch** : `main`, dossier `/ (root)` → **Save**
4. Attends ~1 minute, recharge la page : ton site est sur

    ```text
    https://TON-COMPTE.github.io/mynion/
    ```

🎉 C'est en ligne — sur téléphone, tablette et ordinateur, dans le monde entier.

> 💡 Si tu veux une URL racine `https://TON-COMPTE.github.io/`, crée un dépôt
> nommé exactement `TON-COMPTE.github.io` et mets `index.html` dedans.

---

## 🛠️ Modifier le site

Le fichier `index.html` est **généré** à partir des sources du dossier `src/` :

| Fichier | Rôle |
|---|---|
| `src/squelette_haut.html` + `src/squelette_body.html` | squelette HTML, en-tête, menu |
| `src/style.css` | tout le style (thème sombre banane) |
| `src/noyau.js` | l'interpréteur MYNION en JavaScript (lexer, analyseur, évaluateur) + transpileur vers Python + coloration |
| `src/donnees.js` | interface FR/EN, les 15 leçons, le dictionnaire, les exemples du Labo |
| `src/app.js` | l'application : parcours, XP, série, sons, confettis |

Après une modification, reconstruis :

```bash
./construire.sh        # (ou : bash construire.sh)
```

Puis teste en local : ouvre `index.html` directement, ou :

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

Les tests automatiques (interpréteur + validation des 15 leçons en fr et en) :

```bash
node ../tests_site.js
```

---

## 📱 Ce que le site contient

- **🏠 Parcours** — 15 leçons façon Mimo : théorie, quiz, trous à compléter,
  lignes à remettre en ordre, exercices à coder (vérifiés en exécutant ton
  code !), projets finaux (Banane Buzz, nombre mystère, pyramide).
- **🧪 Labo** — éditeur avec coloration syntaxique, exécution dans le
  navigateur, panneau d'entrée pour `poka`, et le **Python secret** (ton
  Mynion traduit en Python en direct).
- **📖 Dico** — dictionnaire Mynion ↔ Python avec recherche.
- **Gamification** — XP, niveaux (Œuf → Légende de la Banane), série de jours
  🔥, confettis et petits sons (désactivables).
- **FR / EN** — bascule de langue en haut à droite, mémorisée.
- Progression sauvegardée dans le navigateur (localStorage).

---

## 🍌 Rappel express du langage

```mynion
banana Mon premier programme 🍌
nom me want poka("Ton nom ? ")
pwede nom == "Gru" :
    bello("Bienvenue, chef !")
nononio :
    bello("Bello,", nom, "!")
paratu i dan bananera(hana, yeol) :
    bello("Banane n°", i)
poopaye
```

`bello` print · `poka` input · `me want` = · `pwede/simikaru/nononio` if/elif/else ·
`paratu/dan` for/in · `bananera` range · `beedo` while · `stupa` break ·
`minion/gelato` def/return · `tulaliloo/bananonina` True/False ·
`hana, dul, sae…` 1, 2, 3… — le dictionnaire complet est dans l'onglet 📖.

---

## 🇬🇧 English summary

**MYNION** is a static, dependency-free website (`index.html` + `og.png`) to
learn the MYNION programming language — Minion-speak that transpiles to
Python — with a Mimo-style interactive course: 15 lessons, quizzes, coding
exercises verified in-browser, XP, streaks, a playground ("Lab") with a live
Mynion-to-Python transpiler view, and a searchable dictionary. French and
English.

**Deploy:** create a public GitHub repo → upload `index.html` and `og.png` →
Settings → Pages → Deploy from branch `main` / root → your site goes live at
`https://YOUR-NAME.github.io/REPO/`. To rebuild after editing `src/`, run
`./construire.sh` and run `node ../tests_site.js` to check everything.

*Fait avec 🍌 — langue des Minions de Pierre Coffin, transpileur Python fait maison.*
