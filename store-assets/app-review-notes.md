# App Review — réponse à « Guideline 2.1 - Information Needed »

Apple envoie ce questionnaire aux comptes développeurs récents. Ce n'est pas un
défaut de l'app : il faut fournir une vidéo de démonstration et six réponses.

Le texte ci-dessous se colle à **deux endroits** :
1. Centre de résolution, en réponse au message d'Apple.
2. App Store Connect → la version → **Informations de vérification de l'app** →
   champ **Notes**, comme Apple le demande explicitement pour les prochaines
   soumissions.

Avant d'envoyer, remplacer le seul marqueur restant : le lien de la video.

---

```
Hello,

Thank you for reviewing TypeKana. Please find below all the requested
information. The same text has been added to the Notes field of the App Review
Information section.

1. SCREEN RECORDING

[LIEN DE LA VIDEO]

Recorded on a physical iPhone 15 Pro running iOS 27.0. The recording
starts with launching the app and follows a typical user flow: the 3-step
keyboard tutorial, a training session by theme with kana typed on the iOS
Japanese keyboard, a JLPT session, the 60-second Race mode, creating a personal
word list, and opening the TypeKana Premium paywall.

Regarding the specific flows listed in your message:

- Account registration, login and account deletion: not applicable. TypeKana has
  no account system of any kind. There is no registration, no login and no
  server. The app is fully usable offline immediately after installation.
- User-generated content: users can create personal vocabulary lists, but these
  are stored locally on their own device only. Nothing is uploaded, published,
  shared or visible to any other user, so there is no user-to-user content and
  no reporting or blocking mechanism is required.
- Accessing paid content or features: shown in the recording. The paywall is
  opened from Settings > the "TypeKana Premium" banner.

2. PURPOSE AND TARGET AUDIENCE

TypeKana is a typing trainer for the Japanese keyboard.

The problem it solves: people learning Japanese are taught to READ hiragana and
katakana, but almost never train to TYPE them. On iPhone, Japanese is typed with
the flick ("Kana") keyboard, where each key carries a whole kana row and the
other kana are reached by sliding in a direction. Learners who can read fluently
are still slow and hesitant when they actually have to write something, which
holds them back the moment they want to text a Japanese friend, look up a word
in a dictionary, or use a Japanese app or website.

Target audience: teenagers and adults learning Japanese, whether self-taught,
in class, or preparing the JLPT exam. The app assumes the user already knows how
to read kana and focuses purely on typing speed and muscle memory.

The value it provides: short, repeatable drills on the real system keyboard
(rather than a simulated one), organised by theme and by JLPT level, with
immediate sound and haptic feedback, a daily streak and a 60-second Race mode
for motivation. Everything works offline and all progress stays on the device.

3. SETTING UP AND ACCESSING THE MAIN FEATURES

No login credentials, demo account or sample file are required. The app is fully
functional right after installation.

IMPORTANT - one setup step is needed to type the answers, because the app uses
the iPhone's own built-in Japanese keyboard rather than a simulated one:

  Settings > General > Keyboard > Keyboards > Add New Keyboard > Japanese,
  then choose the "Kana" layout (not Romaji).

Then, inside the app, when a word appears and the keyboard opens, tap the globe
key at the bottom left of the keyboard to switch to Japanese. The app displays
this exact 3-step tutorial on first launch, and it can be reopened at any time
from Settings > "Review the tutorial".

Main features and how to reach them:

- Home > Training > By theme: pick a category (animals, food, verbs, colors...),
  then type each word's kana reading and tap "Validate", or tap "Skip".
- Home > Training > By JLPT level: the same exercise with words and sentences
  ranked from N5 to N3.
- Home > Training > My lists: create a personal list with your own words and
  translations, stored locally on the device.
- Home > Race: a 60-second timed mode; type as many words as possible.
- Settings (gear icon, top right of the home screen): words per session, daily
  reminder, interface language (French/English), tutorial, sound and haptics,
  ad privacy, privacy policy, restore purchases, reset progress.
- Settings > "TypeKana Premium" banner: opens the subscription paywall.
- Inside an exercise, the display mode (Kana, Kanji, Hint, Test) is switched
  from the controls on the game screen itself.

The free version allows 5 sessions per day and 3 personal lists, and shows ads.
The auto-renewing subscription (monthly or yearly, with a 3-day free trial)
removes the ads and lifts both limits.

4. EXTERNAL SERVICES, TOOLS AND PLATFORMS

- Apple In-App Purchase / StoreKit: the auto-renewing subscription.
- RevenueCat (revenuecat.com): subscription management only - receipt
  validation, entitlement status and "Restore purchases". It receives anonymous
  purchase events tied to a randomly generated app user ID.
- Google AdMob: banner, interstitial and rewarded ads. Ads are always requested
  in non-personalized mode. Users in the EEA and the UK are shown Google's UMP
  consent form on first launch, which can be reopened from Settings > "Ad
  privacy". The maximum ad content rating is set to G.

No other external service is used. There is no backend, no server, no database,
no authentication service, no analytics SDK, no data provider and no AI service.
All vocabulary content is bundled inside the app, which is why it works entirely
offline; an internet connection is only used to load ads and to process
purchases.

5. REGIONAL DIFFERENCES

The app's features and content are identical in every region. The only two
variations are imposed by regulation or by the platform:

- Users in the EEA and the UK are presented with Google's UMP consent form for
  ads on first launch. Users elsewhere are not.
- Subscription prices follow the App Store Connect price points for each
  storefront.

The interface is available in French and English. It follows the device
language automatically and can be changed at any time in Settings. All exercises
and vocabulary are the same in both languages.

6. REGULATED INDUSTRY OR PROTECTED THIRD-PARTY MATERIAL

TypeKana does not operate in a regulated industry and contains no protected
third-party material.

All content is original: the vocabulary words, the example sentences and their
French and English translations were compiled and written by me. The app
contains no official JLPT examination material and no material from any
publisher. "N5" to "N3" are used only as descriptive difficulty labels for the
exercises; the app is not affiliated with, endorsed by, or sponsored by the
Japan Foundation or JEES.

The app embeds no third-party fonts (it uses the system fonts only). The two sound effects are short synthesized tones (0.16 s and 0.25 s) generated programmatically as raw waveforms for this app; they are not sampled from, or derived from, any third-party recording or sound library.

Please let me know if anything else would help complete the review.

Best regards,
Guillaume
```

