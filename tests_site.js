/* 🍌 Tests du site MYNION — node tests_site.js
   1. Tests de l'interpréteur JavaScript (noyau)
   2. Validation automatique de TOUT le curriculum (les deux langues)
   3. Validation des exemples du Labo et du transpileur                */

const { Mynion, transpiler, surligner } = require("./site/src/noyau.js");
const { CURRICULUM, EXEMPLES, DICO, I18N } = require("./site/src/donnees.js");

let OK = 0, ECHEC = 0;
function test(nom, cond, detail) {
  if (cond) { OK++; console.log("  ✅ " + nom); }
  else { ECHEC++; console.log("  ❌ " + nom + (detail ? "  → " + detail : "")); }
}
function run(src, entree) {
  return Mynion.executer(src, { entree: entree || "" });
}
function norm(s) {
  return String(s).replace(/\r/g, "").split("\n").map((l) => l.replace(/[ \t]+$/, "")).join("\n").replace(/\n+$/, "");
}
function codeDe(x, lang) { if (x === undefined || x === null) return ""; return typeof x === "string" ? x : (x[lang] !== undefined ? x[lang] : x.fr); }

/* ═══ 1. INTERPRÉTEUR ═══ */
console.log("\n[1] Interpréteur Mynion (JS)");

test("hello world", run('bello("Bello !")').sortie === "Bello !\n");
test("commentaires banana/bananana/poopaye",
  run('banana note\nbananana grande note\nbello(1)\npoopaye au revoir').sortie === "1\n");
test("me want / mewant / =",
  run('a me want hana\nb mewant dul\nc = sae\nbello(a + b + c)').sortie === "6\n");
test("nombres minions + chiffres",
  run("bello(gong, hana, dul, sae, net, daseot, yeoseot, ilgop, yeodeol, ahop, yeol, 42, 3.5)").sortie
    === "0 1 2 3 4 5 6 7 8 9 10 42 3.5\n");
test("conditions pwede/simikaru/nononio",
  run('n me want yeol\npwede n < daseot :\n    bello("a")\nsimikaru n < yeoseot :\n    bello("b")\nnononio :\n    bello("c")').sortie === "c\n");
test("condition vraie",
  run('pwede hana < dul :\n    bello("oui")\nnononio :\n    bello("non")').sortie === "oui\n");
test("paratu + bananera exclut la borne",
  run("paratu i dan bananera(hana, yeol) :\n    bello(i)").sortie === "1\n2\n3\n4\n5\n6\n7\n8\n9\n");
test("beedo + décrément",
  run('n me want daseot\nbeedo n > gong :\n    bello(n)\n    n me want n - hana').sortie === "5\n4\n3\n2\n1\n");
test("stupa",
  run('paratu n dan bananera(hana, yeol) :\n    pwede n == daseot :\n        stupa\n    bello(n)').sortie === "1\n2\n3\n4\n");
test("bananos (pairs sautés)",
  run("paratu n dan bananera(gong, yeol) :\n    pwede n % dul == gong :\n        bananos\n    bello(n)").sortie === "1\n3\n5\n7\n9\n");
test("listes : index, remplacement, pousse, muchos, concat",
  run('l me want ["a", "b"]\nbello(l[gong])\nl[hana] me want "B"\nbello(l)\npousse(l, "c", "d")\nbello(muchos(l), l + ["e"])').sortie
    === "a\n['a', 'B']\n4 ['a', 'B', 'c', 'd', 'e']\n");
test("minion + gelato + paramètres",
  run('minion double(n) :\n    gelato n * dul\n\nminion salut(nom) :\n    gelato "Bello " + nom\n\nbello(double(dul * yeol + hana), salut("Bob"))').sortie
    === "42 Bello Bob\n");
test("fonction sans gelato → None", run('minion rien(n) :\n    bello(n)\n\nbello(rien(hana))').sortie === "1\nNone\n");
test("poka : echo du prompt + lecture multi-lignes",
  run('a me want poka("Q1 ? ")\nb me want poka("Q2 ? ")\nbello(a, b)', "x\ny").sortie === "Q1 ? Q2 ? x y\n");
