# App Review — réponse à « Guideline 2.1 - Information Needed »

Apple envoie ce questionnaire aux comptes développeurs récents. Ce n'est pas un
défaut de l'app : il faut fournir une vidéo de démonstration et six réponses.

Le texte ci-dessous se colle à **deux endroits** :
1. Centre de résolution, en réponse au message d'Apple.
2. App Store Connect → la version → **Informations de vérification de l'app** →
   champ **Remarques**, comme Apple le demande explicitement pour les prochaines
   soumissions.

Les deux champs sont limités à **4000 caractères, lien de la vidéo compris**.
Ce texte en fait 3769 hors lien, ce qui laisse largement la place. Avant
d'envoyer, remplacer le seul marqueur restant.

---

```
Hello,

Answers below, also added to the App Review Information Notes.

1. SCREEN RECORDING

[LIEN DE LA VIDEO]

Recorded on a physical iPhone 15 Pro running iOS 27.0. It begins with launching
the app and covers the tutorial, the keyboard setup, a themed session, a JLPT
session, Race mode, a personal list, and the paywall.

- Account registration, login and deletion: not applicable. The app has no
account system, no login and no server, and works offline right after install.
- User-generated content: personal word lists are stored locally on the user's
device only. Nothing is uploaded, shared or visible to any other user, so no
reporting or blocking mechanism applies.
- Paid features: shown in the recording. Settings > the "TypeKana Premium"
banner opens the paywall.

2. PURPOSE AND TARGET AUDIENCE

TypeKana is a typing trainer for the Japanese keyboard.

Problem: learners of Japanese are taught to READ hiragana and katakana, but
never to TYPE them. On iPhone, Japanese is typed with the flick ("Kana")
keyboard, where each key holds a whole kana row and the others are reached by
sliding. Even fluent readers stay slow when they have to write anything.

Audience: teenagers and adults learning Japanese, self-taught, in class or
preparing the JLPT.

Value: short repeatable drills, by theme and by JLPT level, that build typing
speed and muscle memory. It works offline and progress stays on the device.

3. SETUP AND MAIN FEATURES

No login, demo account or sample file is required. One setup step is needed,
because the app uses the iPhone's own Japanese keyboard, not a simulated one:

Settings > General > Keyboard > Keyboards > Add New Keyboard > Japanese, then
choose the "Kana" layout (not Romaji). In the app, tap the globe key at the
bottom left to switch to Japanese. The app's tutorial covers this on first
launch, and the recording shows it.

- Home > Training > By theme or By JLPT level: type each word's kana reading,
then tap "Validate" or "Skip".
- Home > Training > My lists: personal lists, stored locally.
- Home > Race: a 60-second timed mode.
- Settings (gear icon): session length, reminder, language, sound, ad privacy,
privacy policy, restore purchases.
- Settings > "TypeKana Premium": the paywall. Free: 5 sessions a day, 3 lists,
ads. The auto-renewing subscription (monthly or yearly, 3-day free trial)
removes the ads and both limits.

4. EXTERNAL SERVICES

- Apple In-App Purchase / StoreKit: the subscription.
- RevenueCat: subscription management only (receipt validation, entitlement
status, restore), with anonymous events tied to a random app user ID.
- Google AdMob: banner, interstitial and rewarded ads, non-personalized only,
maximum ad content rating G. Users in the EEA and the UK see Google's UMP
consent form on first launch, reopenable from Settings > "Ad privacy".

No backend, server, database, authentication service, analytics SDK, data
provider or AI service is used. All content is bundled in the app; the internet
serves only ads and purchases.

5. REGIONAL DIFFERENCES

Features and content are identical in every region. The only variations: the UMP
consent form appears in the EEA and the UK only, and prices follow App Store
Connect price points per storefront. The interface is French and English,
following the device language.

6. REGULATED INDUSTRY OR THIRD-PARTY MATERIAL

Neither applies. All vocabulary, sentences and translations were written by me.
There is no official JLPT material and no publisher content: "N5" to "N3" are
descriptive difficulty labels only, and the app is not affiliated with the Japan
Foundation or JEES. No third-party fonts are embedded. The two sound effects are
short synthesized tones generated programmatically for this app, not sampled
from any source.

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

---

## Second refus du 22 septembre 2026 — à ajouter aux Remarques

Apple a relevé cinq points. Un seul touchait au code (ATT). À ajouter au champ
Remarques et au Centre de résolution, en plus du texte ci-dessus :

```
App Tracking Transparency: the ATT permission request is presented at launch,
right after Google UMP consent form and before any ad is requested, which is the
order Google recommends. If the user declines, ads are requested as
non-personalized only. App Privacy has been updated accordingly.

Terms of Use (EULA): Apple standard EULA is linked at the end of the App
Description and from the Terms link in the subscription paywall.

Subscription details: the paywall shows the subscription name, its length, the
total billed amount as the most prominent price, and functional links to the
privacy policy and the Terms of Use, all before purchase.

