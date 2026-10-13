#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""🍌 Tests du transpileur MYNION — python3 tests_mynion.py"""

import io
import os
import subprocess
import sys
from contextlib import redirect_stdout

import mynion

OK = 0
ECHEC = 0


def test(nom, condition, detail=""):
    global OK, ECHEC
    if condition:
        OK += 1
        print(f"  ✅ {nom}")
    else:
        ECHEC += 1
        print(f"  ❌ {nom}  {detail}")


def sortie_de(src, entree=None):
    """Exécute du Mynion en interne et renvoie ce que bello() a affiché."""
    buf = io.StringIO()
    with redirect_stdout(buf):
        mynion.executer_code(src)
    return buf.getvalue()


def sortie_sous_processus(src, entree=""):
    """Exécute via la CLI (pour tester poka/input avec une entrée)."""
    import tempfile
    d = tempfile.mkdtemp(prefix="test_mynion_")
    chemin = os.path.join(d, "t.mynion")
    with open(chemin, "w", encoding="utf-8") as f:
        f.write(src)
    p = subprocess.run([sys.executable, "mynion.py", chemin],
                       input=entree, capture_output=True, text=True, timeout=10,
                       env=dict(os.environ, PYTHONIOENCODING="utf-8"))
    return p.stdout, p.stderr, p.returncode


print("🍌 Tests MYNION v" + mynion.VERSION)
print()

# ── Transpilation ──────────────────────────────────────────────────────────
print("[1] Transpilation")
test("hello world",
     mynion.transpile('bello("Bello !")') == 'print("Bello !")',
     mynion.transpile('bello("Bello !")'))
test("commentaire banana",
     mynion.transpile("banana une note\nbello(1)") == "# une note\nprint(1)",
     repr(mynion.transpile("banana une note\nbello(1)")))
test("commentaire bananana + poopaye",
     mynion.transpile("bananana bbb\npoopaye") == "# bbb\n# Poopaye !",
     repr(mynion.transpile("bananana bbb\npoopaye")))
test("me want → =",
     mynion.transpile("age me want hana + dul") == "age = 1 + 2",
     mynion.transpile("age me want hana + dul"))
test("mewant en un mot",
     mynion.transpile("x mewant sae") == "x = 3")
test("me seul reste une variable",
     mynion.transpile("me me want hana") == "me = 1",
     mynion.transpile("me me want hana"))
test("mots-clés de structure",
     mynion.transpile("pwede nononio simikaru paratu dan beedo stupa bananos minion gelato recrute")
     == "if else elif for in while break continue def return import",
     mynion.transpile("pwede nononio simikaru paratu dan beedo stupa bananos minion gelato recrute"))
test("logique",
     mynion.transpile("tiamo oula nabanana tulaliloo bananonina")
     == "and or not True False")
test("fonctions",
     mynion.transpile("bananera muchos hanadulsae blabla poka")
     == "range len int str input")
test("nombres 0 → 10",
     mynion.transpile("gong hana dul sae net daseot yeoseot ilgop yeodeol ahop yeol")
     == "0 1 2 3 4 5 6 7 8 9 10")
test("les chaînes restent intactes",
     mynion.transpile('bello("banana pwede bello hana")') == 'print("banana pwede bello hana")')
test("les identifiants contenant des mots-clés restent intacts",
     mynion.transpile("bananarama me want pwedette") == "bananarama = pwedette",
     mynion.transpile("bananarama me want pwedette"))
test("f-string : intérieur traduit",
     mynion.transpile('bello(f"{muchos(x)} bananes pour {nom}")')
     == 'print(f"{len(x)} bananes pour {nom}")',
     mynion.transpile('bello(f"{muchos(x)} bananes pour {nom}")'))
test("f-string : accolades littérales préservées",
     mynion.transpile('bello(f"{{banana}}")') == 'print(f"{{banana}}")')
test("majuscules", mynion.transpile("BELLO(1)") == "print(1)")
test("accents dans les identifiants",
     mynion.transpile("âge me want yeol") == "âge = 10")
test("les nombres du Python marchent aussi",
     mynion.transpile("bello(42, 3.14)") == "print(42, 3.14)")
test("commentaire # du Python accepté",
     mynion.transpile("# note\nbello(1)") == "# note\nprint(1)")

# ── Exécution ──────────────────────────────────────────────────────────────
print()
print("[2] Exécution")
test("hello world",
     sortie_de('bello("Bello !")') == "Bello !\n")
test("variables et calcul",
     sortie_de("bananes me want hana\nbananes me want bananes + dul\nbello(bananes)") == "3\n")
test("boucle paratu",
     sortie_de("paratu i dan bananera(hana, yeol):\n    bello(i)")
     == "1\n2\n3\n4\n5\n6\n7\n8\n9\n")
test("somme de 1 à 10",
     sortie_de("total me want gong\nparatu i dan bananera(hana, yeol + hana):\n    total me want total + i\nbello(total)")
     == "55\n")
test("condition pwede/simikaru/nononio",
     sortie_de("n me want yeol\npwede n < daseot:\n    bello(\"petit\")\nsimikaru n < yeoseot:\n    bello(\"moyen\")\nnononio:\n    bello(\"grand\")")
     == "grand\n")
