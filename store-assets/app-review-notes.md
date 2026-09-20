# App Review — réponse à « Guideline 2.1 - Information Needed »

Apple envoie ce questionnaire aux comptes développeurs récents. Ce n'est pas un
défaut de l'app : il faut fournir une vidéo de démonstration et six réponses.

Le texte ci-dessous se colle à **deux endroits** :
1. Centre de résolution, en réponse au message d'Apple.
2. App Store Connect → la version → **Informations de vérification de l'app** →
   champ **Remarques**, comme Apple le demande explicitement pour les prochaines
   soumissions.

Les deux champs sont limités à **4000 caractères**, lien de la vidéo compris.
Avant d'envoyer, remplacer le seul marqueur restant.

---

```
Hello,

Answers to your six questions, also added to the App Review Information Notes.

1. SCREEN RECORDING

[LIEN DE LA VIDEO]

Recorded on a physical iPhone 15 Pro running iOS 27.0. It starts with launching
the app and shows the 3-step tutorial, adding the iOS Japanese keyboard, a
themed training session with kana typed on that keyboard, a JLPT session, the
60-second Race mode, creating a personal list, and the Premium paywall.

- Account registration, login and deletion: not applicable. The app has no
account system, no login and no server. It works offline right after install.
- User-generated content: personal word lists are stored locally on the user's
own device only. Nothing is uploaded, shared or visible to any other user, so no
reporting or blocking mechanism applies.
- Paid features: shown in the recording. Settings > the "TypeKana Premium"
banner opens the paywall.

2. PURPOSE AND TARGET AUDIENCE

TypeKana is a typing trainer for the Japanese keyboard. Learners of Japanese are
taught to READ hiragana and katakana, but never to TYPE them. On iPhone,
Japanese is typed with the flick ("Kana") keyboard, where each key holds a whole
kana row and the other kana are reached by sliding in a direction. Even fluent
readers stay slow and hesitant when they have to write a message or look up a
word.

Audience: teenagers and adults learning Japanese, self-taught, in class or
preparing the JLPT. The app assumes kana reading is known and trains typing
speed through short drills by theme and JLPT level, with sound and haptic
feedback, a daily streak and a 60-second Race mode. It works offline and all
progress stays on the device.

3. SETUP AND MAIN FEATURES

No login, demo account or sample file is required. One setup step is needed,
because the app uses the iPhone's own Japanese keyboard rather than a simulated
one:

Settings > General > Keyboard > Keyboards > Add New Keyboard > Japanese, then
choose the "Kana" layout (not Romaji). In the app, tap the globe key at the
bottom left of the keyboard to switch to Japanese. This 3-step tutorial is shown
on first launch, can be reopened from Settings, and is in the recording.

- Home > Training > By theme, or By JLPT level: type each word's kana reading,
then tap "Validate" or "Skip".
- Home > Training > My lists: personal lists, stored locally.
- Home > Race: a 60-second timed mode.
- Settings (gear icon): words per session, daily reminder, language, sound, ad
privacy, privacy policy, restore purchases.
- Settings > "TypeKana Premium": the paywall. The free version allows 5 sessions
a day and 3 lists, with ads. The auto-renewing subscription (monthly or yearly,
3-day free trial) removes the ads and both limits.

4. EXTERNAL SERVICES

- Apple In-App Purchase / StoreKit: the subscription.
- RevenueCat: subscription management only (receipt validation, entitlement
status, restore). Anonymous purchase events tied to a random app user ID.
- Google AdMob: banner, interstitial and rewarded ads, non-personalized only,
maximum ad content rating G. Users in the EEA and the UK see Google's UMP
consent form on first launch, reopenable from Settings > "Ad privacy".

There is no backend, server, database, authentication service, analytics SDK,
data provider or AI service. All content is bundled in the app; the internet is
used only for ads and purchases.

5. REGIONAL DIFFERENCES

Features and content are identical in every region. Only two variations exist,
both imposed externally: the UMP consent form is shown in the EEA and the UK
only, and subscription prices follow App Store Connect price points per
storefront. The interface is available in French and English, follows the device
language, and can be changed in Settings.

6. REGULATED INDUSTRY OR THIRD-PARTY MATERIAL

Neither applies. All vocabulary, sentences and translations were written by me.
The app contains no official JLPT examination material and no publisher content:
"N5" to "N3" are descriptive difficulty labels only, and the app is not
affiliated with or endorsed by the Japan Foundation or JEES. It embeds no
third-party fonts. The two sound effects are short synthesized tones generated
programmatically for this app, not sampled from any third-party source.

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
