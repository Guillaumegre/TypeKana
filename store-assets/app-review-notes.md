# App Review — réponse à « Guideline 2.1 - Information Needed »

Apple envoie ce questionnaire aux comptes développeurs récents. Ce n'est pas un
défaut de l'app : il faut fournir une vidéo de démonstration et six réponses.

Le texte ci-dessous se colle à **deux endroits** :
1. Centre de résolution, en réponse au message d'Apple.
2. App Store Connect → la version → **Informations de vérification de l'app** →
   champ **Remarques**, comme Apple le demande explicitement pour les prochaines
   soumissions.

Les deux champs sont limités à **4000 caractères**, d'où cette version resserrée.
Avant d'envoyer, remplacer le seul marqueur restant : le lien de la vidéo.

---

```
Hello,

Answers to your six questions. The same text has been added to the Notes field
of the App Review Information section.

1. SCREEN RECORDING

[LIEN DE LA VIDEO]

Recorded on a physical iPhone 15 Pro running iOS 27.0. It starts with launching
the app and shows: the 3-step tutorial, adding the iOS Japanese keyboard in
Settings, a themed training session with kana typed on that keyboard, a JLPT
session, the 60-second Race mode, creating a personal list, and the TypeKana
Premium paywall.

- Account registration, login and deletion: not applicable. The app has no
account system, no login and no server. It works offline right after install.
- User-generated content: users can create personal word lists, but these are
stored locally on their own device only. Nothing is uploaded, shared or visible
to any other user, so no reporting or blocking mechanism applies.
- Accessing paid features: shown in the recording. Settings > the "TypeKana
Premium" banner opens the paywall.

2. PURPOSE AND TARGET AUDIENCE

TypeKana is a typing trainer for the Japanese keyboard. Learners of Japanese are
taught to READ hiragana and katakana, but never to TYPE them. On iPhone,
Japanese is typed with the flick ("Kana") keyboard, where each key holds a whole
kana row and the other kana are reached by sliding in a direction. Even fluent
readers stay slow and hesitant the moment they have to write a message, look up
a word, or use a Japanese app.

Audience: teenagers and adults learning Japanese, whether self-taught, in class,
or preparing the JLPT. The app assumes kana reading is already known and trains
typing speed and muscle memory through short drills, organised by theme and by
JLPT level, with sound and haptic feedback, a daily streak and a 60-second Race
mode. Everything works offline and all progress stays on the device.

3. SETUP AND MAIN FEATURES

No login, demo account or sample file is required. One setup step is needed,
because the app uses the iPhone's own Japanese keyboard rather than a simulated
one:

Settings > General > Keyboard > Keyboards > Add New Keyboard > Japanese, then
choose the "Kana" layout (not Romaji). In the app, tap the globe key at the
bottom left of the keyboard to switch to Japanese.

The app shows this 3-step tutorial on first launch, it can be reopened from
Settings > "Review the tutorial", and it is demonstrated in the recording.

- Home > Training > By theme, or By JLPT level: type each word's kana reading,
then tap "Validate", or tap "Skip".
- Home > Training > My lists: create personal lists, stored locally.
- Home > Race: a 60-second timed mode.
- Settings (gear icon, top right): words per session, daily reminder, language,
sound, ad privacy, privacy policy, restore purchases.
- Settings > "TypeKana Premium": the paywall. The free version allows 5 sessions
a day and 3 personal lists, with ads. The auto-renewing subscription (monthly or
yearly, 3-day free trial) removes the ads and both limits.

4. EXTERNAL SERVICES

- Apple In-App Purchase / StoreKit: the subscription.
- RevenueCat: subscription management only (receipt validation, entitlement
status, restore purchases). It receives anonymous purchase events tied to a
randomly generated app user ID.
- Google AdMob: banner, interstitial and rewarded ads, non-personalized only,
maximum ad content rating G. Users in the EEA and the UK are shown Google's UMP
consent form on first launch, reopenable from Settings > "Ad privacy".

There is no backend, no server, no database, no authentication service, no
analytics SDK, no data provider and no AI service. All content is bundled in the
app; an internet connection is only used for ads and purchases.

5. REGIONAL DIFFERENCES

Features and content are identical in every region. Only two variations exist,
both imposed externally: the UMP consent form is shown in the EEA and the UK
only, and subscription prices follow App Store Connect price points for each
storefront. The interface is available in French and English, follows the device
language, and can be changed at any time in Settings.

6. REGULATED INDUSTRY OR THIRD-PARTY MATERIAL

Neither applies. All vocabulary, sentences and translations were written and
compiled by me. The app contains no official JLPT examination material and no
publisher content: "N5" to "N3" are used only as descriptive difficulty labels,
and the app is not affiliated with or endorsed by the Japan Foundation or JEES.
It embeds no third-party fonts (system fonts only). The two sound effects are
short synthesized tones generated programmatically for this app, not sampled
from any third-party recording or library.

Best regards,
Guillaume
```

---

## À remplir avant d'envoyer

Un seul marqueur reste, `[LIEN DE LA VIDEO]`, à remplacer par le lien Google
Drive, partagé en « Tous les utilisateurs disposant du lien ».

Déjà renseigné : iPhone 15 Pro sous iOS 27.0, et l'origine des sons (tonalités
de synthèse générées pour l'app, aucun échantillon tiers).

**Vérifier avant d'envoyer** que la classification du contenu des annonces AdMob
est bien sur G, sinon retirer la mention correspondante du point 4.

## Plan de la vidéo (2 à 3 minutes, une seule prise)

1. Lancement de l'app depuis l'écran d'accueil de l'iPhone. **Obligatoire en
   premier**, Apple l'exige explicitement.
2. Le tutoriel en 3 étapes, qui explique la mise en place du clavier.
3. Sortir vers Réglages iOS → Général → Clavier → Claviers → Ajouter un clavier →
   Japonais → disposition **Kana**. 15 à 20 secondes suffisent.
4. Revenir dans l'app, ouvrir un exercice, **toucher la touche globe** en bas à
   gauche pour passer en japonais. C'est le geste sur lequel un relecteur bloque.
5. Training → Par thème : taper 2 ou 3 mots, montrer « Valider ».
6. Training → Par niveau JLPT : un mot.
7. Race : quelques secondes de chrono.
8. Mes listes : créer une liste avec un mot.
9. Réglages → bannière **TypeKana Premium** → laisser le paywall s'afficher avec
   les prix. **Le point le plus important**, Apple le demande noir sur blanc.
10. Retour à l'accueil.

Avant d'enregistrer : supprimer le clavier japonais pour pouvoir filmer son
ajout, activer le mode Concentration, et passer l'app en anglais.
