#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🍌 MYNION v1.0 — le langage des Minions, qui devient du Python.

Tu écris en Mynion, MYNION traduit en Python, puis l'exécute. Exemple :

    banana Mon premier programme 🍌
    bello("Bello !")
    poopaye

devient :

    # Mon premier programme 🍌
    print("Bello !")
    # Poopaye !

─────────────────────────────  DICTIONNAIRE  ─────────────────────────────
  MYNION              PYTHON         SIGNIFICATION
  bello(x)            print(x)       « Bello ! » = salut → faire parler
  poka(x)             input(x)       « Po ka ? » = quoi ? → poser une question
  me want             =              « me want banana » → ranger dans une boîte
  banana / bananana   #              commentaire (lu par les humains, pas exécuté)
  poopaye             # Poopaye !    « au revoir » → fin du programme
  pwede               if             « pwede na ? » = on peut ? → si
  simikaru            elif           « similaire » → sinon si
  nononio             else           « non non » → sinon
  paratu              for            « para tú » = pour toi → pour
  dan                 in             dans
  beedo               while          « bee do bee do ! » la sirène → tant que
  stupa               break          « stupa ! » = stop !
  bananos             continue       banane suivante
  minion              def            crée ton propre minion (fonction)
  gelato              return         rapporte la glace (retourne la valeur)
  recrute             import         recrute un module
  tulaliloo           True           « tulaliloo ti amo » = on t'aime → vrai
  bananonina          False          « moche » → faux
  nabanana            not            pas banane → non
  tiamo               and            « ti amo » → et
  oula                or             ou
  bananera(n)         range(n)       le régime de bananes
  muchos(x)           len(x)         « combien ? »
  hanadulsae(x)       int(x)         « hana, dul, sae » = 1, 2, 3 → compter
  blabla(x)           str(x)         transformer en texte
  pousse(l, x)        l.append(x)    ajoute une banane au régime   (runtime)
  surprise(a, b)      randint(a, b)  un nombre surprise !           (runtime)
  gong…yeol           0…10           les nombres minions
──────────────────────────────────────────────────────────────────────────
Le Python pur reste accepté : un Mynion est bilingue. 🐍

Utilisation :
    python3 mynion.py programme.mynion      exécute un programme
    python3 mynion.py -p programme.mynion   affiche le Python généré
    python3 mynion.py                       console interactive (REPL)