test("beedo + stupa",
     sortie_de("c me want gong\nbeedo tulaliloo:\n    c me want c + hana\n    pwede c == daseot:\n        stupa\nbello(c)")
     == "5\n")
test("bananos (continue)",
     sortie_de("paratu n dan bananera(gong, yeol):\n    pwede n % dul == gong:\n        bananos\n    bello(n)")
     == "1\n3\n5\n7\n9\n")
test("fonction minion + gelato",
     sortie_de("minion double(n):\n    gelato n * dul\nbello(double(dul * yeol + hana))")
     == "42\n")
test("liste + pousse + muchos",
     sortie_de('l me want ["a"]\npousse(l, "b")\nbello(muchos(l))') == "2\n")
test("surprise dans les bornes",
     all(1 <= int(sortie_de("bello(surprise(hana, yeoseot))")) <= 6 for _ in range(30)))
test("logique tiamo/oula/nabanana",
     sortie_de("pwede bananonina oula tulaliloo:\n    bello(\"oui\")\nnononio:\n    bello(\"non\")")
     == "oui\n"
     and sortie_de("pwede nabanana bananonina:\n    bello(\"vrai\")") == "vrai\n")
test("modulo", sortie_de("bello(yeol % sae)") == "1\n")
test("python pur accepté (bilingue)",
     sortie_de('print("python ok")') == "python ok\n")

# ── CLI avec entrée utilisateur (poka) ─────────────────────────────────────
print()
print("[3] CLI + poka/input")
out, err, rc = sortie_sous_processus(
    'nom me want poka("Comment t\'appelles-tu ? ")\nbello("Bello,", nom, "!")',
    entree="Kevin\n")
test("poka lit l'entrée", rc == 0 and out == "Comment t'appelles-tu ? Bello, Kevin !\n",
     repr(out) + repr(err))

out, err, rc = sortie_sous_processus(
    "age me want hanadulsae(poka(\"Age ? \"))\nbello(age + hana)", entree="41\n")
test("hanadulsae convertit", rc == 0 and out == "Age ? 42\n", repr(out))

out, err, rc = sortie_sous_processus("bello(inconnu)")
test("NameError détecté", rc == 1 and "inconnu" in err and "MYNION_ERREUR" not in err, repr(err))

# ── Erreurs amicales ───────────────────────────────────────────────────────
print()
print("[4] Erreurs amicales")
try:
    mynion.executer_code("x me want gong\nbello(1)\nbello(y)\n")
    test("erreur levée", False)
except mynion.ErreurMynion as e:
    test("NameError → ligne 3", e.ligne == 3 and "inconnu" not in e.amical and "minion" in e.amical.lower(),
         f"ligne={e.ligne} amical={e.amical}")

try:
    mynion.executer_code("bello(hana / gong)")
    test("ZeroDivision levée", False)
except mynion.ErreurMynion as e:
    test("ZeroDivision → message banane", "zéro banane" in e.amical, e.amical)

try:
    mynion.executer_code("pwede x")
    test("SyntaxError levée", False)
except mynion.ErreurMynion as e:
    test("SyntaxError → message amical", "lire cette ligne" in e.amical, e.amical)

try:
    mynion.executer_code("pwede hana:\nbello(1)")
    test("IndentationError levée", False)
except mynion.ErreurMynion as e:
    test("IndentationError → bananes mal alignées", "align" in e.amical, e.amical)

# ── Tous les exemples du cours markdown ────────────────────────────────────
print()
print("[5] Les blocs de code du cours s'exécutent")
import re as _re
md = open(os.path.join(os.path.dirname(__file__), "cours_mynion.md"), encoding="utf-8").read()
blocs = _re.findall(r"```mynion\n(.*?)```", md, _re.DOTALL)
testes, passes = 0, 0
for b in blocs:
    if "poka(" in b:      # ceux-là demandent une entrée utilisateur
        continue
    testes += 1
    try:
        sortie_de(b)
        passes += 1
    except Exception as ex:
        print(f"     ⚠️ bloc en échec : {ex}\n{b}")
test(f"{passes}/{testes} blocs sans poka s'exécutent", passes == testes and testes > 5,
     f"{passes}/{testes}")

# ── Les fichiers d'exemples ─────────────────────────────────────────────────
print()
print("[6] Les fichiers exemples/")
dossier = os.path.join(os.path.dirname(__file__), "exemples")
ENTREES = {  # entrée simulée pour les exemples qui posent des questions
    "06_poka.mynion": "Kevin\n",
    "07_conditions.mynion": "12\n",
    "16_mystere.mynion": "\n".join(str(i) for i in range(1, 101)) + "\n",
}
fichiers = sorted(f for f in os.listdir(dossier) if f.endswith(".mynion")) if os.path.isdir(dossier) else []
for f in fichiers:
    p = subprocess.run([sys.executable, "mynion.py", os.path.join(dossier, f)],
                       input=ENTREES.get(f, ""), capture_output=True, text=True, timeout=10,
                       env=dict(os.environ, PYTHONIOENCODING="utf-8"))
    test(f, p.returncode == 0, p.stderr[:120])

print()
print(f"═══ Résultat : {OK} OK, {ECHEC} échec(s) {'🍌 YOUPI !' if ECHEC == 0 else '💥'} ═══")
sys.exit(1 if ECHEC else 0)
