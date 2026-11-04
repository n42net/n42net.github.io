# Die Wacht-Familie

Übersichtsseite der sechs Home-Assistant-Integrationen von n42net: **[n42net.github.io](https://n42net.github.io/)** ([English](https://n42net.github.io/?lang=en)).

Statische Seite ohne Build-Schritt, ohne Cookies und ohne Anfragen an Dritte. Die Zahlen (Versionen, Releases, Commits, Code, Tests, HACS-Stand, Pull Requests in fremden Repos) holt `tools/build_data.py` aus öffentlichen GitHub-Daten und schreibt sie nach `data.js`. Der Workflow `pages.yml` macht das täglich, bei jedem Push auf `main` und auf Knopfdruck, und veröffentlicht die Seite.

| Datei | Inhalt |
| --- | --- |
| `index.html` | Seite, Layout und deutsche Texte |
| `en.js` | englische Texte |
| `data.js` | erzeugt von `tools/build_data.py`, eingecheckt nur zum lokalen Ansehen |
| `icons/` | Icons der Integrationen, kopiert aus deren Repos |
| `fonts/` | Space Grotesk, IBM Plex Sans und IBM Plex Mono (SIL Open Font License 1.1) |

Lokal ansehen: `python -m http.server` im Ordner, dann `http://localhost:8000/`. Daten auffrischen: `python tools/build_data.py` (Token aus `GITHUB_TOKEN` oder `gh auth token`).

Code unter MIT-Lizenz, Schriften unter ihrer eigenen Lizenz (`fonts/OFL-*.txt`).