The two auto-renewable subscriptions are submitted together with this version.
```

### Les cinq points et leur correction

| Point | Cause | Correction |
| --- | --- | --- |
| 2.3.10 Metadata | La description Google Play avait été collée dans App Store Connect (mentions Android et Play Store) | Reprendre la description de `ios-listing.md` |
| 3.1.2(c) EULA | Cette même description ne contenait pas le lien EULA | Idem, plus les liens du pied de paywall RevenueCat |
| 5.1.2(i) ATT | Le formulaire UMP parle de publicité personnalisée sans invite ATT | `expo-tracking-transparency`, invite après l'UMP et avant toute pub |
| 3.1.2(c) Prix | Le paywall met « $1.49 per month » en avant plutôt que « $17.99 » | Éditeur de paywall RevenueCat : rendre le montant facturé dominant |
| 2.1(b) Achats | Les abonnements n'étaient pas soumis avec la version | Les rattacher à la version et soumettre |

### Plan de la seconde vidéo (environ 90 secondes)

Deux exigences d'Apple : montrer où se trouve l'invite ATT (5.1.2(i)) et
prouver que les informations d'abonnement et leurs liens fonctionnent (3.1.2(c)).

Avant d'enregistrer :
- Installer le build qui contient l'ATT, puis **supprimer l'app et la
  réinstaller** : la réponse à l'invite est mémorisée et elle ne réapparaît pas.
- Réglages iOS → Confidentialité et sécurité → Suivi → **« Autoriser les apps à
  demander le suivi » doit être activé**, sinon iOS n'affiche jamais l'invite.
- App en anglais, mode Concentration activé.

1. Lancement depuis l'écran d'accueil de l'iPhone.
2. Formulaire de consentement Google, puis **l'invite ATT**. Toucher Allow.
3. Réglages → bannière TypeKana Premium → le paywall.
4. Laisser le paywall visible quelques secondes : noms des abonnements, durées,
   et le **montant facturé** désormais le plus en évidence.
5. Toucher **Terms**, montrer que la page s'ouvre, revenir.
6. Toucher **Privacy**, montrer que la page s'ouvre, revenir.
7. Facultatif : 15 secondes d'exercice pour montrer que l'app fonctionne.

---

## Version consolidée du 23 septembre 2026 — à utiliser maintenant

Remplace les deux pavés précédents. Elle couvre les deux refus, porte **les deux
liens vidéo** et fait 2817 caractères, soit environ 2950 avec les liens : large
marge sous la limite de 4000. À coller dans les Remarques et dans le Centre de
résolution.

```
Hello,

Updated notes for this resubmission.

1. SCREEN RECORDINGS (physical iPhone 15 Pro, iOS 27.0)

Full walkthrough of the app: [LIEN VIDEO 1]
ATT prompt, subscription details and working Terms/Privacy links: [LIEN VIDEO 2]

2. APP TRACKING TRANSPARENCY (5.1.2)

The ATT permission request is presented at launch, right after Google UMP
consent form and before any ad is requested, which is the order Google
recommends. Declining keeps ads non-personalized. App Privacy has been updated
to disclose tracking.

3. SUBSCRIPTIONS (3.1.2c)

The paywall shows each subscription name, its length, and the total billed
amount as the most prominent price, with working links to the privacy policy
and to Apple standard Terms of Use (EULA). The EULA is also linked at the end
of the App Description. Both auto-renewable subscriptions are submitted with
this version.

4. METADATA (2.3.10)

The App Description no longer mentions Android or Google Play.

5. PURPOSE AND AUDIENCE

TypeKana is a typing trainer for the Japanese keyboard. Learners are taught to
READ hiragana and katakana but never to TYPE them, which on iPhone means the
flick ("Kana") keyboard. Audience: teenagers and adults learning Japanese or
preparing the JLPT.

6. SETUP AND MAIN FEATURES

No login, demo account or sample file is required. The app uses the iPhone's
own Japanese keyboard, so it has to be added first:

Settings > General > Keyboard > Keyboards > Add New Keyboard > Japanese, then
the "Kana" layout (not Romaji). In the app, tap the globe key at the bottom
left to switch to Japanese. The app's tutorial covers this on first launch.

Home > Training > By theme or By JLPT level: type the word's kana reading, then
tap "Validate" or "Skip". My lists: personal lists, stored locally. Race: a
60-second timed mode. Settings (gear icon): daily reminder, language, sound, ad
privacy, privacy policy, restore purchases, and the Premium paywall. Free
version: 5 sessions a day and 3 lists, with ads.

7. EXTERNAL SERVICES

Apple In-App Purchase / StoreKit. RevenueCat, for subscription management only.
Google AdMob: banner, interstitial and rewarded ads, maximum ad content rating
G, with Google UMP consent form in the EEA and the UK, reopenable from Settings
> "Ad privacy". There is no backend, server, database, analytics SDK, data
provider or AI service; all content is bundled in the app.

8. OTHER POINTS

No account system, so no registration, login or account deletion. Personal word
lists are stored locally only, never uploaded or shared, so no reporting or
blocking mechanism applies. Features and content are identical in every region.
All vocabulary and translations are original: no official JLPT material, no
third-party fonts, and the two sound effects are synthesized tones generated
for this app.

Best regards,
Guillaume
```
