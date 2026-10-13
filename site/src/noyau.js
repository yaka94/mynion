/* ═══════════════════════════════════════════════════════════════════════════
   🍌 NOYAU MYNION (JavaScript) — lexer, analyseur, interpréteur,
   transpileur (→ Python) et coloration syntaxique.
   S'exécute à 100 % dans le navigateur : aucun serveur nécessaire.
   ═══════════════════════════════════════════════════════════════════════════ */
"use strict";

/* ── Dictionnaires partagés ─────────────────────────────────────────────── */
const MOTS_STRUCTURE = {
  pwede: "if", simikaru: "elif", nononio: "else",
  paratu: "for", dan: "in", beedo: "while",
  stupa: "break", bananos: "continue",
  minion: "def", gelato: "return", recrute: "import",
  tiamo: "and", oula: "or", nabanana: "not",
  tulaliloo: "True", bananonina: "False",
  bello: "print", poka: "input", bananera: "range",
  muchos: "len", hanadulsae: "int", blabla: "str",
  mewant: "=",
};
const MOTS_NOMBRES = {
  gong: 0, hana: 1, dul: 2, sae: 3, net: 4, daseot: 5,
  yeoseot: 6, ilgop: 7, yeodeol: 8, ahop: 9, yeol: 10,
};
const MOTS_COMMENTAIRE = ["banana", "bananana", "poopaye"];
const MOTS_INBUILT = ["pousse", "surprise"];

/* ═══════════════════ 1. LEXER ═══════════════════ */
function estLettreNom(c) {
  return /[A-Za-z_\u00C0-\u024F]/.test(c);
}
function estCharNom(c) {
  return /[A-Za-z0-9_\u00C0-\u024F]/.test(c);
}
function motA(s, k) {
  let j = k;
  while (j < s.length && estCharNom(s[j])) j++;
  return s.slice(k, j).toLowerCase();
}

class ErreurMynion extends Error {
  constructor(message, ligne) {
    super(message);
    this.ligne = ligne;
    this.mynion = true;
  }
}

function lexique(src) {
  const T = [];
  let i = 0, ligne = 1;
  const n = src.length;
  const pile = [0];
  let debutLigne = true;
  let prof = 0; // profondeur ( [ — pas d'indentation dans les continuations

  function aj(type, val) { T.push({ type, val, ligne }); }
  function traiterIndente(indent) {
    const haut = pile[pile.length - 1];
    if (indent > haut) { pile.push(indent); aj("INDENT"); }
    else if (indent < haut) {
      while (pile[pile.length - 1] > indent) { pile.pop(); aj("DEDENT"); }
      if (pile[pile.length - 1] !== indent) throw new ErreurMynion("Les bananes sont mal alignées ! Chaque bloc doit être indenté de 4 espaces, toujours pareil.", ligne);
    }
  }

  while (i < n) {
    const c = src[i];

    /* fin de ligne */
    if (c === "\n") {
      if (prof === 0 && T.length && T[T.length - 1].type !== "NL" && T[T.length - 1].type !== "INDENT" && T[T.length - 1].type !== "DEDENT") aj("NL");
      ligne++; i++; debutLigne = true;
      continue;
    }

    /* indentation en début de ligne (même si la ligne ne commence pas par une espace !) */
    if (debutLigne) {
      if (c === " " || c === "\t") {
        let indent = 0;
        while (i < n && (src[i] === " " || src[i] === "\t")) { indent += (src[i] === "\t") ? 4 : 1; i++; }
        const resteVide = (i >= n || src[i] === "\n" || src[i] === "#" || MOTS_COMMENTAIRE.includes(motA(src, i)));
        if (!resteVide && prof === 0) traiterIndente(indent);
        debutLigne = false;
        continue;
      }
      if (c !== "#") {
        /* la ligne commence directement par du code → indentation 0 */
        if (prof === 0 && !MOTS_COMMENTAIRE.includes(motA(src, i))) traiterIndente(0);
        debutLigne = false;
      }
    }

    if (c === " " || c === "\t") { i++; continue; }
    debutLigne = false;

    /* commentaire # du Python (accepté) */
    if (c === "#") { while (i < n && src[i] !== "\n") i++; continue; }

    /* chaîne de caractères */
    if (c === '"' || c === "'") {
      let j = i + 1, s = "";
      while (j < n && src[j] !== c && src[j] !== "\n") {
        if (src[j] === "\\") {
          const d = src[j + 1];
          if (d === "n") s += "\n";
          else if (d === "t") s += "\t";
          else if (d === "\\") s += "\\";
          else if (d === '"') s += '"';
          else if (d === "'") s += "'";
          else s += d === undefined ? "" : d;
          j += 2;
        } else { s += src[j]; j++; }
      }
      if (j >= n || src[j] === "\n") throw new ErreurMynion("Guillemet non fermé — il manque un \" quelque part sur cette ligne.", ligne);
      aj("CHAINE", s);
      i = j + 1;
      continue;
    }

    /* nom / mot-clé */
    if (estLettreNom(c)) {
      let j = i;
      while (j < n && estCharNom(src[j])) j++;
      const bas = src.slice(i, j).toLowerCase();

      /* « me want » → affectation */
      if (bas === "me") {
        let k = j;
        while (k < n && (src[k] === " " || src[k] === "\t")) k++;
        if (src.slice(k, k + 4).toLowerCase() === "want" && (k + 4 >= n || !estCharNom(src[k + 4]))) {
          aj("AFFECT", "=");
          i = k + 4;
          continue;
        }
      }
      if (bas === "mewant") { aj("AFFECT", "="); i = j; continue; }

      /* commentaire banana */
      if (MOTS_COMMENTAIRE.includes(bas)) { while (i < n && src[i] !== "\n") i++; continue; }

      /* f-string → pas (encore) supporté */
      if ((bas === "f" || bas === "rf" || bas === "fr") && (src[j] === '"' || src[j] === "'")) {
        throw new ErreurMynion("Le Labo ne gère pas encore les f-strings — colle avec + et convertis avec blabla().", ligne);
      }

      /* nombre minion */
      if (bas in MOTS_NOMBRES) { aj("NOMBRE", MOTS_NOMBRES[bas]); i = j; continue; }

      aj("NOM", src.slice(i, j));
      i = j;
      continue;
    }

    /* nombre */
    if (c >= "0" && c <= "9") {
      let j = i;
      while (j < n && ((src[j] >= "0" && src[j] <= "9") || src[j] === ".")) j++;
      aj("NOMBRE", parseFloat(src.slice(i, j)));
      i = j;
      continue;
    }

    /* opérateurs */
    const deux = src.substr(i, 2);
    if (deux === "**" || deux === "//" || deux === "==" || deux === "!=" || deux === "<=" || deux === ">=") {
      aj("OP", deux); i += 2; continue;
    }
    if ("+-*/%<>=()[]{},:.".includes(c)) {
      if (c === "(" || c === "[") prof++;
      if (c === ")" || c === "]") prof = Math.max(0, prof - 1);
      aj("OP", c); i++;
      continue;
    }
    if (c === "!") throw new ErreurMynion("Le « ! » tout seul n'existe pas : la différence, c'est « != ».", ligne);
    if (c === ";") throw new ErreurMynion("Un Mynion n'écrit qu'une instruction par ligne — pas de « ; ».", ligne);
    throw new ErreurMynion("Caractère inconnu : « " + c + " »", ligne);
  }
  if (T.length && T[T.length - 1].type !== "NL") aj("NL");
  while (pile.length > 1) { pile.pop(); aj("DEDENT"); }
  aj("FIN");
  return T;
}

