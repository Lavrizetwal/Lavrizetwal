# course3d.js — personnages et animaux 3D de « La course vers la mort »
Sources de `/course3d.js` (Three.js 0.170, rendu hors écran composé dans le canvas 2D du jeu).
Build : `npm i three@0.170.0 esbuild && npx esbuild src/main.js --bundle --minify --format=iife --target=es2019 --outfile=../../course3d.js`
Le jeu charge ce fichier à la demande ; sans lui (appareil faible, WebGL absent, trop lent) l'ancien rendu 2D reste actif. Aucune règle de jeu n'en dépend.
`?q3d=off` force le 2D, `?q3d=mid` / `?q3d=high` force la qualité.

## Ajouter un coureur
1. Déposer le modèle dans `models/` (GLB humanoïde, une seule maille, T-pose, ~5 000 triangles, texture 512 px).
2. Ajouter une ligne dans `runners.json` : `{ "id": "fille2", "name": "Nom affiché", "desc": "Description courte", "url": "models/fille2.glb?v=1" }`
   (id : minuscules, chiffres, - ou _ ; si les membres sont mal placés, ajouter `"spec": { ... }` pour corriger les proportions comme dans `SPEC_FILLE1` de `src/rig.js`).
3. Le sélecteur « Coureur » de course.html l'affiche tout seul. Le hub utilise `hub/runner-<id>-0.png` et `-1.png` (deux poses de course) ; sans ces images, il montre le coureur par défaut.
4. Incrémenter la version dans `sw.js`.
