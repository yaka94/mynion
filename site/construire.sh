#!/usr/bin/env bash
# 🍌 Assemble les sources de site/src/ en un seul site/index.html autonome
# (utilise-le après avoir modifié les sources — l'index.html est déjà construit)
set -e
cd "$(dirname "$0")"
{
  cat src/squelette_haut.html
  echo "<style>"
  cat src/style.css
  echo "</style>"
  cat src/squelette_body.html
  echo "<script>"
  cat src/noyau.js
  echo "</script>"
  echo "<script>"
  cat src/donnees.js
  echo "</script>"
  echo "<script>"
  cat src/app.js
  echo "</script>"
  echo "</body>"
  echo "</html>"
} > index.html
echo "✅ index.html construit ($(wc -c < index.html) octets)"

# GitHub Pages ne sert que la racine du dépôt : on y dépose aussi une copie
# du site construit (+ l'image de partage), prête à être commitée.
if [ -f og.png ]; then
  cp index.html ../index.html
  cp og.png ../og.png
  echo "✅ copie de déploiement posée à la racine du dépôt (../index.html + ../og.png)"
fi
