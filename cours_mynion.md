# 🍌 MYNION — Le cours complet pour débutants

> **MYNION** est un langage de programmation inspiré de la langue des Minions
> (le « minionnais » des films *Moi, moche et méchant* et *Les Minions*).
> Tu écris en Mynion, et le programme **MYNION** transforme automatiquement
> ton code en **Python** avant de l'exécuter.
>
> Résultat : tu apprends à programmer comme un grand… en parlant Minion. 🍌

**Cours pour débutants absolus.** Aucune connaissance préalable n'est requise.
Chaque chapitre : une idée, un exemple, un exercice. Les solutions sont dans
l'annexe B.

---

## Leçon 0 — Préparer sa banane 🍌

Avant de commencer, trois façons de programmer en Mynion :

**1. L'IDE Mynion Studio (recommandé)** — un éditeur avec boutons, coloration
et console, dans ton navigateur :

```text
python3 ide_mynion.py
```

puis ouvre **http://localhost:8000**. L'IDE contient aussi ce cours (onglet
« Cours ») et un dictionnaire (onglet « Dictionnaire »).

**2. La ligne de commande** — pour exécuter un fichier `.mynion` :

```text
python3 mynion.py exemples/01_bello.mynion
```

Ajoute `-p` pour voir le Python généré (le « Python secret ») :

```text
python3 mynion.py -p exemples/01_bello.mynion
```

**3. La console interactive** — tape `python3 mynion.py` sans fichier, et
discute avec le Mynion ligne par ligne. Tape `poopaye` pour sortir.

> 💡 **Comment ça marche ?** Quand tu exécutes du Mynion, le programme lit ton
> code mot par mot et remplace chaque mot minion par son équivalent Python :
> `bello` devient `print`, `pwede` devient `if`… Puis Python exécute le
> résultat. C'est ce qu'on appelle un **transpileur**. Si un jour tu passes au
> Python, tu sauras déjà presque tout ! 🐍

---

## Chapitre 1 — Bello ! Ton premier programme 🎉

`bello(...)` fait **parler le programme** : il affiche ce que tu lui donnes
entre parenthèses. Pour afficher du texte, il faut le mettre entre
**guillemets doubles** `"..."`.

```mynion
banana Mon premier programme Mynion 🍌
bello("Bello !")
bello("Bienvenue dans le langage MYNION !")
poopaye
```

Résultat :

```text
Bello !
Bienvenue dans le langage MYNION !
```

Trois nouveautés ici :

- `banana …` — une note pour les humains (voir chapitre 2) ;
- `bello("…")` — affiche le texte ;
- `poopaye` — la manière Minion de dire « le programme est fini, au revoir ! ».

> ⚠️ **Piège classique** : oublier les parenthèses ou les guillemets.
> `bello(Bello !)` ne marchera pas : il faut `bello("Bello !")`.

**🎯 Exercice 1** : écris un programme qui affiche ton prénom, ton fruit
préféré, puis `Poopaye !` sur trois lignes.

---

## Chapitre 2 — Banana : les commentaires 📝

Un **commentaire** est une ligne que le programme **ignore**. Ça sert à
expliquer ce que tu fais, à toi ou à ceux qui liront ton code.

En Mynion, un commentaire commence par `banana` (ou `bananana`, pour les
grandes occasions 🍌🍌) :

```mynion
banana Cette ligne est une note : elle n'est PAS exécutée
bello("Cette ligne, par contre, s'exécute !")
banana On écrit des notes pour les humains (et les minions)
bello("Les commentaires n'ont aucun effet 🍌")
```

Résultat :

```text
Cette ligne, par contre, s'exécute !
Les commentaires n'ont aucun effet 🍌
```

**🎯 Exercice 2** : reprends ton exercice 1 et ajoute un commentaire au-dessus
de chaque ligne.

---

## Chapitre 3 — Me want : les variables 📦

Une **variable** est une boîte avec une étiquette, dans laquelle on range une
valeur. En Mynion, on dit `me want` (« je veux »), comme dans
*Me want banana !* :