"""

import builtins
import json
import random
import re
import sys

VERSION = "1.0"


# ═══════════════════════════════════════════════════════════════════════════
# 1. LE DICTIONNAIRE MINION → PYTHON
# ═══════════════════════════════════════════════════════════════════════════

MOTS_CLES = {
    # Structure du programme
    "pwede": "if",        # « Pwede na ? » = on peut ?
    "simikaru": "elif",   # « similaire »
    "nononio": "else",    # « non non »
    "paratu": "for",      # « para tú » = pour toi
    "dan": "in",          # dans
    "beedo": "while",     # « bee do bee do ! »
    "stupa": "break",     # « stupa ! » = stop
    "bananos": "continue",# banane suivante
    "minion": "def",      # crée ton propre minion
    "gelato": "return",   # rapporte la glace
    "recrute": "import",  # recrute un module
    # Logique
    "tiamo": "and",       # « ti amo » = l'amour relie
    "oula": "or",         # ou
    "nabanana": "not",    # pas banane
    "tulaliloo": "True",      # « tulaliloo ti amo » = on t'aime
    "bananonina": "False",    # « moche »
    # Fonctions de base
    "bello": "print",         # « Bello ! » = salut
    "poka": "input",          # « Po ka ? » = quoi ?
    "bananera": "range",      # le régime de bananes
    "muchos": "len",          # combien ?
    "hanadulsae": "int",      # « hana, dul, sae » = 1, 2, 3
    "blabla": "str",          # transformer en blabla (texte)
    # Affectation en un seul mot (équivalent de « me want »)
    "mewant": "=",
}

NOMBRES = {
    "gong": "0",      # 공 (zéro)
    "hana": "1",      # « hana, dul, sae ! » — les Minions comptent en coréen
    "dul": "2",
    "sae": "3",
    "net": "4",
    "daseot": "5",
    "yeoseot": "6",
    "ilgop": "7",
    "yeodeol": "8",
    "ahop": "9",
    "yeol": "10",
}

DEBUT_COMMENTAIRE = {"banana", "bananana", "poopaye"}

MOTS_RESERVES = sorted(
    set(MOTS_CLES) | set(NOMBRES) | DEBUT_COMMENTAIRE | {"me", "want"}
)


# ═══════════════════════════════════════════════════════════════════════════
# 2. LE TRANSPILEUR (Mynion → Python)
# ═══════════════════════════════════════════════════════════════════════════

# Découpe le code source en « jetons » : chaînes, noms, nombres, opérateurs…
TOKEN_RE = re.compile(
    r'''
      (?P<chaine>[rRbBuUfF]{0,2}(?:"""[\s\S]*?"""|\'\'\'[\s\S]*?\'\'\'|"[^"\n]*"|'[^'\n]*'))
    | (?P<commentaire>\#[^\n]*)
    | (?P<nom>[A-Za-z_\u00C0-\u024F][A-Za-z0-9_\u00C0-\u024F]*)
    | (?P<nombre>\d+(?:\.\d+)?)
    | (?P<operateur><=|>=|==|!=|//|\*\*|->|[+\-*/%<>=(){}\[\],:.@;])
    | (?P<espace>[ \t]+)
    | (?P<retour>\r?\n)
    | (?P<autre>.)
    ''',
    re.VERBOSE,
)


def transpile(src: str) -> str:
    """Traduit du code MYNION en code Python (ligne pour ligne)."""
    jetons = list(TOKEN_RE.finditer(src))
    sortie = []
    i, n = 0, len(jetons)
    while i < n:
        j = jetons[i]
        type_, texte = j.lastgroup, j.group()

        if type_ == "chaine":
            sortie.append(_transpile_chaine(texte))
            i += 1

        elif type_ == "nom":
            bas = texte.lower()

            # « me want » → « = »
            if bas == "me":
                k = i + 1
                while k < n and jetons[k].lastgroup == "espace":
                    k += 1
                if k < n and jetons[k].lastgroup == "nom" and jetons[k].group().lower() == "want":
                    sortie.append("=")
                    i = k + 1
                    continue

            # « banana … » / « bananana … » / « poopaye … » → commentaire
            if bas in DEBUT_COMMENTAIRE:
                fin = src.find("\n", j.start())
                if fin == -1:
                    fin = len(src)
                apres = src[j.end():fin]
                sortie.append(("# Poopaye !" if bas == "poopaye" else "#") + apres)
                i += 1
                while i < n and jetons[i].start() < fin:
                    i += 1
                continue

            # Mots-clés et nombres minions
            sortie.append(MOTS_CLES.get(bas, NOMBRES.get(bas, texte)))
            i += 1

        else:
            sortie.append(texte)
            i += 1

    return "".join(sortie)


def _transpile_chaine(texte: str) -> str:
    """Gère une chaîne : si c'est une f-string, traduit l'intérieur des {…}."""
    m = re.match(r"^([rRbBuUfF]{0,2})(.*)$", texte, re.DOTALL)
    prefixe, reste = m.group(1), m.group(2)
    if "f" not in prefixe.lower():
        return texte

    protégé = reste.replace("{{", "\x01").replace("}}", "\x02")

    def remplace(mo):
        return "{" + transpile(mo.group(1)) + "}"

    protégé = re.sub(r"\{([^{}\n]+)\}", remplace, protégé)
    return prefixe + protégé.replace("\x01", "{{").replace("\x02", "}}")


# ═══════════════════════════════════════════════════════════════════════════
# 3. LE RUNTIME (les talents que MYNION ajoute à Python)
# ═══════════════════════════════════════════════════════════════════════════

def surprise(a, b):
    """Un nombre surprise entre a et b (bornes comprises)."""
    return random.randint(int(a), int(b))


def pousse(liste, *valeurs):
    """Ajoute une (ou plusieurs) banane(s) au régime."""
    for v in valeurs:
        liste.append(v)
    return liste


def environnement() -> dict:
    """L'environnement d'exécution d'un programme Mynion."""
    return {
        "__builtins__": builtins,
        "__name__": "__main__",
        "surprise": surprise,
        "pousse": pousse,
    }


