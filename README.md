# Madame Voyance

Application web mobile de voyance quotidienne : pensée du jour, tarot (22 ou 78 cartes, carte du jour, 3 cartes, croix celtique), horoscope, signe chinois, phase de lune, numérologie, rune du jour, pierre et couleur, pendule et compatibilité. Chaque rituel du jour rapporte des points, avec séries, niveaux et dos de cartes à débloquer.

Toutes les données (prénom, date de naissance, points, journal) restent dans le navigateur de l'appareil. Rien n'est envoyé à un serveur.

L'application est installable sur l'écran d'accueil (iPhone et Android) et fonctionne hors ligne.

## Structure

| Dossier | Contenu |
|---|---|
| `src/data.js` | Tous les textes : arcanes, horoscopes, runes, pierres, pensées, niveaux, points |
| `src/app.js` | Logique de l'application |
| `src/head.html` | Styles et polices |
| `cards/` | Illustrations des 78 cartes (`m00`–`m21`, puis `w`, `c`, `s`, `p` + `01`–`14`) |
| `icons/` | Icône de l'application |
| `build.py` | Assemble le site dans `docs/` |
| `docs/` | Site généré, publié par GitHub Pages |

## Modifier et republier

```sh
python3 build.py
git add -A && git commit -m "Mise à jour" && git push
```

GitHub Pages republie le site automatiquement. Les téléphones reçoivent la nouvelle version à la visite suivante.

## Publication avec GitHub Pages

Dans le dépôt : **Settings → Pages → Build and deployment → Deploy from a branch**, branche `main`, dossier `/docs`.

## Crédits

Illustrations provisoires : tarot Rider-Waite-Smith (Pamela Colman Smith, 1909), domaine public. Madame Voyance est un divertissement.