/* ═══════════════════ 2. ANALYSEUR (parser) ═══════════════════ */
function analyser(T) {
  let p = 0;
  const voir = () => T[p];
  function estOP(v) { const t = T[p]; return t.type === "OP" && t.val === v; }
  function estMot(v) { const t = T[p]; return t.type === "NOM" && t.val.toLowerCase() === v; }
  function estAffect() { const t = T[p]; return t.type === "AFFECT" || (t.type === "OP" && t.val === "="); }
  function av() { return T[p++]; }
  function attendreOP(v) {
    if (!estOP(v)) throw new ErreurMynion("Il manque « " + v + " » ici (regard : " + (T[p].val ?? "") + ").", T[p].ligne);
    av();
  }
  function attendreMot(v, autre) {
    if (!estMot(v) && !(autre && estMot(autre))) {
      throw new ErreurMynion("Je m'attendais à « " + v + " » ici.", T[p].ligne);
    }
    av();
  }

  function programme() {
    const instrs = [];
    while (voir().type !== "FIN") {
      if (voir().type === "NL") { av(); continue; }
      instrs.push(instruction());
    }
    return { t: "bloc", instrs };
  }

  function bloc() {
    if (voir().type === "NL") {
      av();
      if (voir().type !== "INDENT") throw new ErreurMynion("Bloc vide — indente la ligne suivante de 4 espaces (l'échelle à bananes !).", voir().ligne);
      av();
      const instrs = [];
      while (voir().type !== "DEDENT" && voir().type !== "FIN") {
        if (voir().type === "NL") { av(); continue; }
        instrs.push(instruction());
      }
      if (voir().type === "DEDENT") av();
      return { t: "bloc", instrs };
    }
    return { t: "bloc", instrs: [instruction()] };
  }

  function instruction() {
    const t = voir();
    if (t.type === "NOM") {
      const bas = t.val.toLowerCase();
      if (bas === "pwede") return instructionSi();
      if (bas === "paratu") return instructionPour();
      if (bas === "beedo") return instructionTantque();
      if (bas === "minion") return instructionMinion();
      if (bas === "gelato") {
        av();
        const fin = voir().type === "NL" || voir().type === "FIN" || voir().type === "DEDENT";
        return { t: "gelato", valeur: fin ? null : expression(), ligne: t.ligne };
      }
      if (bas === "stupa") { av(); return { t: "stupa", ligne: t.ligne }; }
      if (bas === "bananos") { av(); return { t: "bananos", ligne: t.ligne }; }
      if (bas === "recrute") throw new ErreurMynion("Le Labo n'a pas besoin de recruter de module — surprise() est déjà dans le repaire !", t.ligne);
    }
    /* affectation ou expression */
    if (t.type === "NOM") {
      const sauve = p;
      const nom = av().val;
      if (estAffect()) { av(); return { t: "affect", nom, valeur: expression(), ligne: t.ligne }; }
      if (estOP("[")) {
        av();
        const idx = expression();
        attendreOP("]");
        if (estAffect()) { av(); return { t: "affectIndex", nom, idx, valeur: expression(), ligne: t.ligne }; }
        p = sauve;
      } else {
        p = sauve;
      }
    }
    if (estAffect()) throw new ErreurMynion("Une affectation commence par le nom de la boîte : nom me want valeur.", t.ligne);
    return { t: "expr", valeur: expression(), ligne: t.ligne };
  }

  function instructionSi() {
    const ligne = voir().ligne;
    attendreMot("pwede");
    const branches = [];
    const cond = expression();
    attendreOP(":");
    branches.push({ cond, bloc: bloc() });
    let sinon = null;
    while (true) {
      if (estMot("simikaru")) {
        av();
        const c2 = expression();
        attendreOP(":");
        branches.push({ cond: c2, bloc: bloc() });
        continue;
      }
      if (estMot("nononio")) {
        av();
        attendreOP(":");
        sinon = bloc();
        break;
      }
      break;
    }
    return { t: "si", branches, sinon, ligne };
  }

  function instructionPour() {
    const ligne = voir().ligne;
    attendreMot("paratu");
    if (voir().type !== "NOM") throw new ErreurMynion("Il faut un nom de variable après paratu.", voir().ligne);
    const nom = av().val;
    attendreMot("dan", "in");
    const it = expression();
    attendreOP(":");
    return { t: "pour", nom, it, corps: bloc(), ligne };
  }

  function instructionTantque() {
    const ligne = voir().ligne;
    attendreMot("beedo");
    const cond = expression();
    attendreOP(":");
    return { t: "tantque", cond, corps: bloc(), ligne };
  }

  function instructionMinion() {
    const ligne = voir().ligne;
    attendreMot("minion");
    if (voir().type !== "NOM") throw new ErreurMynion("Il faut un nom de minion après minion (ex : minion saluer(nom) :).", voir().ligne);
    const nom = av().val;
    attendreOP("(");
    const params = [];
    if (!estOP(")")) {
      if (voir().type !== "NOM") throw new ErreurMynion("Nom de paramètre invalide.", voir().ligne);
      params.push(av().val);
      while (estOP(",")) { av(); if (voir().type !== "NOM") throw new ErreurMynion("Nom de paramètre invalide.", voir().ligne); params.push(av().val); }
    }
    attendreOP(")");
    attendreOP(":");
    return { t: "minion", nom, params, corps: bloc(), ligne };
  }

  /* ── expressions (précédence croissante) ── */
  function expression() { return exprOu(); }
  function exprOu() {
    let g = exprEt();
    while (estMot("oula")) { av(); const d = exprEt(); g = { t: "bin", op: "oula", g, d }; }
    return g;
  }
  function exprEt() {
    let g = exprNon();
    while (estMot("tiamo")) { av(); const d = exprNon(); g = { t: "bin", op: "tiamo", g, d }; }
    return g;
  }
  function exprNon() {
    if (estMot("nabanana")) { av(); return { t: "non", e: exprNon() }; }
    return comparaison();
  }
  function comparaison() {
    let g = arith();
    const OPS = ["==", "!=", "<", "<=", ">", ">="];
    while (voir().type === "OP" && OPS.includes(voir().val)) {
      const op = av().val;
      g = { t: "bin", op, g, d: arith() };
    }
    return g;
  }
  function arith() {
    let g = terme();
    while (estOP("+") || estOP("-")) { const op = av().val; g = { t: "bin", op, g, d: terme() }; }
    return g;
  }
  function terme() {
    let g = unaire();
    while (estOP("*") || estOP("/") || estOP("//") || estOP("%")) { const op = av().val; g = { t: "bin", op, g, d: unaire() }; }
    return g;
  }
  function unaire() {
    if (estOP("-")) { av(); return { t: "neg", e: unaire() }; }
    if (estOP("+")) { av(); return unaire(); }
    return puissance();
  }
  function puissance() {
    const b = postfixe();
    if (estOP("**")) { av(); return { t: "bin", op: "**", g: b, d: unaire() }; }
    return b;
  }
  function postfixe() {
    let e = atome();
    while (true) {
      if (estOP("[")) { av(); const idx = expression(); attendreOP("]"); e = { t: "index", e, idx }; continue; }
      if (estOP(".")) {
        av();
        if (voir().type !== "NOM") throw new ErreurMynion("Il faut un nom de méthode après le point.", voir().ligne);
        const m = av().val;
        let args = [];
        if (estOP("(")) { av(); args = listeArgs(); }
        e = { t: "methode", e, nom: m, args };
        continue;
      }
      break;
    }
    return e;
  }
  function listeArgs() {
    const args = [];
    if (!estOP(")")) {
      args.push(expression());
      while (estOP(",")) { av(); args.push(expression()); }
    }
    attendreOP(")");
    return args;
  }
  function atome() {
    const t = voir();
    if (t.type === "NOMBRE" || t.type === "CHAINE") { av(); return { t: "const", val: t.val }; }
    if (t.type === "NOM") {
      const bas = t.val.toLowerCase();
      if (bas === "tulaliloo") { av(); return { t: "const", val: true }; }
      if (bas === "bananonina") { av(); return { t: "const", val: false }; }
      if (MOTS_STRUCTURE[bas] && bas !== "bello" && bas !== "poka" && bas !== "bananera" && bas !== "muchos" && bas !== "hanadulsae" && bas !== "blabla" && bas !== "mewant") {
        throw new ErreurMynion("« " + t.val + " » est un mot-clé, il ne peut pas être utilisé comme valeur ici.", t.ligne);
      }
      av();
      if (estOP("(")) { av(); return { t: "appel", nom: t.val, args: listeArgs(), ligne: t.ligne }; }
      return { t: "var", nom: t.val };
    }
    if (estOP("(")) { av(); const e = expression(); attendreOP(")"); return e; }
    if (estOP("[")) {
      av();
      const items = [];
      if (!estOP("]")) {
        items.push(expression());
        while (estOP(",")) { av(); items.push(expression()); }
      }
      attendreOP("]");
      return { t: "liste", items };
    }
    if (t.type === "NL" || t.type === "FIN" || t.type === "DEDENT") {
      throw new ErreurMynion("Expression incomplète — il manque quelque chose à la fin de la ligne.", t.ligne);
    }
    throw new ErreurMynion("Je ne comprends pas « " + t.val + " » dans cette expression.", t.ligne);
  }

  const ast = programme();
  if (voir().type !== "FIN") throw new ErreurMynion("Il y a quelque chose en trop à la fin du programme ici.", voir().ligne);
  return ast;
}