---

## À remplir avant d'envoyer

Un seul marqueur reste, `[LIEN DE LA VIDEO]`, à remplacer par le lien de
l'enregistrement (YouTube non répertorié, Google Drive ou iCloud).

Déjà renseigné : iPhone 15 Pro sous iOS 27.0, et l'origine des sons
(tonalités de synthèse générées pour l'app, aucun échantillon tiers).

**Vérifier avant d'envoyer** que la classification du contenu des annonces
AdMob est bien sur G, sinon retirer la phrase correspondante du point 4.

## Plan de la vidéo (2 à 3 minutes)

1. Écran d'accueil au lancement, depuis l'écran d'accueil de l'iPhone.
2. Le tutoriel en 3 étapes.
3. Training → Par thème : taper 2 ou 3 mots en japonais, montrer « Valider ».
4. Training → Par niveau JLPT : un mot.
5. Race : quelques secondes du chrono.
6. Mes listes : créer une liste avec un mot.
7. Réglages : faire défiler, puis toucher la bannière **TypeKana Premium** et
   laisser le paywall s'afficher avec les prix. **Le point le plus important.**
8. Revenir à l'accueil.

Enregistrement iPhone : Réglages → Centre de contrôle → ajouter
« Enregistrement de l'écran », puis Centre de contrôle → bouton d'enregistrement.
