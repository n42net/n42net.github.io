# n42net.github.io

Startseite **[n42net.github.io](https://n42net.github.io/)** und darunter die Übersicht der Home-Assistant-Integrationen, **[Die Wacht-Familie](https://n42net.github.io/home-assistant/)** ([English](https://n42net.github.io/home-assistant/?lang=en)).

Statische Seiten ohne Build-Schritt, ohne Cookies und ohne Anfragen an Dritte. Die Zahlen der Übersicht (Versionen, Releases, Commits, Code, Tests, HACS-Stand, Pull Requests in fremden Repos) holt `tools/build_data.py` aus öffentlichen GitHub-Daten und schreibt sie nach `home-assistant/data.js`. Der Workflow `pages.yml` macht das täglich, bei jedem Push auf `main` und auf Knopfdruck, und veröffentlicht die Seiten.

| Datei | Inhalt |
| --- | --- |
| `index.html` | Startseite (deutsch und englisch) |
| `home-assistant/index.html` | Übersicht, Layout und deutsche Texte |
| `home-assistant/en.js` | englische Texte der Übersicht |
| `home-assistant/data.js` | erzeugt von `tools/build_data.py`, eingecheckt nur zum lokalen Ansehen |
| `home-assistant/icons/` | Icons der Integrationen, kopiert aus deren Repos |
| `fonts/` | Space Grotesk, IBM Plex Sans und IBM Plex Mono (SIL Open Font License 1.1) |

Lokal ansehen: `python -m http.server` im Ordner, dann `http://localhost:8000/`. Daten auffrischen: `python tools/build_data.py` (Token aus `GITHUB_TOKEN` oder `gh auth token`).

Code unter MIT-Lizenz, Schriften unter ihrer eigenen Lizenz (`fonts/OFL-*.txt`).