/* ═══════════════════ 3. INTERPRÉTEUR ═══════════════════ */
function creerEnv(parent) { return { vars: new Map(), parent }; }
function chercherEnv(env, nom) {
  let e = env;
  while (e) { if (e.vars.has(nom)) return e; e = e.parent; }
  return null;
}
function verite(v) {
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v !== 0;
  if (typeof v === "string") return v.length > 0;
  if (Array.isArray(v)) return v.length > 0;
  return false;
}
function egal(a, b) {
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let k = 0; k < a.length; k++) { if (!egal(a[k], b[k])) return false; }
    return true;
  }
  if (typeof a === "boolean" || typeof b === "boolean") {
    return a === b;
  }
  return a === b;
}
function repr(v) {
  if (typeof v === "string") {
    const q = (v.includes("'") && !v.includes('"')) ? '"' : "'";
    return q + v + q;
  }
  return versTexte(v);
}
function versTexte(v) {
  if (typeof v === "boolean") return v ? "True" : "False";
  if (typeof v === "number") return String(v);
  if (typeof v === "string") return v;
  if (Array.isArray(v)) return "[" + v.map(repr).join(", ") + "]";
  if (v === null || v === undefined) return "None";
  return String(v);
}
function nombreEntier(v, ligne, qui) {
  if (typeof v === "number" && Number.isInteger(v)) return v;
  if (typeof v === "number") return Math.trunc(v);
  throw new ErreurMynion(qui + " attend un nombre entier.", ligne);
}

