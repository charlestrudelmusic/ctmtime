# ctmTIME (famille ctmLAB)

Gestion du temps. 
Outil web pour les élèves : où va leur semaine, et leur pratique d'ici la fin de la session.
Un seul fichier (`index.html`), hors ligne, sans compte. Les données restent dans l'appareil de l'élève ; rien n'est envoyé.

- `index.html` : toute l'app (CSS + code).
- `manifest.webmanifest`, `icones/` : installation sur l'écran d'accueil.
- `sw.js` : fonctionnement hors ligne. **Changer `VERSION` à chaque mise en ligne.**

En ligne : https://charlestrudelmusic.github.io/ctmtime/ (GitHub Pages, branche `main`).

Publier une mise à jour : changer `VERSION` dans `sw.js`, commit, puis `git push`. Les élèves la reçoivent à la prochaine ouverture avec Internet (fermer et rouvrir l'app).

Tester sur l'ordi : `python3 -m http.server 8765` dans ce dossier, puis http://localhost:8765.

© 2026 Charles Trudel. Tous droits réservés.
