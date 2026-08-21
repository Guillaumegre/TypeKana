# Kana Typing Trainer — Brief de projet

## Objectif
Appli mobile (React Native) d'entraînement à la saisie sur clavier japonais (kana direct, pas de romaji).
Inspiration : "Kana Type Japanese" (App Store) + esprit 10FastFingers pour le mode Race.
Fonctionne 100% **offline**.

## Stack
- **React Native** (Expo recommandé pour démarrer vite et tester facilement sur téléphone via Expo Go)
- Stockage local : pas besoin d'une vraie base de données, deux briques suffisent
  - **Vocabulaire (JLPT, thèmes)** : donnée statique fournie avec l'appli sous forme de JSON, chargée en mémoire et filtrée en JS. Même un N1 complet (~10 000 mots) reste largement gérable ainsi — `expo-sqlite` ne deviendrait utile qu'en cas de requêtes complexes ou de volume bien plus important.
  - **Données utilisateur (PB, précision, progression)** : `AsyncStorage`, simple clé/valeur, suffisant pour ce cas d'usage.
- Pas de serveur, appli 100% offline.

## Versionning
Git dès le départ, pas besoin d'attendre d'avoir "quelque chose de propre". `npx create-expo-app` génère un `.gitignore` correct par défaut (node_modules, .expo, etc.) — `git init` + premier commit dès la création du projet, puis push régulier sur GitHub au fil de l'avancement.

## Écrans

1. **Accueil** — deux boutons : Training / Race
2. **Training → sélection** — choix entre :
   - **Niveau** (JLPT) : N5, N4, N3, N2, N1
   - **Thème** : animaux, transports, nourriture, couleurs, nombres, corps humain, famille, etc.
3. **Jeu** — écran unique réutilisé pour Training ET Race (la logique diffère : liste de mots à parcourir vs chrono 60s), affichage du mot cible (kanji ou kana selon config), zone de saisie kana, feedback immédiat
4. **Résultats** — score, précision (%), indication si nouveau PB battu

Note : Race n'a pas d'écran de sélection intermédiaire — Accueil → Race → Jeu directement (60s, mots piochés dans tout le vocabulaire, ou filtrés si on ajoute cette option plus tard).

## Modes de jeu

### Training
- **Par niveau (JLPT)** : vocabulaire classé N5 → N1, mots affichés dans l'ordre ou aléatoirement dans le niveau choisi
- **Par thème** : vocabulaire classé par catégorie, indépendamment du niveau JLPT

### Race (type 10FastFingers)
- 60 secondes, mots aléatoires (tout le vocabulaire confondu)
- Résultat : nombre de mots corrects + précision (%)
- **PB sauvegardé en local**, affiché en fin de partie si battu

## Kanji : affichage vs saisie

Approche retenue : **afficher le kanji (ex: 猫), l'utilisateur tape la lecture en kana (ねこ)**.
Ça entraîne à la fois la lecture des kanji (essentiel dès N4/N3) et la frappe kana — plus proche de l'esprit JLPT que de la simple vitesse de frappe.

Deux toggles, disponibles dans **Training et Race** (pas limités au Training) :

- **Toggle "Mode Kanji"** (on/off)
  - Off → toujours kana pur, quel que soit le mot.
  - On → affiche le kanji quand le mot en a un pour ce niveau, sinon kana par défaut (cas fréquent en N5).
- **Toggle "Indice"** (visible seulement si Mode Kanji est activé)
  - On → affiche un petit hint (ex : lecture en furigana au-dessus/en dessous du kanji) pour s'aider.
  - Off → pas d'aide, il faut connaître la lecture par cœur.

→ 3 configurations possibles au total : **kana pur** / **kanji sans aide** / **kanji avec indice**, applicables partout.

## Modèle de données (vocabulaire)

```json
{
  "id": "animal_001",
  "kana": "ねこ",
  "kanji": "猫",
  "meaning_fr": "chat",
  "category": "animaux",
  "jlpt_level": "N5"
}
```

- `kanji` peut être `null` si le mot n'a pas de kanji au programme à ce niveau.
- Stocker le vocabulaire en JSON, par exemple `data/vocab.json` (une seule liste avec les champs `category` et `jlpt_level` pour filtrer), ou séparé par catégorie si plus pratique à maintenir — à voir selon le volume.
- Bootstrap possible à partir de listes de vocabulaire JLPT déjà existantes en ligne (N5 à N1) plutôt que de tout saisir à la main.