const Mynion = (function () {

  function executer(src, options) {
    options = options || {};
    const entreeBrute = options.entree || "";
    const file = entreeBrute === "" ? [] : entreeBrute.replace(/\n+$/, "").split("\n");
    const ctx = { sortie: "", file, pas: 0, MAX_PAS: 250000 };
    const globalEnv = creerEnv(null);

    let ast;
    try {
      ast = analyser(lexique(src));
    } catch (e) {
      return { sortie: ctx.sortie, erreur: { message: e.message, ligne: e.ligne } };
    }
    try {
      execBloc(ast, globalEnv, ctx);
      return { sortie: ctx.sortie };
    } catch (e) {
      if (e && e.signal === "gelato") {
        return { sortie: ctx.sortie, erreur: { message: "Un gelato en dehors d'un minion ? Chaque glace a sa place !", ligne: e.ligne } };
      }
      if (e && e.signal === "stupa") {
        return { sortie: ctx.sortie, erreur: { message: "Stupa (stop) en dehors d'une boucle beedo/paratu !", ligne: e.ligne } };
      }
      if (e && e.signal === "bananos") {
        return { sortie: ctx.sortie, erreur: { message: "Bananos (continue) en dehors d'une boucle !", ligne: e.ligne } };
      }
      return { sortie: ctx.sortie, erreur: { message: e.mynion ? e.message : "Erreur interne du Labo : " + e.message, ligne: e.ligne } };
    }
  }

  function budget(ctx, ligne) {
    if (++ctx.pas > ctx.MAX_PAS) {
      throw new ErreurMynion("Le programme travaille trop longtemps… boucle beedo infinie ? Vérifie qu'elle s'arrête un jour (stupa !).", ligne);
    }
  }

  function execBloc(bloc, env, ctx) {
    for (const instr of bloc.instrs) execInstr(instr, env, ctx);
  }

  function execInstr(instr, env, ctx) {
    budget(ctx, instr.ligne);
    switch (instr.t) {
      case "affect":
        env.vars.set(instr.nom, evalExpr(instr.valeur, env, ctx));
        return;
      case "affectIndex": {
        const cible = evalExpr({ t: "var", nom: instr.nom }, env, ctx);
        const idx = evalExpr(instr.idx, env, ctx);
        const val = evalExpr(instr.valeur, env, ctx);
        if (!Array.isArray(cible)) throw new ErreurMynion("Seuls les régimes (listes) acceptent un remplacement par indice.", instr.ligne);
        const i2 = nombreEntier(idx, instr.ligne, "L'indice");
        if (i2 < 0 || i2 >= cible.length) throw new ErreurMynion("Tu cherches une banane absente du régime ! (indice " + i2 + " sur une liste de " + cible.length + ")", instr.ligne);
        cible[i2] = val;
        return;
      }
      case "si": {
        for (const br of instr.branches) {
          if (verite(evalExpr(br.cond, env, ctx))) { execBloc(br.bloc, env, ctx); return; }
        }
        if (instr.sinon) execBloc(instr.sinon, env, ctx);
        return;
      }
      case "pour": {
        const it = evalExpr(instr.it, env, ctx);
        if (!Array.isArray(it)) throw new ErreurMynion("On ne peut parcourir qu'un régime (liste) ou bananera(…).", instr.ligne);
        for (const element of it) {
          budget(ctx, instr.ligne);
          env.vars.set(instr.nom, element);
          try { execBloc(instr.corps, env, ctx); }
          catch (e) {
            if (e && e.signal === "stupa") break;
            if (!(e && e.signal === "bananos")) throw e;
          }
        }
        return;
      }
      case "tantque": {
        while (verite(evalExpr(instr.cond, env, ctx))) {
          budget(ctx, instr.ligne);
          try { execBloc(instr.corps, env, ctx); }
          catch (e) {
            if (e && e.signal === "stupa") break;
            if (!(e && e.signal === "bananos")) throw e;
          }
        }
        return;
      }
      case "minion":
        env.vars.set(instr.nom, { fonction: true, params: instr.params, corps: instr.corps, env, nom: instr.nom });
        return;
      case "gelato":
        throw Object.assign(new Error("gelato"), { signal: "gelato", valeur: evalExpr(instr.valeur, env, ctx), ligne: instr.ligne });
      case "stupa":
        throw Object.assign(new Error("stupa"), { signal: "stupa", ligne: instr.ligne });
      case "bananos":
        throw Object.assign(new Error("bananos"), { signal: "bananos", ligne: instr.ligne });
      case "expr":
        evalExpr(instr.valeur, env, ctx);
        return;
    }
  }

  /* ── builtins ── */
  const BUILTINS = {
    bello(args, ctx) {
      ctx.sortie += args.map(versTexte).join(" ") + "\n";
      return null;
    },
    poka(args, ctx, ligne) {
      if (args.length > 1) throw new ErreurMynion("poka prend au maximum une question : poka(\"Ta question ? \")", ligne);
      if (args.length === 1) ctx.sortie += versTexte(args[0]);
      const rep = ctx.file.shift();
      if (rep === undefined) throw new ErreurMynion("Poka n'a rien reçu ! Écris la réponse dans le panneau « Entrée » (une réponse par ligne).", ligne);
      return rep;
    },
    bananera(args, ligne) {
      if (args.length < 1 || args.length > 3) throw new ErreurMynion("bananera attend 1, 2 ou 3 nombres : bananera(10) ou bananera(1, 10).", ligne);
      let a = 0, b = 0, pas2 = 1;
      if (args.length === 1) { b = nombreEntier(args[0], ligne, "bananera"); }
      else {
        a = nombreEntier(args[0], ligne, "bananera");
        b = nombreEntier(args[1], ligne, "bananera");
        if (args.length === 3) pas2 = nombreEntier(args[2], ligne, "bananera");
      }
      if (pas2 === 0) throw new ErreurMynion("Le pas de bananera est gong (0) — le régime tournerait en rond pour toujours !", ligne);
      const resultat = [];
      if (pas2 > 0) for (let v = a; v < b; v += pas2) { resultat.push(v); if (resultat.length > 50000) throw new ErreurMynion("Le régime est trop grand pour le Labo !", ligne); }
      else for (let v = a; v > b; v += pas2) { resultat.push(v); if (resultat.length > 50000) throw new ErreurMynion("Le régime est trop grand pour le Labo !", ligne); }
      return resultat;
    },
    muchos(args, ligne) {
      if (args.length !== 1) throw new ErreurMynion("muchos attend exactement 1 valeur.", ligne);
      const v = args[0];
      if (typeof v === "string" || Array.isArray(v)) return v.length;
      throw new ErreurMynion("muchos compte les lettres d'un texte ou les bananes d'une liste.", ligne);
    },
    hanadulsae(args, ligne) {
      if (args.length !== 1) throw new ErreurMynion("hanadulsae attend exactement 1 valeur.", ligne);
      const v = args[0];
      if (typeof v === "number") return Math.trunc(v);
      if (typeof v === "boolean") return v ? 1 : 0;
      if (typeof v === "string") {
        const s = v.trim();
        if (/^[+-]?\d+$/.test(s)) return parseInt(s, 10);
        throw new ErreurMynion("Hanadulsae n'arrive pas à compter « " + s + " » — il faut un nombre entier en texte, comme \"42\".", ligne);
      }
      throw new ErreurMynion("hanadulsae convertit un texte en nombre (ou arrondit un nombre).", ligne);
    },
    blabla(args) {
      if (args.length !== 1) throw new ErreurMynion("blabla attend exactement 1 valeur.");
      return versTexte(args[0]);
    },
    surprise(args, ligne) {
      if (args.length !== 2) throw new ErreurMynion("surprise attend 2 nombres : surprise(hana, yeoseot).", ligne);
      const a = nombreEntier(args[0], ligne, "surprise");
      const b = nombreEntier(args[1], ligne, "surprise");
      const lo = Math.min(a, b), hi = Math.max(a, b);
      return lo + Math.floor(Math.random() * (hi - lo + 1));
    },
    pousse(args, ligne) {
      if (args.length < 2) throw new ErreurMynion("pousse attend une liste puis des valeurs : pousse(minions, \"Otto\").", ligne);
      if (!Array.isArray(args[0])) throw new ErreurMynion("Le premier argument de pousse doit être un régime (liste).", ligne);
      for (let k = 1; k < args.length; k++) args[0].push(args[k]);
      return args[0];
    },
  };

  function evalExpr(e, env, ctx) {
    switch (e.t) {
      case "const":
        return e.val;
      case "var": {
        const env2 = chercherEnv(env, e.nom);
        if (env2) return env2.vars.get(e.nom);
        throw new ErreurMynion("Le minion « " + e.nom + " » n'existe pas. Crée-le avec me want, ou vérifie l'orthographe (les majuscules comptent !).", e.ligne);
      }
      case "liste":
        return e.items.map((it) => evalExpr(it, env, ctx));
      case "index": {
        const cible = evalExpr(e.e, env, ctx);
        const idx = evalExpr(e.idx, env, ctx);
        const i2 = nombreEntier(idx, e.ligne, "L'indice");
        if (Array.isArray(cible)) {
          if (i2 < 0 || i2 >= cible.length) throw new ErreurMynion("Tu cherches une banane absente du régime ! (indice " + i2 + " sur une liste de " + cible.length + ")", e.ligne);
          return cible[i2];
        }
        if (typeof cible === "string") {
          if (i2 < 0 || i2 >= cible.length) throw new ErreurMynion("Cette lettre n'existe pas dans le mot (indice " + i2 + ").", e.ligne);
          return cible[i2];
        }
        throw new ErreurMynion("Seuls les régimes (listes) et les textes se lisent avec [indice].", e.ligne);
      }
      case "neg": {
        const v = evalExpr(e.e, env, ctx);
        if (typeof v !== "number") throw new ErreurMynion("Le moins unaire s'applique à un nombre.", e.ligne);
        return -v;
      }
      case "non":
        return !verite(evalExpr(e.e, env, ctx));
      case "bin":
        return evalBin(e, env, ctx);
      case "methode":
        return evalMethode(e, env, ctx);
      case "appel":
        return evalAppel(e, env, ctx);
    }
    throw new ErreurMynion("Expression inconnue.", undefined);
  }

  function evalBin(e, env, ctx) {
    const op = e.op;
    if (op === "tiamo") {
      const g = evalExpr(e.g, env, ctx);
      if (!verite(g)) return false;
      return verite(evalExpr(e.d, env, ctx));
    }
    if (op === "oula") {
      const g = evalExpr(e.g, env, ctx);
      if (verite(g)) return true;
      return verite(evalExpr(e.d, env, ctx));
    }
    const g = evalExpr(e.g, env, ctx);
    const d = evalExpr(e.d, env, ctx);
    const melange = (typeof g === "string" && typeof d === "number") || (typeof g === "number" && typeof d === "string");
    switch (op) {
      case "+":
        if (melange) throw new ErreurMynion("Tu mélanges du texte et un nombre avec + — convertis avec blabla() ou hanadulsae().", e.ligne);
        if (Array.isArray(g) && Array.isArray(d)) return g.concat(d);
        return g + d;
      case "-":
        if (typeof g !== "number" || typeof d !== "number") throw new ErreurMynion("La soustraction se fait entre nombres.", e.ligne);
        return g - d;
      case "*":
        if (typeof g === "string" && typeof d === "number") {
          if (d < 0 || !Number.isInteger(d)) throw new ErreurMynion("On répète un texte avec un nombre entier positif.", e.ligne);
          return g.repeat(d);
        }
        if (typeof g === "number" && typeof d === "string") {
          if (g < 0 || !Number.isInteger(g)) throw new ErreurMynion("On répète un texte avec un nombre entier positif.", e.ligne);
          return d.repeat(g);
        }
        if (typeof g !== "number" || typeof d !== "number") throw new ErreurMynion("La multiplication se fait entre nombres (ou texte × nombre).", e.ligne);
        return g * d;
      case "/":
        if (d === 0) throw new ErreurMynion("Impossible de diviser par gong (0) ! Même un Minion ne peut pas partager zéro banane.", e.ligne);
        return g / d;
      case "//":
        if (d === 0) throw new ErreurMynion("Impossible de diviser par gong (0) ! Même un Minion ne peut pas partager zéro banane.", e.ligne);
        return Math.floor(g / d);
      case "%":
        if (d === 0) throw new ErreurMynion("Impossible de diviser par gong (0) ! Même un Minion ne peut pas partager zéro banane.", e.ligne);
        return ((g % d) + d) % d;
      case "**":
        if (typeof g !== "number" || typeof d !== "number") throw new ErreurMynion("La puissance se calcule entre nombres.", e.ligne);
        return Math.pow(g, d);
      case "==":
        return egal(g, d);
      case "!=":
        return !egal(g, d);
      case "<": case "<=": case ">": case ">=": {
        if (typeof g !== typeof d || (typeof g !== "number" && typeof g !== "string")) {
          throw new ErreurMynion("On compare deux nombres ou deux textes du même type.", e.ligne);
        }
        if (op === "<") return g < d;
        if (op === "<=") return g <= d;
        if (op === ">") return g > d;
        return g >= d;
      }
    }
    throw new ErreurMynion("Opérateur inconnu « " + op + " ».", e.ligne);
  }

  function evalMethode(e, env, ctx) {
    const cible = evalExpr(e.e, env, ctx);
    const args = e.args.map((a) => evalExpr(a, env, ctx));
    const m = e.nom.toLowerCase();
    if (typeof cible === "string") {
      if (m === "upper") return cible.toUpperCase();
      if (m === "lower") return cible.toLowerCase();
    }
    if (Array.isArray(cible) && m === "append") {
      cible.push(args[0]);
      return null;
    }
    throw new ErreurMynion("Ce minion ne connaît pas ce tour (." + e.nom + "). Essaie pousse(liste, x) !", e.ligne);
  }

  function evalAppel(e, env, ctx) {
    budget(ctx, e.ligne);
    const envF = chercherEnv(env, e.nom);
    const f = envF ? envF.vars.get(e.nom) : null;
    if (f && f.fonction) {
      if (e.args.length !== f.params.length) {
        throw new ErreurMynion("Le minion " + f.nom + " attend " + f.params.length + " valeur(s), tu lui en donnes " + e.args.length + ".", e.ligne);
      }
      const envAppel = creerEnv(f.env);
      for (let k = 0; k < f.params.length; k++) {
        envAppel.vars.set(f.params[k], evalExpr(e.args[k], env, ctx));
      }
      try {
        execBloc(f.corps, envAppel, ctx);
        return null;
      } catch (err) {
        if (err && err.signal === "gelato") return err.valeur;
        if (err && (err.signal === "stupa" || err.signal === "bananos")) {
          throw new ErreurMynion((err.signal === "stupa" ? "Stupa" : "Bananos") + " en dehors d'une boucle !", e.ligne);
        }
        throw err;
      }
    }
    const builtin = BUILTINS[e.nom.toLowerCase()];
    if (builtin) {
      const args = e.args.map((a) => evalExpr(a, env, ctx));
      return builtin(args, ctx, e.ligne);
    }
    throw new ErreurMynion("Le minion « " + e.nom + " » n'existe pas. Vérifie l'orthographe (bello, poka, surprise…).", e.ligne);
  }

  return { executer, lexique, analyser, versTexte };
})();

