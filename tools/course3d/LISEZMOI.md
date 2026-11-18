# course3d.js — personnages et animaux 3D de « La course vers la mort »
Sources de `/course3d.js` (Three.js 0.170, rendu hors écran composé dans le canvas 2D du jeu).
Build : `npm i three@0.170.0 esbuild && npx esbuild src/main.js --bundle --minify --format=iife --target=es2019 --outfile=../../course3d.js`
Le jeu charge ce fichier à la demande ; sans lui (appareil faible, WebGL absent, trop lent) l'ancien rendu 2D reste actif. Aucune règle de jeu n'en dépend.
`?q3d=off` force le 2D, `?q3d=mid` / `?q3d=high` force la qualité.