test("poka sans réponse → erreur amicale",
  /Poka n'a rien reçu/.test(run('poka("Q ? ")').erreur.message));
test("hanadulsae", run('bello(hanadulsae("42") + hana, hanadulsae(3.9))').sortie === "43 3\n");
test("hanadulsae erreur", /Hanadulsae n'arrive pas/.test(run('hanadulsae("abc")').erreur.message));
test("blabla", run('bello("n = " + blabla(yeol))').sortie === "n = 10\n");
test("division / // % et par zéro",
  run("bello(yeol / yeol, yeol // daseot, yeol % daseot)").sortie === "1 2 0\n"
  && /zéro banane/.test(run("bello(hana / gong)").erreur.message));
test("répétition de texte", run('bello("ba" * dul, "-" * daseot)').sortie === "baba -----\n");
test("méthodes upper/lower", run('bello("banana".upper(), "GELATO".lower())').sortie === "BANANA gelato\n");
test("logique : tiamo/oula/nabanana",
  run('bello(tulaliloo tiamo bananonina, bananonina oula tulaliloo, nabanana bananonina)').sortie
    === "False True True\n");
test("court-circuit : poka non appelé si déjà faux",
  run('pwede bananonina tiamo poka("jamais ") == "x" :\n    bello("ok")', "").sortie === ""
  && !run('pwede bananonina tiamo poka("jamais ") == "x" :\n    bello("ok")', "").erreur);
test("surprise dans les bornes",
  Array.from({ length: 40 }, () => parseInt(run("bello(surprise(hana, yeoseot))").sortie, 10))
    .every((v) => v >= 1 && v <= 6));
test("boucle infinie → budget",
  /trop longtemps/.test(run("beedo tulaliloo :\n    x me want hana").erreur.message));
test("NameError amical", /Le minion « x » n'existe pas/.test(run("bello(x)").erreur.message));
test("erreur d'indentation amicale",
  /mal alignées|indente/i.test(run("pwede tulaliloo :\nbello(1)").erreur.message));
test("f-string refusé avec message",
  /f-strings/.test(run('bello(f"{x}")').erreur.message));
test("comparaisons", run("bello(hana == hana, hana != dul, dul < sae, yeol >= yeol, \"a\" == \"a\")").sortie
  === "True True True True True\n");
test("affectation index hors bornes", /absente du régime/.test(run('l me want ["a"]\nl[daseot] me want "x"').erreur.message));
test("programme vide OK", run("").erreur === undefined && run("banana rien\npoopaye").erreur === undefined);
test("python pur refusé proprement (print)", /Le minion « print » n'existe pas/.test(run('print("x")').erreur.message));

/* ═══ 2. VALIDATION DU CURRICULUM (fr + en) ═══ */
console.log("\n[2] Curriculum — validation du contenu (" + CURRICULUM.length + " leçons)");
const LANGS = ["fr", "en"];
let nbControles = 0, pbControles = 0;

for (const l of CURRICULUM) {
  for (const [iE, etape] of l.etapes.entries()) {
    const ou = `${l.id} · étape ${iE + 1} (${etape.type})`;
    for (const lang of LANGS) {
      /* theorie : le code doit produire la sortie affichée */
      if (etape.type === "theorie" && etape.code !== undefined && etape.sortie !== undefined) {
        const code = codeDe(etape.code, lang);
        if (code.includes("surprise")) continue; // sortie illustrative (hasard)
        const res = run(code, codeDe(etape.entree, lang));
        nbControles++;
        if (res.erreur || norm(res.sortie) !== norm(codeDe(etape.sortie, lang))) {
          pbControles++;
          console.log(`     ⚠️ ${ou} [${lang}] théorie : sortie ≠ attendu → ${JSON.stringify(res.sortie)} / err=${res.erreur && res.erreur.message}`);
        }
      }
      /* quiz avec code : l'option correcte doit être la sortie réelle */
      if (etape.type === "quiz" && etape.code !== undefined && etape.verifieSortie !== false) {
        const code = codeDe(etape.code, lang);
        if (code.includes("surprise")) continue;
        const res = run(code, codeDe(etape.entree, lang));
        const attendu = etape.options[lang][etape.bonne];
        nbControles++;
        if (res.erreur || norm(res.sortie) !== norm(attendu)) {
          pbControles++;
          console.log(`     ⚠️ ${ou} [${lang}] quiz : sortie=${JSON.stringify(res.sortie)} attendu=${JSON.stringify(attendu)} err=${res.erreur && res.erreur.message}`);
        }
      }
      /* ordre : les lignes dans l'ordre forment un programme valide */
      if (etape.type === "ordre") {
        nbControles++;
        const res = run(etape.lignes.join("\n"));
        if (res.erreur) {
          pbControles++;
          console.log(`     ⚠️ ${ou} ordre : ${res.erreur.message}`);
        }
      }
      /* ecriture : la solution doit produire exactement la sortie attendue */
      if (etape.type === "ecriture") {
        nbControles++;
        const res = run(codeDe(etape.solution, lang), codeDe(etape.entree, lang));
        if (res.erreur || norm(res.sortie) !== norm(codeDe(etape.attendu, lang))) {
          pbControles++;
          console.log(`     ⚠️ ${ou} [${lang}] écriture : obtenu=${JSON.stringify(res.sortie)} attendu=${JSON.stringify(codeDe(etape.attendu, lang))} err=${res.erreur && res.erreur.message}`);
        }
      }
    }
  }
}
test(`les ${nbControles} contrôles de contenu passent (fr+en)`, nbControles > 80 && pbControles === 0, `${pbControles} problème(s)`);

/* nombre d'étapes cohérent */
const nbEtapes = CURRICULUM.reduce((s, l) => s + l.etapes.length, 0);
test(`parcours complet : ${CURRICULUM.length} leçons, ${nbEtapes} étapes`, nbEtapes >= 60);
test("i18n fr/en complètes", !!I18N.fr.ui.parcours && !!I18N.en.ui.parcours && CURRICULUM.every((l) => l.titre.fr && l.titre.en));

/* ═══ 3. LABO + TRANSPILEUR ═══ */
console.log("\n[3] Labo, transpileur, coloration");

for (const [i, ex] of EXEMPLES.entries()) {
  for (const lang of LANGS) {
    const code = codeDe(ex.code, lang);
    const res = run(code, codeDe(ex.entree, lang));
    test(`exemple Labo ${i + 1} [${lang}] : ${codeDe(ex.t, lang).slice(0, 34)}`, !res.erreur, res.erreur && res.erreur.message);
  }
}

test("transpileur : bello → print", transpiler('bello("Bello !")') === 'print("Bello !")');
test("transpileur : banana → #", transpiler("banana note\npoopaye") === "# note\n# Poopaye !");
test("transpileur : me want → =", transpiler("age me want hana + dul") === "age = 1 + 2");
test("transpileur : mots-clés", transpiler("pwede nononio paratu dan beedo stupa minion gelato tiamo oula nabanana tulaliloo bananonina")
  === "if else for in while break def return and or not True False");
test("transpileur : chaînes intactes", transpiler('bello("banana pwede")') === 'print("banana pwede")');
test("transpileur : bananera/muchos/hanadulsae/blabla/poka", transpiler("bananera muchos hanadulsae blabla poka") === "range len int str input");
test("coloration : spans générés", surligner('banana note\nbello("x")').includes('<span class="c">') && surligner("bello").includes('<span class="k">'));

/* dico cohérent */
test("dictionnaire : " + DICO.length + " entrées complètes", DICO.every((e) => e.m && e.p && e.s && e.s.fr && e.s.en));

console.log(`\n═══ Résultat : ${OK} OK, ${ECHEC} échec(s) ${ECHEC === 0 ? "🍌 YOUPI !" : "💥"} ═══`);
process.exit(ECHEC ? 1 : 0);