/* ═══════════════════ 4. TRANSPILEUR (Mynion → Python affiché) ═══════════════════ */
function transpiler(src) {
  let sortie = "";
  let i = 0;
  const n = src.length;
  while (i < n) {
    const c = src[i];
    if (c === '"' || c === "'") {
      const triple = src.substr(i, 3);
      let fin;
      if (triple === '"""' || triple === "'''") {
        fin = src.indexOf(triple, i + 3);
        fin = fin === -1 ? n : fin + 3;
      } else {
        let j = i + 1;
        while (j < n && src[j] !== c && src[j] !== "\n") j++;
        fin = (j < n && src[j] === c) ? j + 1 : j;
      }
      sortie += src.slice(i, fin);
      i = fin;
      continue;
    }
    if (c === "#") {
      const fin = src.indexOf("\n", i);
      const f2 = fin === -1 ? n : fin;
      sortie += src.slice(i, f2);
      i = f2;
      continue;
    }
    if (estLettreNom(c)) {
      let j = i;
      while (j < n && estCharNom(src[j])) j++;
      const bas = src.slice(i, j).toLowerCase();
      if (bas === "me") {
        let k = j;
        while (k < n && (src[k] === " " || src[k] === "\t")) k++;
        if (src.slice(k, k + 4).toLowerCase() === "want" && (k + 4 >= n || !estCharNom(src[k + 4]))) {
          sortie += "=";
          i = k + 4;
          continue;
        }
      }
      if (bas === "banana" || bas === "bananana") {
        const fin = src.indexOf("\n", i);
        const f2 = fin === -1 ? n : fin;
        sortie += "#" + src.slice(j, f2);
        i = f2;
        continue;
      }
      if (bas === "poopaye") {
        const fin = src.indexOf("\n", i);
        const f2 = fin === -1 ? n : fin;
        sortie += "# Poopaye !" + src.slice(j, f2);
        i = f2;
        continue;
      }
      sortie += MOTS_STRUCTURE[bas] || MOTS_NOMBRES_TEXTUEL[bas] || src.slice(i, j);
      i = j;
      continue;
    }
    sortie += c;
    i++;
  }
  return sortie;
}
const MOTS_NOMBRES_TEXTUEL = {
  gong: "0", hana: "1", dul: "2", sae: "3", net: "4", daseot: "5",
  yeoseot: "6", ilgop: "7", yeodeol: "8", ahop: "9", yeol: "10",
};

