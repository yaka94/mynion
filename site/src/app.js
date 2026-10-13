/* ═══════════════════════════════════════════════════════════════════════════
   🍌 APP MYNION — interface façon application mobile (Mimo-like).
   Parcours de leçons, XP, série, Labo, dictionnaire. FR / EN.
   ═══════════════════════════════════════════════════════════════════════════ */
"use strict";

(function () {

  const CLE = "mynion_site_v1";
  const XP_ETAPE = { quiz: 10, tapfill: 10, ordre: 10, ecriture: 15, theorie: 0 };
  const XP_BONUS_LECON = 10;

  /* ── état persistant ── */
  function etatInitial() {
    return {
      lang: null, vue: "parcours", xp: 0, progres: {}, serie: { last: null, count: 0 },
      muet: false, toutDeverrouille: false, lecon: null, labo: null, nom: "",
    };
  }
  let ETAT = etatInitial();
  function charger() {
    try {
      const brut = localStorage.getItem(CLE);
      if (brut) ETAT = Object.assign(etatInitial(), JSON.parse(brut));
    } catch (e) { /* navigateur privé */ }
  }
  function sauver() {
    try { localStorage.setItem(CLE, JSON.stringify(ETAT)); } catch (e) {}
  }

  /* ── le Labo n'est ouvert qu'après avoir terminé le parcours
     (le bouton « tout déverrouiller » sert de passe-droits pour tester) ── */
  function laboOuvert() {
    return nbFaites() === CURRICULUM.length || ETAT.toutDeverrouille;
  }

  /* ── i18n ── */
  function t(cle) {
    const dico = I18N[ETAT.lang] || I18N.fr;
    return dico.ui[cle] !== undefined ? dico.ui[cle] : (I18N.fr.ui[cle] !== undefined ? I18N.fr.ui[cle] : cle);
  }
  function L(x) { return typeof x === "string" ? x : ((x && (x[ETAT.lang] !== undefined ? x[ETAT.lang] : x.fr)) || ""); }
  function niveauActuel() {
    const niv = (I18N[ETAT.lang] || I18N.fr).niveaux;
    let nom = niv[0].nom;
    for (const n of niv) { if (ETAT.xp >= n.seuil) nom = n.nom; }
    return nom;
  }
  const alea = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const bravo = () => alea((I18N[ETAT.lang] || I18N.fr).bravos);
  const oups = () => alea((I18N[ETAT.lang] || I18N.fr).oups);

  /* ── sons (WebAudio, discrets) ── */
  let audioCtx = null;
  function son(seq) {
    if (ETAT.muet) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      let t0 = audioCtx.currentTime;
      for (const n of seq) {
        const o = audioCtx.createOscillator(), g = audioCtx.createGain();
        o.type = n.t || "sine";
        o.frequency.value = n.f;
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(0.14, t0 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + n.d);
        o.connect(g); g.connect(audioCtx.destination);
        o.start(t0); o.stop(t0 + n.d + 0.05);
        t0 += n.d;
      }
    } catch (e) {}
  }
  const sons = {
    bon: () => son([{ f: 660, d: 0.12 }, { f: 880, d: 0.18 }]),
    mauvais: () => son([{ f: 190, d: 0.22, t: "sawtooth" }]),
    fini: () => son([{ f: 523, d: 0.12 }, { f: 659, d: 0.12 }, { f: 784, d: 0.12 }, { f: 1046, d: 0.3 }]),
  };

  /* ── confettis & toast ── */
  function confettis() {
    const emojis = ["🍌", "🎉", "⭐", "🎈", "🍌", "🏆"];
    for (let k = 0; k < 26; k++) {
      const s = document.createElement("span");
      s.className = "confetti";
      s.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      s.style.left = (4 + Math.random() * 92) + "vw";
      s.style.animationDelay = (Math.random() * 0.6) + "s";
      s.style.fontSize = (16 + Math.random() * 16) + "px";
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 3200);
    }
  }
  let toastT = null;
  function toast(msg) {
    let el = document.querySelector(".toast");
    if (!el) { el = document.createElement("div"); el.className = "toast"; document.body.appendChild(el); }
    el.textContent = msg;
    el.style.display = "block";
    clearTimeout(toastT);
    toastT = setTimeout(() => { el.style.display = "none"; }, 2400);
  }

  /* ── helpers de leçons ── */
  function leconParId(id) { return CURRICULUM.find((l) => l.id === id); }
  function leconDebloquee(i) {
    return ETAT.toutDeverrouille || i === 0 || !!ETAT.progres[CURRICULUM[i - 1].id];
  }
  function nbFaites() { return CURRICULUM.filter((l) => ETAT.progres[l.id]).length; }
  function prochaineLecon() {
    for (let i = 0; i < CURRICULUM.length; i++) {
      if (!ETAT.progres[CURRICULUM[i].id] && leconDebloquee(i)) return { l: CURRICULUM[i], i };
    }
    return null;
  }
  function majSerie() {
    const auj = new Date().toISOString().slice(0, 10);
    const s = ETAT.serie;
    if (s.last === auj) return;
    const hier = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    s.count = (s.last === hier) ? s.count + 1 : 1;
    s.last = auj;
  }
  function normaliser(s) {
    return String(s).replace(/\r/g, "").split("\n").map((l) => l.replace(/[ \t]+$/, "")).join("\n").replace(/\n+$/, "");
  }
  function codeDe(x) { return typeof x === "string" ? x : L(x); }

  /* ── composant éditeur ── */
  function creerEditeur(hote, codeInitial, hauteur, callbacks) {
    callbacks = callbacks || {};
    const wrap = document.createElement("div");
    wrap.className = "editeur-wrap";
    wrap.style.height = (hauteur || 170) + "px";
    const nums = document.createElement("div"); nums.className = "numeros";
    const zone = document.createElement("div"); zone.className = "zone-editeur";
    const pre = document.createElement("pre"); pre.setAttribute("aria-hidden", "true");
    const ta = document.createElement("textarea");
    ta.setAttribute("spellcheck", "false");
    ta.setAttribute("autocapitalize", "off");
    ta.setAttribute("autocorrect", "off");
    ta.setAttribute("autocapitalize", "none");
    ta.value = codeInitial || "";
    zone.appendChild(pre); zone.appendChild(ta);
    wrap.appendChild(nums); wrap.appendChild(zone);
    hote.appendChild(wrap);

    function maj() {
      pre.innerHTML = surligner(ta.value) + "\n";
      const nb = ta.value.split("\n").length;
      let g = "";
      for (let k = 1; k <= nb; k++) g += k + "\n";
      nums.textContent = g;
      pre.scrollTop = ta.scrollTop; pre.scrollLeft = ta.scrollLeft;
      nums.scrollTop = ta.scrollTop;
    }
    function inserer(txt) {
      const s = ta.selectionStart, f = ta.selectionEnd;
      ta.setRangeText(txt, s, f, "end");
      maj();
      if (callbacks.onchange) callbacks.onchange(ta.value);
    }
    ta.addEventListener("input", () => { maj(); if (callbacks.onchange) callbacks.onchange(ta.value); });
    ta.addEventListener("scroll", () => {
      pre.scrollTop = ta.scrollTop; pre.scrollLeft = ta.scrollLeft; nums.scrollTop = ta.scrollTop;
    });
    ta.addEventListener("keydown", (e) => {
      if (e.key === "Tab") { e.preventDefault(); inserer("    "); }
      else if (e.key === "Enter") {
        e.preventDefault();
        const avant = ta.value.slice(0, ta.selectionStart);
        const ligne = avant.slice(avant.lastIndexOf("\n") + 1);
        let indent = (ligne.match(/^[ \t]*/) || [""])[0];
        if (ligne.trimEnd().endsWith(":")) indent += "    ";
        inserer("\n" + indent);
      }
      else if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (callbacks.onrun) callbacks.onrun();
      }
    });
    maj();
    return {
      get code() { return ta.value; },
      set code(v) { ta.value = v; maj(); },
      focus: () => ta.focus(),
    };
  }

  /* ═══════════════ RENDU ═══════════════ */
  function rendu() {
    const posY = window.scrollY;
    document.documentElement.lang = ETAT.lang;

    /* le Labo reste fermé tant que le parcours n'est pas terminé */
    if (ETAT.vue === "labo" && !laboOuvert()) ETAT.vue = "parcours";

    /* barre du haut */
    document.getElementById("jeton-xp").innerHTML = "⭐ <b>" + ETAT.xp + "</b>";
    document.getElementById("jeton-xp").title = t("xpLabel");
    document.getElementById("jeton-serie").innerHTML = "🔥 <b>" + (ETAT.serie.count || 0) + "</b>";
    document.getElementById("jeton-serie").title = t("serieLabel");
    document.querySelectorAll(".lang").forEach((b) => {
      b.classList.toggle("actif", b.getAttribute("data-action") === "lang:" + ETAT.lang);
    });
    document.getElementById("btn-son").textContent = ETAT.muet ? "🔇" : "🔊";

    /* menu du bas */
    document.querySelectorAll("#onglets button").forEach((b) => {
      const nav = b.getAttribute("data-nav");
      const ferme = nav === "labo" && !laboOuvert();
      b.classList.toggle("actif", nav === ETAT.vue);
      b.classList.toggle("verrouille", ferme);
      b.querySelector(".lbl").textContent = ferme ? "🔒 " + t("labo") : t(nav);
    });

    const app = document.getElementById("app");
    if (ETAT.vue === "labo") { app.innerHTML = htmlLabo(); brancherLabo(); }
    else if (ETAT.vue === "dico") { app.innerHTML = htmlDico(); brancherDico(); }
    else if (ETAT.lecon) { app.innerHTML = htmlLecon(); brancherEtape(); }
    else { app.innerHTML = htmlAccueil(); brancherAccueil(); }

    sauver();
    window.scrollTo(0, posY);
  }

  /* ── ACCUEIL ── */
  function htmlAccueil() {
    const faites = nbFaites(), total = CURRICULUM.length;
    const pct = Math.round((faites / total) * 100);
    const prochaine = prochaineLecon();

    let html = `<div class="hero">
      <div class="niveau-etiquette">${niveauActuel()} · ⭐ ${ETAT.xp} XP</div>
      <h1 class="titre-xl">🍌 MYNION</h1>
      <p class="slogan">${t("slogan")}</p>
      <div class="progression"><div class="barre-prog"><div style="width:${pct}%"></div></div><span class="pct">${pct}%</span></div>
      <p class="mini-note" style="margin:8px 0 0">${faites} / ${total} ${t("lecons")} · 🔥 ${ETAT.serie.count || 0}</p>
    </div>`;

    if (prochaine) {
      html += `<button class="btn btn-primaire" data-action="lecon:${prochaine.l.id}" style="margin-bottom:18px">
        ▶ ${t("reprendre")} — ${prochaine.l.emoji} ${L(prochaine.l.titre)}</button>`;
    }

    if (faites === total) {
      const numDiplome = "BAN-" + (1000 + ETAT.xp);
      const date = new Date().toLocaleDateString(ETAT.lang === "fr" ? "fr-FR" : "en-US");
      html += `<div class="carte diplome">
        <div class="gros">🏆👓</div>
        <h2>${t("certificatTitre")}</h2>
        <p class="texte-etape">${t("certificatTexte")}</p>
        <p class="mini-note">${t("tonNom")}</p>
        <input class="champ-nom" id="nom-diplome" placeholder="Kevin, Stuart, Bob…" value="${echapperHTML(ETAT.nom)}" maxlength="40">
        <div class="diplome-etiquette" id="etiquette-nom">${echapperHTML(ETAT.nom || "…")}</div>
        <p class="mini-note">${numDiplome} · ${total}/${total} ${t("lecons")} · ⭐ ${ETAT.xp} XP · ${date}</p>
        ${htmlPartage()}
      </div>`;
    }

    html += `<div class="chemin">`;
    CURRICULUM.forEach((l, i) => {
      const fait = !!ETAT.progres[l.id];
      const debloquee = leconDebloquee(i);
      const estProchaine = prochaine && prochaine.l.id === l.id;
      const statut = fait ? "✅" : (debloquee ? (estProchaine ? "▶️" : "•") : "🔒");
      html += `<div class="ch-item">
        <div class="ch-rail">
          <div class="ch-noeud ${fait ? "fait" : ""} ${estProchaine ? "actuel" : ""} ${!debloquee ? "ferme" : ""}">${fait ? "✓" : i + 1}</div>
          ${i < CURRICULUM.length - 1 ? `<div class="ch-tige ${fait ? "fait" : ""}"></div>` : ""}
        </div>
        <div class="ch-carte ${debloquee ? "cliquable" : ""}" ${debloquee ? `data-action="lecon:${l.id}"` : `data-action="verrouillee"`}>
          <div><h3>${l.emoji} ${L(l.titre)}</h3><div class="sous">${L(l.sous)}</div></div>
          <div class="statut">${statut}</div>
        </div>
      </div>`;
    });
    html += `</div>`;

    html += `<div class="pied">
      <button class="btn btn-fantome btn-mini" data-action="deverrouiller">${t("deverrouiller")}</button>
      <button class="btn btn-fantome btn-mini" data-action="reset" style="margin-top:8px">${t("recommencer")}</button>
      <div style="margin-top:14px">${t("pied")}</div>
    </div>`;
    return html;
  }

  /* ── PARTAGE DU DIPLÔME ──
     L'URL partagée est celle par laquelle l'utilisateur visite le site
     (location.origin + pathname) : elle reste correcte sur n'importe quel
     dépôt GitHub Pages, fork ou domaine personnalisé. */
  function urlDuSite() {
    try {
      if (location.protocol === "file:") return null;
      return location.origin + location.pathname;
    } catch (e) { return null; }
  }
  function htmlPartage() {
    if (!urlDuSite()) return `<p class="mini-note">⚠️ ${t("partageLocal")}</p>`;
    return `<div class="etiquette-partage">📣 ${t("partagerSur")}</div>
      <div class="partage">
        <button class="btn-partage pli" data-action="partager:linkedin"><b>in</b> LinkedIn</button>
        <button class="btn-partage pfb" data-action="partager:facebook"><b>f</b> Facebook</button>
        <button class="btn-partage pxx" data-action="partager:x">𝕏</button>
        <button class="btn-partage pcp" data-action="partager:copier">${t("copierLien")}</button>
      </div>`;
  }
  function textePartage() {
    return ETAT.lang === "fr"
      ? "J'ai décroché le Diplôme de la Banane d'Or en apprenant à coder avec MYNION, le langage des Minions ! 🍌👓"
      : "I earned the Golden Banana Diploma by learning to code with MYNION, the Minion language! 🍌👓";
  }
  function actionPartager(reseau) {
    const url = urlDuSite();
    if (!url) { toast("⚠️ " + t("partageLocal")); return; }
    const enc = encodeURIComponent(url);
    const encT = encodeURIComponent(textePartage());
    let cible = null;
    if (reseau === "linkedin") cible = "https://www.linkedin.com/sharing/share-offsite/?url=" + enc;
    else if (reseau === "facebook") cible = "https://www.facebook.com/sharer/sharer.php?u=" + enc;
    else if (reseau === "x") cible = "https://twitter.com/intent/tweet?url=" + enc + "&text=" + encT;
    else if (reseau === "whatsapp") cible = "https://wa.me/?text=" + encT + "%20" + enc;
    else if (reseau === "copier") { copierTexte(url); return; }
    if (cible) {
      const f = window.open(cible, "_blank", "noopener");
      if (!f) toast("⃠ " + (ETAT.lang === "fr" ? "Popup bloquée — autorise les popups !" : "Popup blocked — allow popups!"));
    }
  }
  function copierTexte(txt) {
    const confirme = () => toast("📋 " + t("lienCopie"));
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(confirme, () => copierSecours(txt, confirme));
    } else copierSecours(txt, confirme);
  }
  function copierSecours(txt, fait) {
    try {
      const ta = document.createElement("textarea");
      ta.value = txt;
      ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      fait();
    } catch (e) { toast(txt); }
  }
  function brancherAccueil() {
    const champ = document.getElementById("nom-diplome");
    if (champ) {
      champ.addEventListener("input", () => {
        ETAT.nom = champ.value;
        const etiquette = document.getElementById("etiquette-nom");
        if (etiquette) etiquette.textContent = ETAT.nom || "…";
        sauver();
      });
    }
  }

  /* ── LEÇON ── */
  function htmlLecon() {
    const l = leconParId(ETAT.lecon.id);
    if (!l) { ETAT.lecon = null; return htmlAccueil(); }
    const LS = ETAT.lecon;
    const n = l.etapes.length;

    /* écran de fin */
    if (LS.terminee) {
      const xpG = LS.xpTotal || 0;
      const toutFini = nbFaites() === CURRICULUM.length;
      return `<div class="ecran-fete">
        <div class="gros">${toutFini ? "🏆👓" : l.emoji}</div>
        <h2>${toutFini ? t("certificatTitre") : t("leconTerminee")}</h2>
        <div class="xp-gagnee">${t("xpGagne").replace("{xp}", xpG)}</div>
        <p class="mini-note">🔥 ${ETAT.serie.count || 0} · ⭐ ${ETAT.xp} XP · ${niveauActuel()}</p>
        ${toutFini ? `<p class="mini-note" style="margin:4px 0 0">🧪 ${t("laboDebloque")}</p>` : ""}
        ${toutFini ? `<div style="max-width:420px;margin:0 auto 6px">${htmlPartage()}</div>` : ""}
        <button class="btn btn-vert" data-action="lecon:quitter" style="max-width:320px;margin:10px auto 0">${t("retourParcours")}</button>
      </div>`;
    }

    const etape = l.etapes[LS.etape];
    const pct = Math.round((LS.etape / n) * 100);
    let html = `<div class="barre-lecon">
        <button class="quitter" data-action="lecon:quitter">✕</button>
        <div class="barre-prog"><div style="width:${pct}%"></div></div>
        <span class="compteur-etapes">${LS.etape + 1}/${n}</span>
      </div>
      <h2 class="titre-lecon">${l.emoji} ${L(l.titre)}</h2>`;

    const res = LS.resultats[LS.etape];
    html += corpsEtape(etape, LS);

    if (res && res.ok) {
      html += `<div class="retro bonne"><div class="titre-retro">${bravo()} ${t("xpGagne").replace("{xp}", XP_ETAPE[etape.type] || 0)}</div>${res.explication ? L(res.explication) : ""}</div>
        <div class="ligne-boutons" style="margin-top:12px">
          <button class="btn btn-vert" data-action="etape:continuer">${t("continuer")} →</button>
        </div>`;
    } else if (res && !res.ok) {
      html += `<div class="retro mauvaise"><div class="titre-retro">${oups()} ${t("reessayer")}</div>${res.explication ? L(res.explication) : ""}</div>`;
      if (res.sortieUtilisateur !== undefined) {
        html += `<div class="etiquette-sortie">${t("taSortie")}</div><div class="bloc-sortie">${echapperHTML(res.sortieUtilisateur || "—")}</div>`;
      }
    }
    return html;
  }

  function blocCodeAvecEntree(etape) {
    let html = "";
    if (etape.entree !== undefined) {
      html += `<div class="champ-info">⌨ ${t("entree")} : <b>${echapperHTML(codeDe(etape.entree) || "—")}</b></div>`;
    }
    return html;
  }

  function corpsEtape(etape, LS) {
    const idx = LS.etape;
    if (etape.type === "theorie") {
      let html = `<div class="carte"><p class="texte-etape">${L(etape.texte)}</p>`;
      if (etape.code) html += blocCodeAvecEntree(etape) + `<div class="bloc">${surligner(codeDe(etape.code))}</div>`;
      if (etape.sortie !== undefined) {
        html += `<div class="etiquette-sortie">${t("resultatAttendu")}</div><div class="bloc-sortie">${echapperHTML(L(etape.sortie))}</div>`;
      }
      html += `</div>
      <div class="ligne-boutons"><button class="btn btn-primaire" data-action="etape:continuer">${t("continuer")} →</button></div>`;
      return html;
    }

    if (etape.type === "quiz") {
      const res = LS.resultats[idx];
      const opts = L(etape.options) || etape.options.fr;
      let html = `<div class="carte">
        <p class="texte-etape"><b>${t("ecoute")}</b></p>`;
      if (etape.question) html += `<p class="texte-etape">${L(etape.question)}</p>`;
      if (etape.code) html += blocCodeAvecEntree(etape) + `<div class="bloc">${surligner(codeDe(etape.code))}</div>`;
      html += `<div class="options">`;
      opts.forEach((o, i) => {
        let cls = "option";
        if (res) {
          if (res.ok) { if (i === etape.bonne) cls += " bonne"; }
          else if (i === res.choix) cls += " mauvaise";
        }
        /* réessaillable tant que ce n'est pas juste */
        html += `<button class="${cls}" data-action="reponse:${i}" ${res && res.ok ? "disabled" : ""}>${echapperHTML(o)}</button>`;
      });
      html += `</div></div>`;
      return html;
    }

    if (etape.type === "tapfill") {
      const res = LS.resultats[idx];
      const opts = L(etape.options) || etape.options.fr;
      const rempli = res ? (LS.remplis[idx] !== undefined ? opts[LS.remplis[idx]] : undefined) : (LS.remplis[idx] !== undefined ? opts[LS.remplis[idx]] : undefined);
      const code = codeDe(etape.code);
      const i = code.indexOf("___");
      let codeHTML;
      if (i === -1) codeHTML = surligner(code);
      else codeHTML = surligner(code.slice(0, i)) + `<span class="trou">${rempli !== undefined ? echapperHTML(rempli) : "…"}</span>` + surligner(code.slice(i + 3));
      let html = `<div class="carte">
        <div class="bloc code-a-trou">${codeHTML}</div>
        <div class="tuiles">`;
      opts.forEach((o, i2) => {
        let cls = "tuile";
        if (res) {
          if (res.ok) { if (i2 === etape.bonne) cls += " bonne"; }
          else if (i2 === LS.remplis[idx]) cls += " mauvaise";
        }
        /* réessaillable tant que ce n'est pas juste */
        html += `<button class="${cls}" data-action="reponse:${i2}" ${res && res.ok ? "disabled" : ""}>${echapperHTML(o)}</button>`;
      });
      html += `</div></div>`;
      return html;
    }

    if (etape.type === "ordre") {
      /* la pioche est mélangée au premier affichage de l'étape */
      if (!LS.ordres[idx]) {
        LS.ordres[idx] = {
          pile: etape.lignes.map((_, k) => k).sort(() => Math.random() - 0.5),
          pris: [],
        };
      }
      const ordre = LS.ordres[idx];
      let html = `<div class="carte">
        <p class="texte-etape">${L(etape.consigne)}</p>
        <div class="pioche">`;
      ordre.pile.forEach((iLigne) => {
        html += `<button class="ligne-ordre" data-action="ordre:prendre:${iLigne}">${surligner(etape.lignes[iLigne])}</button>`;
      });
      html += `</div>
        <div class="etiquette-sortie">⬇︎</div>
        <div class="empilement" data-vide="${t("ordreVide")}">`;
      ordre.pris.forEach((iLigne, k) => {
        html += `<button class="ligne-ordre choisie" data-action="ordre:retirer:${k}"><span class="num-ligne">${k + 1}</span>${surligner(etape.lignes[iLigne])}</button>`;
      });
      html += `</div>
        <div class="ligne-boutons" style="margin-top:12px">
          <button class="btn btn-primaire" data-action="ordre:verifier">${t("verifier")}</button>
        </div>
      </div>`;
      return html;
    }

    if (etape.type === "ecriture") {
      let html = `<div class="carte">
        <p class="texte-etape"><b>⌨️ ${t("aToiDeCoder")}</b></p>
        <p class="texte-etape">${L(etape.consigne)}</p>
        ${blocCodeAvecEntree(etape)}
        <div id="editeur-etape"></div>
        <div class="etiquette-sortie">${t("resultatAttendu")}</div>
        <div class="bloc-sortie">${echapperHTML(L(etape.attendu))}</div>
        <div class="ligne-boutons">
          <button class="btn btn-vert" data-action="etape:verifier">✓ ${t("verifier")}</button>
          <button class="btn btn-fantome" data-action="etape:executer">${t("executer")}</button>
        </div>
        <div class="ligne-boutons">
          <button class="btn btn-fantome btn-mini" data-action="etape:indice">${t("indice")}</button>
          <button class="btn btn-fantome btn-mini" data-action="etape:solution">${t("solution")}</button>
        </div>
        ${LS.indices[idx] ? `<div class="champ-info">💡 ${echapperHTML(L(etape.indice))}</div>` : ""}
        <div class="etiquette-sortie">${t("taSortie")}</div>
        <div class="console ${LS.consoles[idx] ? "" : "vide"}" id="console-etape">${LS.consoles[idx] ? echapperHTML(LS.consoles[idx]) : t("consoleVide")}</div>
      </div>`;
      return html;
    }
    return "";
  }

  function brancherEtape() {
    const LS = ETAT.lecon;
    const l = leconParId(LS.id);
    if (!l || LS.terminee) return;
    const etape = l.etapes[LS.etape];
    if (etape.type === "ecriture") {
      const hote = document.getElementById("editeur-etape");
      if (hote) {
        LS.brouillons[LS.etape] = LS.brouillons[LS.etape] !== undefined ? LS.brouillons[LS.etape] : codeDe(etape.codeDepart || "");
        creerEditeur(hote, LS.brouillons[LS.etape], 180, {
          onchange: (v) => { LS.brouillons[LS.etape] = v; sauver(); },
          onrun: () => actionExecuterEtape(false),
        });
      }
    }
  }

  /* ── LABO ── */
  function htmlLabo() {
    return `<div class="carte">
      <p class="texte-etape">🧪 <b>Le Labo</b></p>
      <p class="mini-note">${t("laboIntro")}</p>
      <select class="select-exemples" id="select-exemples">
        <option value="-1">${t("exemples")}…</option>
        ${EXEMPLES.map((ex, i) => `<option value="${i}">${L(ex.t)}</option>`).join("")}
      </select>
      <div id="editeur-labo"></div>
      <details class="entree-bloc">
        <summary>${t("entree")}</summary>
        <div class="entree-zone">
          <p class="aide-entree">${t("entreeAide")}</p>
          <textarea class="champ" id="entree-labo" placeholder="50${"\n"}75${"\n"}62">${echapperHTML(ETAT.labo.entree || "")}</textarea>
        </div>
      </details>
      <div class="ligne-boutons">
        <button class="btn btn-primaire" data-action="labo:executer">▶ ${t("executer")} <span class="mini-note" style="color:#5c4a00">(Ctrl+↵)</span></button>
        <button class="btn btn-fantome" data-action="labo:effacer">${t("effacer")}</button>
      </div>
      <div class="etiquette-sortie">${t("taSortie")}</div>
      <div class="console ${ETAT.labo.sortie ? "" : "vide"}" id="console-labo">${ETAT.labo.sortie ? echapperHTML(ETAT.labo.sortie) : t("consoleVide")}</div>
      <details class="python-secret" ${ETAT.labo.pythonOuvert ? "open" : ""}>
        <summary>${t("pythonSecret")}</summary>
        <p class="mini-note" style="margin:0 14px">${t("pythonSecretAide")}</p>
        <div class="bloc" id="python-labo">${surligner(ETAT.labo.python || "")}</div>
      </details>
    </div>`;
  }

  function brancherLabo() {
    const hote = document.getElementById("editeur-labo");
    const ed = creerEditeur(hote, ETAT.labo.code, 260, {
      onchange: (v) => { ETAT.labo.code = v; majPythonSecret(); sauver(); },
      onrun: () => actionLaboExecuter(),
    });
    ETAT.labo.refEditeur = ed;
    const sel = document.getElementById("select-exemples");
    sel.addEventListener("change", () => {
      const i = parseInt(sel.value, 10);
      if (i >= 0 && i < EXEMPLES.length) {
        const ex = EXEMPLES[i];
        ETAT.labo.code = codeDe(ex.code);
        ETAT.labo.entree = ex.entree || "";
        ed.code = ETAT.labo.code;
        document.getElementById("entree-labo").value = ETAT.labo.entree;
        actionLaboExecuter();
      }
      sel.value = "-1";
    });
    const zoneEntree = document.getElementById("entree-labo");
    zoneEntree.addEventListener("input", () => { ETAT.labo.entree = zoneEntree.value; sauver(); });
    const secret = document.querySelector(".python-secret");
    secret.addEventListener("toggle", () => { ETAT.labo.pythonOuvert = secret.open; majPythonSecret(); });
    majPythonSecret();
  }
  function majPythonSecret() {
    const el = document.getElementById("python-labo");
    if (el) el.innerHTML = surligner(transpiler(ETAT.labo.code || ""));
    ETAT.labo.python = transpiler(ETAT.labo.code || "");
  }

  function actionLaboExecuter() {
    const res = Mynion.executer(ETAT.labo.code || "", { entree: ETAT.labo.entree || "" });
    let affiche;
    if (res.erreur) {
      affiche = "🍌💥 " + res.erreur.message + (res.erreur.ligne ? "\n" + t("etape") + " " + res.erreur.ligne : "");
    } else {
      affiche = res.sortie || "✅";
    }
    ETAT.labo.sortie = affiche;
    sauver();
    rendu();
  }

  /* ── DICO ── */
  function htmlDico() {
    return `<div class="carte">
      <p class="texte-etape">📖 <b>Dico ${t("colMynion")}</b></p>
      <input class="recherche" id="recherche-dico" placeholder="${t("rechercheDico")}" autocomplete="off">
      <div id="dico-tableau"></div>
      <hr class="sep">
      <h3 style="margin:0 0 8px">🔢 ${t("nombresTitre")}</h3>
      <div class="bloc">gong 0 · hana 1 · dul 2 · sae 3 · net 4 · daseot 5 ·\nyeoseot 6 · ilgop 7 · yeodeol 8 · ahop 9 · yeol 10</div>
      <p class="mini-note">⚠️ ${t("motsReserves")}</p>
    </div>`;
  }
  function brancherDico() {
    const champ = document.getElementById("recherche-dico");
    const renduTable = () => {
      const q = (champ.value || "").trim().toLowerCase();
      const el = document.getElementById("dico-tableau");
      const lignes = DICO
        .filter((e) => !q || e.m.toLowerCase().includes(q) || e.p.toLowerCase().includes(q) || L(e.s).toLowerCase().includes(q))
        .map((e) => `<tr>
          <td class="mm"><code>${echapperHTML(e.m)}</code></td>
          <td class="pp"><code>${echapperHTML(e.p)}</code></td>
          <td>${echapperHTML(L(e.s))}</td>
        </tr>`)
        .join("");
      el.innerHTML = `<div class="table-wrap"><table class="table-dico">
        <tr><th>${t("colMynion")}</th><th>${t("colPython")}</th><th>${t("colSens")}</th></tr>
        ${lignes || `<tr><td colspan="3" class="mini-note">🤷</td></tr>`}
      </table></div>`;
    };
    champ.addEventListener("input", renduTable);
    renduTable();
  }

  /* ═══════════════ ACTIONS ═══════════════ */
  function ouvrirLecon(id) {
    const i = CURRICULUM.findIndex((l) => l.id === id);
    if (i === -1 || !leconDebloquee(i)) { toast(t("verrouillee")); return; }
    const dejaFait = !!ETAT.progres[id];
    ETAT.lecon = {
      id, etape: 0, resultats: {}, remplis: {}, brouillons: {}, consoles: {}, indices: {}, ordres: {},
      gagne: {}, xpTotal: 0, sansXp: dejaFait, terminee: false,
    };
    ETAT.vue = "parcours";
    rendu();
    window.scrollTo(0, 0);
  }

  function actionReponse(iChoix) {
    const LS = ETAT.lecon;
    const l = leconParId(LS.id);
    const etape = l.etapes[LS.etape];
    const bonne = iChoix === etape.bonne;
    LS.remplis[LS.etape] = iChoix;
    LS.resultats[LS.etape] = {
      ok: bonne,
      choix: iChoix,
      explication: bonne ? etape.explication : (etape.explication || null),
    };
    if (bonne) { gagnerEtape(); sons.bon(); } else { sons.mauvais(); }
    rendu();
  }

  function actionOrdrePrendre(iLigne) {
    const LS = ETAT.lecon, l = leconParId(LS.id), etape = l.etapes[LS.etape];
    const ordre = LS.ordres[LS.etape] || { pile: [], pris: [] };
    const pos = ordre.pile.indexOf(iLigne);
    if (pos !== -1) { ordre.pile.splice(pos, 1); ordre.pris.push(iLigne); }
    rendu();
  }
  function actionOrdreRetirer(k) {
    const LS = ETAT.lecon, ordre = LS.ordres[LS.etape];
    if (ordre && ordre.pris[k] !== undefined) { ordre.pile.push(ordre.pris.splice(k, 1)[0]); }
    rendu();
  }
  function actionOrdreVerifier() {
    const LS = ETAT.lecon, l = leconParId(LS.id), etape = l.etapes[LS.etape];
    const ordre = LS.ordres[LS.etape] || { pile: [], pris: [] };
    const ok = ordre.pris.length === etape.lignes.length &&
      ordre.pris.every((iL, k) => iL === k);
    LS.resultats[LS.etape] = { ok, explication: ok ? etape.explication : null };
    if (ok) { gagnerEtape(); sons.bon(); } else { sons.mauvais(); }
    rendu();
  }

  function actionExecuterEtape(verifier) {
    const LS = ETAT.lecon;
    const l = leconParId(LS.id);
    const etape = l.etapes[LS.etape];
    const code = LS.brouillons[LS.etape] || "";
    const entree = etape.entree !== undefined ? codeDe(etape.entree) : "";
    const res = Mynion.executer(code, { entree });
    let affichage = res.sortie;
    if (res.erreur) {
      affichage = (res.sortie || "") + "🍌💥 " + res.erreur.message + (res.erreur.ligne ? "\n→ " + t("etape") + " " + res.erreur.ligne : "");
    }
    LS.consoles[LS.etape] = affichage;
    if (verifier && !res.erreur) {
      const attendu = normaliser(L(etape.attendu));
      const obtenu = normaliser(res.sortie);
      const ok = obtenu === attendu;
      LS.resultats[LS.etape] = { ok, sortieUtilisateur: ok ? undefined : (affichage || "—") };
      if (ok) { gagnerEtape(); sons.bon(); } else { sons.mauvais(); }
    } else if (verifier && res.erreur) {
      LS.resultats[LS.etape] = { ok: false, sortieUtilisateur: affichage };
      sons.mauvais();
    }
    rendu();
  }

  function actionSolution() {
    const LS = ETAT.lecon, l = leconParId(LS.id), etape = l.etapes[LS.etape];
    LS.brouillons[LS.etape] = codeDe(etape.solution);
    rendu();
    toast("✅ " + t("solutionChargee"));
  }

  function gagnerEtape() {
    const LS = ETAT.lecon;
    const l = leconParId(LS.id);
    const etape = l.etapes[LS.etape];
    if (!LS.gagne[LS.etape]) {
      LS.gagne[LS.etape] = true;
      const xp = XP_ETAPE[etape.type] || 0;
      if (!LS.sansXp) { LS.xpTotal += xp; ETAT.xp += xp; }
    }
  }

  function actionContinuer() {
    const LS = ETAT.lecon;
    const l = leconParId(LS.id);
    if (LS.etape < l.etapes.length - 1) {
      LS.etape++;
      rendu();
      window.scrollTo(0, 0);
    } else {
      LS.terminee = true;
      const premiereFois = !ETAT.progres[LS.id];
      ETAT.progres[LS.id] = true;
      if (premiereFois && !LS.sansXp) { LS.xpTotal += XP_BONUS_LECON; ETAT.xp += XP_BONUS_LECON; }
      majSerie();
      sons.fini();
      confettis();
      rendu();
      window.scrollTo(0, 0);
    }
  }

  /* ── délégation d'événements ── */
  document.addEventListener("click", (ev) => {
    const el = ev.target.closest("[data-action]");
    if (!el) return;
    const [action, arg] = el.getAttribute("data-action").split(":");
    switch (action) {
      case "lang":
        ETAT.lang = arg;
        rendu();
        break;
      case "son":
        ETAT.muet = !ETAT.muet;
        rendu();
        break;
      case "nav":
        if (arg === "labo" && !laboOuvert()) { toast("🔒 " + t("laboVerrouille")); break; }
        ETAT.vue = arg;
        if (arg === "labo" && !ETAT.labo) {
          ETAT.labo = { code: codeDe(EXEMPLES[0].code), entree: "", sortie: "", python: "", pythonOuvert: false };
        }
        rendu();
        window.scrollTo(0, 0);
        break;
      case "lecon":
        if (arg && leconParId(arg)) { ouvrirLecon(arg); }
        break;
      case "verrouillee":
        toast(t("verrouillee"));
        break;
      case "lecon_quitter":
        break;
      case "reponse":
        actionReponse(parseInt(arg, 10));
        break;
      case "ordre":
        if (arg === "verifier") actionOrdreVerifier();
        break;
      case "etape":
        if (arg === "continuer") actionContinuer();
        else if (arg === "verifier") actionExecuterEtape(true);
        else if (arg === "executer") actionExecuterEtape(false);
        else if (arg === "indice") { ETAT.lecon.indices[ETAT.lecon.etape] = true; rendu(); }
        else if (arg === "solution") actionSolution();
        break;
      case "labo":
        if (arg === "executer") actionLaboExecuter();
        else if (arg === "effacer") { ETAT.labo.code = ""; ETAT.labo.sortie = ""; rendu(); }
        break;
      case "partager":
        actionPartager(arg);
        break;
      case "deverrouiller":
        ETAT.toutDeverrouille = true;
        rendu();
        break;
      case "reset":
        if (confirm(t("confirmerReset"))) {
          const lang = ETAT.lang, muet = ETAT.muet;
          ETAT = etatInitial();
          ETAT.lang = lang; ETAT.muet = muet;
          rendu();
        }
        break;
    }
    /* actions composées */
    const act = el.getAttribute("data-action");
    if (act && act.startsWith("ordre:prendre:")) actionOrdrePrendre(parseInt(act.split(":")[2], 10));
    if (act && act.startsWith("ordre:retirer:")) actionOrdreRetirer(parseInt(act.split(":")[2], 10));
    if (act === "lecon:quitter") { ETAT.lecon = null; rendu(); window.scrollTo(0, 0); }
  });

  /* ═══════════════ DÉMARRAGE ═══════════════ */
  charger();
  if (!ETAT.lang) {
    ETAT.lang = ((navigator.language || "fr").toLowerCase().indexOf("fr") === 0) ? "fr" : "en";
  }
  if (!ETAT.labo) {
    ETAT.labo = { code: codeDe(EXEMPLES[0].code), entree: "", sortie: "", python: "", pythonOuvert: false };
  }
  rendu();
})();