```mynion
banana Me want = ranger une valeur dans une boîte
nom me want "Kevin"
fruit me want "banana"
age me want yeol
bello("Je m'appelle", nom)
bello("J'adore les", fruit)
bello("Mon âge :", age)
```

Résultat :

```text
Je m'appelle Kevin
J'adore les banana
Mon âge : 10
```

`bello(...)` accepte plusieurs valeurs séparées par des virgules : il les
affiche sur la même ligne, avec un espace entre elles.

Une boîte peut **changer de contenu** — c'est même son super-pouvoir :

```mynion
bananes me want hana
bello("J'ai", bananes, "banane")
bananes me want bananes + dul
bello("Maintenant j'en ai", bananes)
```

Résultat :

```text
J'ai 1 banane
Maintenant j'en ai 2
```

> ⚠️ La ligne `bananes me want bananes + dul` se lit de droite à gauche :
> « calcule `bananes + 2`, puis range le résultat dans `bananes` ».

**Règles pour les noms de boîtes** : des lettres, des chiffres et des `_`,
pas d'espace, ça ne commence pas par un chiffre. Et évite les mots réservés
du Mynion (voir l'annexe A). Astuce : des noms clairs (`bananes`, `age`,
`nom_du_chef`) valent mieux que `x` et `y`.

**🎯 Exercice 3** : crée deux variables `prenom` et `fruit`, puis affiche
« `prenom` adore les `fruit` ». Bonus : échange le contenu des deux boîtes.

---

## Chapitre 4 — Les nombres des Minions 🔢

Les Minions comptent en coréen dans le film — « hana, dul, sae ! » — et
MYNION a gardé cette tradition. Voici les nombres de 0 à 10 :

| Mot      | gong | hana | dul | sae | net | daseot | yeoseot | ilgop | yeodeol | ahop | yeol |
|----------|------|------|-----|-----|-----|--------|---------|-------|---------|------|------|
| Chiffre  | 0    | 1    | 2   | 3   | 4   | 5      | 6       | 7     | 8       | 9    | 10   |

```mynion
banana Les nombres des Minions
bello(hana, dul, sae, net, daseot)
bello(yeoseot, ilgop, yeodeol, ahop, yeol)
bello("Au-delà de 10, on écrit les chiffres :", yeol + hana, "ou", 11)
```

Résultat :

```text
1 2 3 4 5
6 7 8 9 10
Au-delà de 10, on écrit les chiffres : 11 ou 11
```

> 💡 À partir de 11, écris simplement les chiffres : `42`, `100`… Les mots
> minions et les chiffres s'utilisent exactement pareil.

### Les opérations

| Opération | Symbole | Exemple       | Résultat |
|-----------|---------|---------------|----------|
| addition  | `+`     | `ilgop + dul` | `9`      |
| soustraction | `-`  | `ilgop - dul` | `5`      |
| multiplication | `*` | `ilgop * dul` | `14`     |
| division  | `/`     | `ilgop / dul` | `3.5`    |
| division entière | `//` | `ilgop // dul` | `3`   |
| reste (modulo) | `%` | `ilgop % dul`  | `1`      |

```mynion
bello("7 + 2  =", ilgop + dul)
bello("7 - 2  =", ilgop - dul)
bello("7 * 2  =", ilgop * dul)
bello("7 / 2  =", ilgop / dul)
bello("7 // 2 =", ilgop // dul, "et il reste", ilgop % dul)
bello("(1 + 2) * 3 =", (hana + dul) * sae)
```

Résultat :

```text
7 + 2  = 9
7 - 2  = 5
7 * 2  = 14
7 / 2  = 3.5
7 // 2 = 3 et il reste 1
(1 + 2) * 3 = 9
```

> 💡 `//` c'est « combien de fois ça rentre entièrement » et `%` c'est « ce
> qui reste ». 17 bananes partagées entre 5 Minions : `17 // 5` = 3 bananes
> chacun, et `17 % 5` = 2 bananes restent pour le chef.

**🎯 Exercice 4** : un régime compte 17 bananes pour 5 Minions. Affiche combien
de bananes entières chacun reçoit, et combien il en reste.

---