/* ═══════════════════ 5. COLORATION SYNTAXIQUE ═══════════════════ */
function echapperHTML(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function surligner(txt) {
  const K = Object.keys(MOTS_STRUCTURE).filter((m) => m !== "mewant");
  const B = MOTS_INBUILT;
  const NB = Object.keys(MOTS_NOMBRES);
  const CM = MOTS_COMMENTAIRE;
  let html = "";
  let i = 0;
  const n = txt.length;
  while (i < n) {
    const c = txt[i];
    if (c === "\n") { html += "\n"; i++; continue; }
    if (c === " " || c === "\t") { html += c; i++; continue; }
    if (c === "#") {
      let k = txt.indexOf("\n", i);
      if (k === -1) k = n;
      html += '<span class="c">' + echapperHTML(txt.slice(i, k)) + "</span>";
      i = k;
      continue;
    }
    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < n && txt[j] !== c && txt[j] !== "\n") j++;
      const fin = (j < n && txt[j] === c) ? j + 1 : j;
      html += '<span class="s">' + echapperHTML(txt.slice(i, fin)) + "</span>";
      i = fin;
      continue;
    }
    if (estLettreNom(c)) {
      let j = i;
      while (j < n && estCharNom(txt[j])) j++;
      const mot = txt.slice(i, j);
      const bas = mot.toLowerCase();
      if (CM.includes(bas)) {
        let k = txt.indexOf("\n", i);
        if (k === -1) k = n;
        html += '<span class="c">' + echapperHTML(txt.slice(i, k)) + "</span>";
        i = k;
        continue;
      }
      if ((bas === "f" || bas === "rf" || bas === "fr") && (txt[j] === '"' || txt[j] === "'")) {
        const q = txt[j];
        let k = j + 1;
        while (k < n && txt[k] !== q && txt[k] !== "\n") k++;
        const fin = (k < n && txt[k] === q) ? k + 1 : k;
        html += '<span class="s">' + echapperHTML(txt.slice(i, fin)) + "</span>";
        i = fin;
        continue;
      }
      if (bas === "me") {
        let k2 = j;
        while (k2 < n && (txt[k2] === " " || txt[k2] === "\t")) k2++;
        if (txt.slice(k2, k2 + 4).toLowerCase() === "want") {
          html += '<span class="k">' + echapperHTML(txt.slice(i, k2 + 4)) + "</span>";
          i = k2 + 4;
          continue;
        }
      }
      if (K.includes(bas)) html += '<span class="k">' + echapperHTML(mot) + "</span>";
      else if (B.includes(bas)) html += '<span class="b">' + echapperHTML(mot) + "</span>";
      else if (NB.includes(bas)) html += '<span class="n">' + echapperHTML(mot) + "</span>";
      else html += echapperHTML(mot);
      i = j;
      continue;
    }
    if (c >= "0" && c <= "9") {
      let j = i;
      while (j < n && ((txt[j] >= "0" && txt[j] <= "9") || txt[j] === ".")) j++;
      html += '<span class="n">' + echapperHTML(txt.slice(i, j)) + "</span>";
      i = j;
      continue;
    }
    if ("+-*/%<>=()[]{},:.".includes(c)) {
      html += '<span class="o">' + echapperHTML(c) + "</span>";
      i++;
      continue;
    }
    html += echapperHTML(c);
    i++;
  }
  return html;
}

/* export Node pour les tests */
if (typeof module !== "undefined" && module.exports) {
  module.exports = { Mynion, transpiler, surligner, ErreurMynion, lexique, analyser };
}