# ═══════════════════════════════════════════════════════════════════════════
# 4. LES ERREURS AMICALES
# ═══════════════════════════════════════════════════════════════════════════

class ErreurMynion(Exception):
    """Une erreur expliquée avec des mots de Mynion."""

    def __init__(self, type_err, message, ligne=None, amical=None):
        super().__init__(message)
        self.type = type_err
        self.message = message
        self.ligne = ligne
        self.amical = amical or f"Oups, le programme a trébuché ({type_err})."


def amicaliser(exc, message: str) -> str:
    t = type(exc).__name__
    if t == "NameError":
        m = re.search(r"name '([^']+)'", message)
        nom = m.group(1) if m else "?"
        return (
            f"Le minion « {nom} » n'existe pas. Crée-le avec me want, "
            f"ou vérifie son orthographe (les majuscules comptent !)."
        )
    if t in ("IndentationError", "TabError"):
        return ("Les bananes sont mal alignées ! Chaque bloc doit être indenté "
                "de 4 espaces, toujours pareil.")
    if t == "SyntaxError":
        return ("Les Minions n'arrivent pas à lire cette ligne. Vérifie les "
                "deux-points « : », les parenthèses et les guillemets "
                "(utilise \" et pas « »).")
    if t == "ZeroDivisionError":
        return ("Impossible de diviser par gong (0) ! Même un Minion ne peut "
                "pas partager zéro banane.")
    if t == "TypeError":
        return ("Tu mélanges des types différents (un texte avec un nombre ?). "
                "Essaie hanadulsae() ou blabla() pour convertir.")
    if t == "ValueError":
        return ("Hanadulsae n'arrive pas à compter ça : il faut un nombre en "
                "texte, comme \"42\".")
    if t == "EOFError":
        return ("Poka n'a rien reçu ! Écris la réponse du programme dans le "
                "panneau « Entrée » (une réponse par ligne).")
    if t == "IndexError":
        return ("Tu cherches une banane qui n'est pas dans le régime ! "
                "(indice trop grand ou négatif)")
    if t == "AttributeError":
        return "Ce minion ne connaît pas ce tour. Vérifie le nom après le point."
    if t == "UnboundLocalError":
        return "Cette variable est utilisée avant d'être créée avec me want."
    if t == "RecursionError":
        return ("Ce minion s'appelle lui-même sans arrêt ! Il faut une "
                "condition d'arrêt (pwede … stupa ou gelato).")
    if t == "KeyboardInterrupt":
        return "Stupa ! (interrompu)"
    return f"Oups, le programme a trébuché ({t})."


def executer_code(src: str, env: dict = None):
    """Transpile puis exécute du code Mynion dans l'environnement env."""
    py = transpile(src)
    env = environnement() if env is None else env
    try:
        code = compile(py, "<mynion>", "exec")
    except SyntaxError as e:
        raise ErreurMynion("SyntaxError", str(e.msg), getattr(e, "lineno", None),
                           amicaliser(e, str(e.msg))) from None
    try:
        exec(code, env)
    except SystemExit:
        raise
    except Exception as e:
        import traceback
        ligne = None
        for f in traceback.extract_tb(sys.exc_info()[2]):
            if f.filename == "<mynion>":
                ligne = f.lineno
        raise ErreurMynion(type(e).__name__, str(e), ligne,
                           amicaliser(e, str(e))) from None