## Gestion de la saisie kana (point technique important)

Avec un clavier IME japonais, la saisie ne se fait pas caractère par caractère comme en alphabet latin. En React Native, le comportement de l'IME dépend du composant `TextInput` et de la plateforme (iOS/Android peuvent différer) — à tester tôt dans le projet :

- Écouter le texte final confirmé plutôt que chaque frappe intermédiaire (équivalent des événements de composition en web : `compositionstart` / `compositionupdate` / `compositionend`)
- Normaliser le texte (Unicode NFC) avant comparaison, pour éviter les faux négatifs sur les caractères composés (dakuten, っ, ー, etc.)
- Prévoir de tester sur device réel tôt, le comportement IME en simulateur n'est pas toujours fiable

## Stats / progression locale (AsyncStorage)
- PB Race : score + précision (un PB global pour commencer, éventuellement par filtre plus tard)
- Historique des scores Race (optionnel, pour voir sa progression dans le temps)
- Progression Training : mots vus/maîtrisés par niveau/thème (peut attendre une V2)

## Roadmap suggérée
1. **V1** : Écran Accueil + Training par thème (3-4 catégories, ~15 mots chacune, sans kanji pour commencer) — valider l'UX de saisie kana en React Native sur device réel
2. **V2** : Training par niveau JLPT (N5 en premier) + intégration kanji avec toggle indice
3. **V3** : Mode Race avec chrono, scoring, PB sauvegardé en AsyncStorage
4. **V4** : Vocabulaire complet N5→N1, progression Training, polish UI

## Nom de l'application (piste)
**KanaDash** ou **KanaRace** — courts, évoquent la vitesse, cohérents avec le mode Race. Vérifier la disponibilité du nom sur l'App Store avant de s'arrêter dessus.

## Soumission App Store — points d'attention

Même pour une appli simple et offline, plusieurs points font régulièrement échouer une review Apple si on les néglige :

- **Politique de confidentialité obligatoire** : même sans collecte de données (100% offline), Apple exige une URL de politique de confidentialité valide dans App Store Connect. Prévoir une page simple (peut être hébergée sur GitHub Pages) qui précise qu'aucune donnée n'est collectée/transmise.
- **Privacy Nutrition Label** : à remplir dans App Store Connect même si "aucune donnée collectée" — sélectionner explicitement les cases correspondantes, ne pas laisser vide.
- **Fonctionnalité minimale** : Apple rejette les apps jugées trop basiques ("app minimale"/faible valeur ajoutée). Avoir au moins Training (niveaux + thèmes) et Race fonctionnels avant de soumettre, pas juste un seul mode.
- **Pas de crash / pas de contenu placeholder** : tester sur device réel (pas juste simulateur) avant soumission — l'IME japonais étant le point technique le plus risqué du projet, s'assurer qu'il ne crash jamais, y compris avec des cas limites (dakuten, っ, ー, champ vide, etc.).
- **Icônes et captures d'écran** : prévoir l'icône dans toutes les tailles requises (Expo/EAS peut générer automatiquement via `app.json`), et des captures d'écran pour les tailles d'appareils exigées par Apple (iPhone 6.7" au minimum).
- **EAS Build + soumission** : avec Expo, utiliser `eas build` puis `eas submit` pour générer le binaire et l'envoyer à App Store Connect, plus simple que du Xcode manuel. Nécessite un compte Apple Developer (99$/an).
- **Note aux reviewers** : dans le champ "App Review Information" d'App Store Connect, expliquer brièvement en anglais le fonctionnement (appli d'entraînement à la saisie de kana japonais, pas besoin de compte, pas de connexion internet) — évite toute confusion côté reviewer face à une appli en japonais.
- **Support URL** : requis aussi, même une simple page GitHub ou un README suffit.
- **Âge / classification de contenu** : contenu éducatif neutre, classification basse attendue (4+), à vérifier lors du remplissage du questionnaire de classification.

## Notes de démarrage pour Claude Code
- Démarrer avec Expo pour itérer vite (`npx create-expo-app`)
- Tester la saisie kana sur device réel dès la V1, avant d'investir dans le reste — c'est le point le plus risqué techniquement
- Vocabulaire réduit au départ pour ne pas perdre de temps sur la donnée avant d'avoir validé l'UX de saisie
- Anticiper la politique de confidentialité et le support URL avant la première soumission App Store, pas au dernier moment
- Tester l'app avec `eas build --profile preview` sur device réel avant de viser la review App Store
