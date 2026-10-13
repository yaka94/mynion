# 🍌 MYNION — le langage des Minions (qui devient du Python)

**MYNION** est un langage de programmation jouet basé sur le minionnais des
films *Moi, moche et méchant* / *Les Minions* : tu écris en Minion, le code est
**transpilé en Python** puis exécuté. « Bello ! » 🍌

| MYNION | Python | | MYNION | Python |
|---|---|---|---|---|
| `bello(x)` | `print(x)` | | `paratu … dan …` | `for … in …` |
| `poka(x)` | `input(x)` | | `beedo` | `while` |
| `me want` | `=` | | `stupa` / `bananos` | `break` / `continue` |
| `banana …` | `# …` | | `minion` / `gelato` | `def` / `return` |
| `pwede / simikaru / nononio` | `if / elif / else` | | `tulaliloo / bananonina` | `True / False` |
| `bananera(n)` | `range(n)` | | `gong … yeol` | `0 … 10` |
| `muchos / hanadulsae / blabla` | `len / int / str` | | `surprise(a, b)` | `randint(a, b)` |

Les mots viennent du film (« Bello ! », « Me want banana », « Para tú »,
« Bee do bee do », « Tulaliloo ti amo »…) ; les nombres comptent en coréen
comme dans *Les Minions* (« hana, dul, sae ! »). Voir `cours_mynion.md`,
annexe A, pour le dictionnaire complet avec les origines.

## 📦 Contenu du dépôt

| Élément | Description |
|---|---|
| **`index.html` + `og.png`** | 🌐 **Le site prêt à déployer**, posé à la racine pour GitHub Pages (généré par `site/construire.sh`, qui met la copie à jour à chaque build) |
| **`site/`** | 🔧 Les **sources du site** (`src/`), le script de construction et son guide. 15 leçons interactives FR/EN, XP, Labo, dictionnaire, diplôme partageable. Voir `site/README.md`. |
| `mynion.py` | Le **transpileur + exécuteur + REPL** en ligne de commande |
| `cours_mynion.md` | Le **cours complet pour débutants** (15 chapitres + annnexes) |
| `exemples/*.mynion` | 16 programmes d'exemple, du *Bello !* au jeu du nombre mystère |
| `tests_mynion.py` | Tests du transpileur Python (55 tests, inclus les blocs du cours) |
| `tests_site.js` | Tests de l'interpréteur JS du site + validation du curriculum (65 tests) |

## 🚀 Démarrage rapide

**Le site (recommandé)** — tout dans le navigateur, rien à installer :

```bash
cd site
python3 -m http.server 8000     # ouvre http://localhost:8000
```

### 🚀 Mettre en ligne (GitHub Pages)

1. Crée un dépôt **public** et dépose tout le contenu de ce projet à la racine
   (`index.html` et `og.png` inclus — c'est eux que Pages sert).
2. **Settings → Pages** → Source : `Deploy from a branch` → **`main`** / **`/ (root)`** → Save.
3. Une minute plus tard : `https://TON-COMPTE.github.io/nom-du-depot/`

Guide détaillé (captures, méthode git, domaine perso) : **`site/README.md`**.

**La ligne de commande** — transpileur Python pur :

```bash
python3 mynion.py exemples/01_bello.mynion      # exécute un programme
python3 mynion.py -p exemples/15_bananebuzz.mynion  # montre le Python généré
python3 mynion.py                              # console interactive (REPL)
```

Exemple :

```mynion
banana Mon premier programme 🍌
nom me want poka("Ton nom ? ")
pwede nom == "Gru" :
    bello("Bienvenue, chef !")
nononio :
    bello("Bello,", nom, "!")
poopaye
```

## ✅ Tests

```bash
python3 tests_mynion.py   # transpileur Python : 55 tests
node tests_site.js        # site : interpréteur JS + 92 contrôles du curriculum (fr+en)
```

## 🍌 Philosophie

Un Mynion est **bilingue** : le Python pur reste accepté par le transpileur
(la version `mynion.py`). Le site, lui, enseigne le Mynion « pur » et montre
le **Python secret** en direct — le meilleur des deux mondes pour apprendre
à coder en s'amusant.

*Fait avec 🍌 — minionnais de Pierre Coffin, transpileurs Python & JavaScript faits maison.*