def afficher_erreur(e: ErreurMynion, ligne_code: str = None):
    print("🍌💥 Oups ! " + e.amical, file=sys.stderr)
    if e.ligne:
        print(f"   Ligne Mynion {e.ligne} : {ligne_code or ''}", file=sys.stderr)
    print(f"   ({e.type} : {e.message})", file=sys.stderr)


# ═══════════════════════════════════════════════════════════════════════════
# 5. LA LIGNE DE COMMANDE
# ═══════════════════════════════════════════════════════════════════════════

def _lire(chemin: str) -> str:
    with open(chemin, encoding="utf-8-sig") as f:
        return f.read()


def executer_fichier(chemin: str, mode_ide: bool = False):
    src = _lire(chemin)
    lignes = src.split("\n")
    try:
        executer_code(src)
    except ErreurMynion as e:
        ligne_code = None
        if e.ligne and 0 < e.ligne <= len(lignes):
            ligne_code = lignes[e.ligne - 1].strip()
        if mode_ide:
            payload = {"type": e.type, "message": e.message, "ligne": e.ligne,
                       "ligne_code": ligne_code, "amical": e.amical}
            sys.stderr.write("MYNION_ERREUR\t" + json.dumps(payload, ensure_ascii=False) + "\n")
        else:
            afficher_erreur(e, ligne_code)
        sys.exit(1)
    except KeyboardInterrupt:
        print("🍌 Stupa ! (interrompu)", file=sys.stderr)
        sys.exit(130)


BANNIERE = """\
🍌 MYNION v{v} — Bello ! Je transpile ton Mynion en Python.
   Écris une ligne (ou colle un bloc). Tape « poopaye » pour partir.\
""".format(v=VERSION)


def repl():
    print(BANNIERE)
    env = environnement()
    tampon = []
    while True:
        try:
            ligne = input("mynion>>> " if not tampon else "mignion... ")
        except EOFError:
            print("\nPoopaye ! 👋")
            return 0
        except KeyboardInterrupt:
            print("\n🍌 Stupa !")
            tampon = []
            continue
        if tampon:
            if ligne.strip() == "":
                src = "\n".join(tampon)
                tampon = []
                try:
                    executer_code(src, env)
                except ErreurMynion as e:
                    afficher_erreur(e)
            else:
                tampon.append(ligne)
            continue
        prop = ligne.strip().lower()
        if prop in ("poopaye", "exit", "quit", "au revoir"):
            print("Poopaye ! 👋")
            return 0
        if not prop:
            continue
        if ligne.rstrip().endswith(":"):
            tampon.append(ligne)
            continue
        try:
            executer_code(ligne, env)
        except ErreurMynion as e:
            afficher_erreur(e, ligne.strip())


def main(argv=None):
    args = sys.argv[1:] if argv is None else argv
    if not args:
        return repl()
    if args[0] in ("-h", "--help"):
        print(__doc__)
        return 0
    if args[0] in ("-v", "--version"):
        print(f"MYNION v{VERSION} 🍌 — le langage des Minions (qui devient du Python)")
        return 0
    mode_ide = False
    if args[0] == "--ide":          # utilisé par l'IDE (erreurs en JSON sur stderr)
        mode_ide = True
        args = args[1:]
    if not args:
        print("Précise un fichier .mynion après --ide", file=sys.stderr)
        return 2
    if args[0] in ("-p", "--python"):
        if len(args) < 2:
            print("Précise un fichier .mynion (ex : mynion.py -p programme.mynion)", file=sys.stderr)
            return 2
        print(transpile(_lire(args[1])), end="")
        return 0
    executer_fichier(args[0], mode_ide=mode_ide)
    return 0


if __name__ == "__main__":
    sys.exit(main() or 0)