## Chapitre 5 — Le texte (les chaînes de caractères) 💬

Un « texte » s'appelle une **chaîne de caractères**. On l'écrit entre
guillemets doubles `"..."` — recommandé en français, à cause des apostrophes
(`'`) dans nos mots.

```mynion
banana Le texte (les « chaînes de caractères »)
phrase me want "Les Minions " + "adorent " + "les bananes !"
bello(phrase)
bello("Banana ! " * yeol)
bello("Le mot 'banana' contient", muchos("banana"), "lettres")
```

Résultat :

```text
Les Minions adorent les bananes !
Banana ! Banana ! Banana ! Banana ! Banana ! Banana ! Banana ! Banana ! Banana ! Banana !
Le mot 'banana' contient 6 lettres
```

- `+` **colle** deux textes bout à bout (attention : `"Les Minions "` garde
  son espace final !) ;
- `* yeol` **répète** le texte 10 fois ;
- `muchos(...)` compte la longueur (le nombre de lettres) d'un texte — ou le
  nombre d'éléments d'une liste (chapitre 11).

> ⚠️ On ne peut pas mélanger texte et nombre avec `+`. Pour transformer un
> nombre en texte, utilise `blabla(42)`. (Mais avec `bello(...)`, pas besoin :
> il sait tout afficher.)

**🎯 Exercice 5** : fabrique une variable `mot` et affiche « `mot` à l'envers
c'est dur ! » … puis affiche le mot répété 5 fois avec `*`.

---

## Chapitre 6 — Poka : parler avec l'utilisateur ⌨️

`poka(...)` (*« Po ka ? » = « Quoi ? »*) **pose une question** et attend que
l'utilisateur réponde. La réponse arrive toujours comme un **texte**.

```mynion
banana Parle-moi !
nom me want poka("Comment t'appelles-tu ? ")
bello("Bello,", nom, "!")
bello("Bienvenue au repaire des Mynions !")
```

Si l'utilisateur répond `Kevin`, le programme affiche :

```text
Comment t'appelles-tu ? Bello, Kevin !
Bienvenue au repaire des Mynions !
```

> 💡 **Dans l'IDE Mynion Studio** : ouvre le panneau **« Entrée »** sous
> l'éditeur et écris la réponse avant d'exécuter (une réponse par ligne).
> **En ligne de commande** : la question s'affiche et tu tapes ta réponse
> directement dans le terminal.

### Convertir la réponse en nombre

Comme la réponse est du texte, pour faire des maths il faut la « compter »
avec `hanadulsae(...)` (*« hana, dul, sae » = 1, 2, 3*) :

```mynion
banana Un peu de maths avec le minion
age me want hanadulsae(poka("Ton âge ? "))
bello("Dans un an, tu auras", age + hana, "ans !")
```

Dans l'autre sens, `blabla(42)` transforme un nombre en texte.

**🎯 Exercice 6** : demande deux nombres à l'utilisateur et affiche leur somme.

---

## Chapitre 7 — Pwede / Simikaru / Nononio : les conditions 🔀

Un programme devient intelligent quand il **choisit**. En Mynion :

- `pwede` (*« Pwede na ? » = « On peut ? »*) = **si** ;
- `simikaru` (*« similaire »*) = **sinon si** ;
- `nononio` (*« non non »*) = **sinon**.

```mynion
banana Pwede na ? On peut ?
age me want yeol
pwede age < yeol :
    bello("Encore un petit minion ! 🍼")
simikaru age < dul * yeol :
    bello("Un minion bien grandi ! 💪")
nononio :
    bello("Un sage du repaire ! 🧠")
```

Résultat :

```text
Un minion bien grandi ! 💪
```

Trois choses **très importantes** :

1. La condition se termine par **deux-points `:`**
2. Le bloc en dessous est **indenté** (décalé de 4 espaces) — c'est
   « l'échelle à bananes » qui montre ce qui appartient au `pwede`.
3. Les comparaisons : `==` (égal à), `!=` (différent de), `<`, `<=`, `>`, `>=`.

> ⚠️ **Piège n°1 des débutants** : `=` (qui range dans une boîte, `me want`)
   n'est pas `==` (qui compare). `pwede age == yeol` demande « est-ce que age
   est égal à 10 ? ».

**🎯 Exercice 7** : demande l'âge de l'utilisateur et affiche « Tu es majeur·e ! »
s'il a 18 ans ou plus, « Encore un peu de patience… » sinon.

---

## Chapitre 8 — Tulaliloo & Bananonina : vrai ou faux ✅❌

Une condition, au fond, c'est une valeur **vraie** ou **fausse** :

- `tulaliloo` (*« Tulaliloo ti amo » = « on t'aime »*) = **vrai** ;
- `bananonina` (*« moche »*) = **faux**.

On les combine avec :

- `tiamo` (*« ti amo »*) = **et** (les deux doivent être vrais) ;
- `oula` = **ou** (au moins un doit être vrai) ;
- `nabanana` = **non** (inverse vrai/faux).

```mynion
banana Vrai ou faux ? Tulaliloo !
faim me want tulaliloo
fatigue me want bananonina
pwede faim tiamo nabanana fatigue :
    bello("Me want banana ! 🍌")
simikaru fatigue oula nabanana faim :
    bello("Bonne sieste... 😴")
nononio :
    bello("Rien à signaler !")
```

Résultat :

```text
Me want banana ! 🍌
```

> ⚠️ `tiamo` et `oula` s'utilisent **dans** une condition, entre deux valeurs —
> ce ne sont pas des branches. `pwede faim tiamo nabanana fatigue` se lit :
> « si j'ai faim **et** pas sommeil ».

**🎯 Exercice 8** : demande un nombre à l'utilisateur et affiche « pair » s'il
est divisible par 2 (indice : le reste `% dul` est `gong`), « impair » sinon.

---

## Chapitre 9 — Paratu & Bananera : répéter en comptant 🔁

`paratu … dan …` (*« para tú » = « pour toi »*) **répète** une action pour
chaque élément. Et `bananera(...)` fabrique un **régime de bananes** numéroté
(l'équivalent de `range` en Python) :

```mynion
banana Le régime de bananes : paratu compte tout seul
paratu numero dan bananera(hana, daseot + hana) :
    bello("Banane n°", numero)
bello("Miam !")
```

Résultat :

```text
Banane n° 1
Banane n° 2
Banane n° 3
Banane n° 4
Banane n° 5
Miam !
```

> 💡 **La règle du régime** : `bananera(n)` donne les bananes `0, 1, … n-1`
> et `bananera(a, b)` donne `a, a+1, … b-1`. La dernière banane est
> toujours pour le chef : elle est **exclue** ! 🍌👑

Un exemple classique — additionner les nombres de 1 à 10 :

```mynion
banana La somme de 1 à 10
total me want gong
paratu i dan bananera(hana, yeol + hana) :
    total me want total + i
bello("Le total est", total)
```

Résultat :

```text
Le total est 55
```

**🎯 Exercice 9** : affiche la table de multiplication de 7 (de 1 à 10),
genre `7 × 1 = 7`.

---

## Chapitre 10 — Beedo : tant que… 🚨

`beedo` (la sirène *« bee do bee do bee do ! »*) **répète** un bloc **tant
que** une condition est vraie :

```mynion
banana Compte à rebours : bee do bee do !
compteur me want daseot
beedo compteur > gong :
    bello("Bee do bee do :", compteur)
    compteur me want compteur - hana
bello("BOOM ! 💥")
```

Résultat :

```text
Bee do bee do : 5
Bee do bee do : 4
Bee do bee do : 3
Bee do bee do : 2
Bee do bee do : 1
BOOM ! 💥
```

> ⚠️ **Attention à la boucle infinie** : si la condition ne devient jamais
> fausse, le programme tourne pour toujours ! Vérifie bien que quelque chose
> dans le bloc fait évoluer la condition.

Deux mots pour piloter les boucles :

- `stupa` (*« Stupa ! » = « stop ! »*) = **sortir immédiatement** de la boucle ;
- `bananos` = **passer à la banane suivante** (sauter le reste du tour).

```mynion
banana Stupa ! On s'arrête dès qu'on a trouvé
paratu n dan bananera(hana, yeol * yeol) :
    pwede n % ilgop == gong :
        bello("Premier multiple de 7 trouvé :", n)
        stupa
bello("Fin")
```

Résultat :

```text
Premier multiple de 7 trouvé : 7
Fin
```

```mynion
banana Bananos : sauter à la banane suivante (ici, sauter les pairs)
paratu n dan bananera(gong, yeol) :
    pwede n % dul == gong :
        bananos
    bello(n)
```

Résultat :

```text
1
3
5
7
9
```

**🎯 Exercice 10** : avec `beedo`, fais un compte à rebours de 10 à 1 puis
affiche « BANANA ! ».

---

## Chapitre 11 — Les régimes de bananes : les listes 🍌🍌🍌

Une **liste** range plusieurs valeurs dans une seule boîte, entre crochets.
On la parcourt avec `paratu … dan …` :

```mynion
banana Les régimes de bananes (les listes)
minions me want ["Kevin", "Stuart", "Bob"]
bello("L'équipe :", minions)
bello("Le chef, c'est", minions[gong])
bello("Le deuxième est", minions[hana])
pousse(minions, "Otto")
bello("Bienvenue Otto ! On est maintenant", muchos(minions), "minions.")
paratu m dan minions :
    bello("Bello", m, "!")
```

Résultat :

```text
L'équipe : ['Kevin', 'Stuart', 'Bob']
Le chef, c'est Kevin
Le deuxième est Stuart
Bienvenue Otto ! On est maintenant 4 minions.
Bello Kevin !
Bello Stuart !
Bello Bob !
Bello Otto !
```

À retenir :

- les positions commencent à **`gong` (0)** : `minions[gong]` est le
  premier, `minions[hana]` le deuxième… ;
- `pousse(liste, valeur)` ajoute un élément à la fin ;
- `muchos(liste)` donne le nombre d'éléments ;
- `liste[position] me want valeur` remplace un élément ;
- `paratu element dan liste` parcourt toute la liste sans compter.

**🎯 Exercice 11** : crée la liste de courses des Minions
(`["bananes", "gelato", "bable"]`), ajoute `"saucisses"`, puis affiche chaque
article précédé de son numéro (commence à 1 !).

---

## Chapitre 12 — Minion & Gelato : crée tes propres minions 🧑‍🔧

Tu peux fabriquer ton propre **minion** : un petit assistant qui sait faire
une tâche précise. `minion` crée l'assistant (comme `def` en Python), et
`gelato` (*la glace-récompense !*) lui fait **rapporter un résultat** :

```mynion
banana Crée ton propre minion : minion + gelato
minion saluer(nom) :
    bello("Bello", nom, "!")
    gelato "Bello " + nom

message me want saluer("Stuart")
bello(message)
```

Résultat :

```text
Bello Stuart !
Bello Stuart
```

- `minion saluer(nom) :` — fabrique un minion nommé `saluer` qui reçoit une
  boîte `nom` en arrivant ;
- `gelato …` — le minion **rapporte** la valeur à celui qui l'appelle ;
- `saluer("Stuart")` — envoie le minion travailler avec `"Stuart"`.

Un minion peut faire des calculs et rapporter le résultat :

```mynion
banana Une fonction avec un calcul
minion double(nombre) :
    gelato nombre * dul

bello("Le double de 21 est", double(dul * yeol + hana))
bello("Le double du double :", double(double(yeol)))
```

Résultat :

```text
Le double de 21 est 42
Le double du double : 20
```

> 💡 Sans `gelato`, le minion travaille mais ne rapporte rien. Avec `gelato`,
> l'appel devient une **valeur** que tu peux ranger avec `me want`, afficher,
> ou envoyer à un autre minion.

**🎯 Exercice 12** : crée un minion `aire(longueur, largeur)` qui rapporte
l'aire d'un rectangle, et un minion `crier(texte)` qui rapporte le texte en
MAJUSCULES suivi de ` !!!` (indice : `texte.upper()` marche, les minions sont
bilingues).

---

## Chapitre 13 — Surprise ! Le hasard 🎲

`surprise(a, b)` tire un **nombre au hasard** entre `a` et `b` (bornes
comprises) :

```mynion
banana Surprise ! Le hasard fait bien les choses 🎲
bello("Le dé affiche :", surprise(hana, yeoseot))
bello("On relance :", surprise(hana, yeoseot))
bello("Un nombre entre 1 et 100 :", surprise(hana, yeol * yeol))
```

Exemple de résultat (à chaque exécution, c'est différent !) :

```text
Le dé affiche : 4
On relance : 6
Un nombre entre 1 et 100 : 73
```

**🎯 Exercice 13** : joue à pile ou face : tire `surprise(gong, hana)` et
affiche « PILE » pour `hana`, « FACE » pour `gong`.

---

## Chapitre 14 — Les grands projets 🏆

Tu as toutes les cartes en main. Place aux projets !

### Projet 1 — La pyramide de bananes

```mynion
banana La pyramide de bananes 🍌
hauteur me want daseot
paratu ligne dan bananera(hana, hauteur + hana) :
    bello(" " * (hauteur - ligne) + "🍌" * ligne)
```

Résultat :

```text
    🍌
   🍌🍌
  🍌🍌🍌
 🍌🍌🍌🍌
🍌🍌🍌🍌🍌
```

### Projet 2 — Banane Buzz

Le grand classique « Fizz Buzz », version Minion : de 1 à 10, affiche
`BELLO` pour les multiples de 3, `BANANA` pour les multiples de 5,
`BELLOBANANA` pour les deux, sinon le nombre.

```mynion
banana BANANE BUZZ !
paratu n dan bananera(hana, yeol + hana) :
    pwede n % sae == gong tiamo n % daseot == gong :
        bello("BELLOBANANA")
    simikaru n % sae == gong :
        bello("BELLO")
    simikaru n % daseot == gong :
        bello("BANANA")
    nononio :
        bello(n)
```

Résultat :

```text
1
2
BELLO
4
BANANA
BELLO
7
8
BELLO
BANANA
```

### Projet 3 — Le nombre mystère 🎮

L'ordinateur cache un nombre, l'utilisateur doit le deviner. **Remplis le
panneau « Entrée » de l'IDE** avec des propositions (une par ligne, ex :
`50`, `75`, `62`…) avant d'exécuter !

```mynion
banana 🎮 LE NOMBRE MYSTÈRE
banana ⚠️ Remplis le panneau « Entrée » de l'IDE avant d'exécuter !
mystere me want surprise(hana, yeol * yeol)
essais me want gong
trouve me want bananonina
bello("J'ai caché un nombre entre 1 et 100. À toi de le trouver !")
beedo nabanana trouve :
    essais me want essais + hana
    essai me want hanadulsae(poka("Essai n°" + blabla(essais) + " : "))
    pwede essai == mystere :
        trouve me want tulaliloo
        bello("🎉 GAGNÉ en", essais, "essais !")
    simikaru essai < mystere :
        bello("Plus grand ! ⬆️")
    nononio :
        bello("Plus petit ! ⬇️")
bello("Poopaye, champion ! 👋")
```

### Projet 4 — La table de multiplication

```mynion
banana La table de 7, sans calculatrice
paratu i dan bananera(hana, yeol + hana) :
    bello(i, "× 7 =", i * ilgop)
```

**🎯 Exercice 14** :-modifie le projet 2 pour aller jusqu'à 30, avec `BELLO`
pour les multiples de 3, `BANANA` pour ceux de 10.

---

## Chapitre 15 — Et maintenant… le Python ! 🐍

Petit secret : **le Mynion est du Python déguisé**. Chaque programme Mynion
est transpilé en Python pur avant d'être exécuté. Compare :

```mynion
banana Le même programme en Mynion…
paratu i dan bananera(hana, yeol + hana) :
    bello(i, "× 7 =", i * ilgop)
```

```python
# … et son Python secret
for i in range(1, 11):
    print(i, "× 7 =", i * 7)
```

| Tu as appris en Mynion        | C'est ça en Python  |
|-------------------------------|---------------------|
| `bello(x)`                    | `print(x)`          |
| `me want`                     | `=`                 |
| `pwede / simikaru / nononio`  | `if / elif / else`  |
| `paratu … dan …`              | `for … in …`        |
| `beedo`                       | `while`             |
| `minion / gelato`             | `def / return`      |
| `banana`                      | `#`                 |
| `gong … yeol`                 | `0 … 10`            |

> 💡 Dans l'IDE, coche **« 👁 Python secret »** : tu verras le Python généré
> en direct pendant que tu écris du Mynion. C'est le meilleur pont vers
> « vrai » langage le plus demandé au monde. Et comme un Mynion est
> bilingue, tout programme Python pur fonctionne aussi en Mynion !

**🎉 Félicitations : tu sais programmer.** Tu as utilisé des variables, des
conditions, des boucles, des listes et des fonctions — les briques de TOUS
les langages. Poopaye, et que la banane soit avec toi ! 🍌

---

## Annexe A — Le dictionnaire Mynion complet 📖

### Les mots du film ⭐ (attestés chez les vrais Minions)

| MYNION | Python | Signification |
|---|---|---|
| `bello(x)` | `print(x)` | « Bello ! » = salut → faire parler |
| `poka(x)` | `input(x)` | « Po ka ? » = quoi ? → poser une question |
| `me want` (ou `mewant`) | `=` | « me want banana » → ranger dans une boîte |
| `banana …` / `bananana …` | `# …` | commentaire |
| `poopaye` | `# Poopaye !` | « au revoir » → fin du programme |
| `pwede` | `if` | « pwede na ? » = on peut ? → si |
| `nononio` | `else` | « non non » → sinon |
| `paratu` | `for` | « para tú » = pour toi → pour |
| `beedo` | `while` | « bee do bee do ! » la sirène → tant que |
| `stupa` | `break` | « stupa ! » = stop |
| `minion` | `def` | fabrique un minion (fonction) |
| `gelato` | `return` | rapporte la glace (retourne la valeur) |
| `tulaliloo` | `True` | « tulaliloo ti amo » = on t'aime → vrai |
| `bananonina` | `False` | « moche » → faux |
| `tiamo` | `and` | « ti amo » → et |
| `muchos(x)` | `len(x)` | combien ? |
| `hanadulsae(x)` | `int(x)` | « hana, dul, sae » = 1, 2, 3 → compter |
| `banana`, `papoy`, `bable`… | — | banane, jouet, pomme : le vocabulaire de base ! |

### Les extensions 🍌 (inventées pour le langage, dans l'esprit du film)

| MYNION | Python | Signification |
|---|---|---|
| `simikaru` | `elif` | « similaire » → sinon si |
| `dan` | `in` | dans |
| `bananos` | `continue` | banane suivante |
| `oula` | `or` | ou |
| `nabanana` | `not` | pas banane → non |
| `bananera(n)` | `range(n)` | le régime de bananes |
| `blabla(x)` | `str(x)` | transformer en blabla (texte) |
| `recrute` | `import` | recruter un module |
| `pousse(liste, x)` | `liste.append(x)` | ajouter au régime (fourni par le runtime) |
| `surprise(a, b)` | `randint(a, b)` | nombre surprise (fourni par le runtime) |

### Les nombres

`gong` 0 · `hana` 1 · `dul` 2 · `sae` 3 · `net` 4 · `daseot` 5 · `yeoseot` 6 ·
`ilgop` 7 · `yeodeol` 8 · `ahop` 9 · `yeol` 10 — au-delà, écris les chiffres.

> ⚠️ Ces mots sont **réservés** : n'utilise pas `bello`, `pwede`, `hana`…
> comme nom de variable. Et les symboles (`+ - * / // % == != < <= > >=`,
> parenthèses, crochets, deux-points) restent les mêmes qu'en Python.

---

## Annexe B — Solutions des exercices ✅

**Exercice 1**

```mynion
bello("Gru")
bello("bananes")
bello("Poopaye !")
```

**Exercice 3**

```mynion
prenom me want "Kevin"
fruit me want "banana"
bello(prenom, "adore les", fruit)
banana Bonus : échanger deux boîtes (il en faut une troisième !)
temp me want prenom
prenom me want fruit
fruit me want temp
bello(prenom, fruit)
```

**Exercice 4**

```mynion
bananes me want 17
minions me want daseot
bello("Chacun reçoit", bananes // minions, "bananes")
bello("Il reste", bananes % minions, "banane(s) pour le chef")
```

**Exercice 6**

```mynion
a me want hanadulsae(poka("Premier nombre ? "))
b me want hanadulsae(poka("Deuxième nombre ? "))
bello("La somme est", a + b)
```

**Exercice 7**

```mynion
age me want hanadulsae(poka("Ton âge ? "))
pwede age >= 18 :
    bello("Tu es majeur·e !")
nononio :
    bello("Encore un peu de patience…")
```

**Exercice 8**

```mynion
n me want hanadulsae(poka("Un nombre ? "))
pwede n % dul == gong :
    bello("pair")
nononio :
    bello("impair")
```

**Exercice 9**

```mynion
paratu i dan bananera(hana, yeol + hana) :
    bello("7 ×", i, "=", ilgop * i)
```

**Exercice 10**

```mynion
n me want yeol
beedo n > gong :
    bello(n)
    n me want n - hana
bello("BANANA !")
```

**Exercice 11**

```mynion
courses me want ["bananes", "gelato", "bable"]
pousse(courses, "saucisses")
paratu article dan courses :
    bello(article)
banana Avec les numéros :
paratu i dan bananera(gong, muchos(courses)) :
    bello(i + hana, ".", courses[i])
```

**Exercice 12**

```mynion
minion aire(longueur, largeur) :
    gelato longueur * largeur

minion crier(texte) :
    gelato texte.upper() + " !!!"

bello("Aire du rectangle :", aire(yeol, daseot))
bello(crier("banana"))
```

**Exercice 13**

```mynion
piece me want surprise(gong, hana)
pwede piece == hana :
    bello("PILE")
nononio :
    bello("FACE")
```

**Exercice 14**

```mynion
paratu n dan bananera(hana, yeol + yeol + hana) :
    pwede n % sae == gong tiamo n % yeol == gong :
        bello("BELLOBANANA")
    simikaru n % sae == gong :
        bello("BELLO")
    simikaru n % yeol == gong :
        bello("BANANA")
    nononio :
        bello(n)
```

---

## Annexe C — Les erreurs fréquentes, expliquées 🚑

| Message MYNION | Ce qui s'est passé | À vérifier |
|---|---|---|
| « Le minion « x » n'existe pas » | variable jamais créée | `me want` ? orthographe ? majuscules ? |
| « Les bananes sont mal alignées » | indentation incorrecte | 4 espaces par niveau, toujours pareil |
| « Les Minions n'arrivent pas à lire cette ligne » | erreur de syntaxe | les `:` après pwede/paratu/minion…, les `()` et les `" "` |
| « Tu mélanges des types » | `"3" + 5` | convertis avec `hanadulsae` ou `blabla` |
| « Impossible de diviser par gong » | division par 0 | vérifie tes compteurs |
| « Hanadulsae n'arrive pas à compter ça » | `hanadulsae("abc")` | la réponse doit être un nombre en texte |
| « Poka n'a rien reçu » | plus d'entrée pour `poka` | remplis le panneau « Entrée » de l'IDE |
| Le programme tourne sans fin | boucle infinie | ta condition devient-elle fausse un jour ? |

Exemple d'erreur et sa lecture :

```text
🍌💥 Oups ! Le minion « prenom » n'existe pas. Crée-le avec me want…
   Ligne Mynion 3 : bello("Bello", prenom)
   (NameError : name 'prenom' is not defined)
```

La première ligne explique l'erreur **avec des mots simples**, la deuxième
montre **la ligne exacte** de ton programme Mynion, la dernière donne le nom
technique (utile pour chercher sur Internet).

---

*MYNION v1.0 — fait avec 🍌 et beaucoup de respect pour Pierre Coffin,
inventeur du minionnais. banana !*
