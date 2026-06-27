# NurseNotes — Fiche technique

## 1. Objectif du projet

Prototype d'application pour infirmiers permettant de **dicter à voix haute** les transmissions de patients (au lieu de la double saisie papier/informatique), avec en bonus un assistant médicaments et un historique des transmissions.

**Important : ce n'est pas connecté à un vrai DPI (dossier patient informatisé).** Toutes les données (patients, collègues, historique, médicaments) sont fictives et stockées uniquement en mémoire côté navigateur (état React). Rien n'est envoyé à un serveur, rien n'est persisté : un rechargement de page réinitialise tout.

## 2. Stack technique

- **React + TypeScript + Vite**
- Aucun backend — état 100 % côté client (`useState`), données de démo dans `src/data/`
- **Reconnaissance vocale** : Web Speech API native du navigateur (pas d'IA propriétaire, rien n'est envoyé à un serveur externe) — fonctionne sur Chrome/Edge, se dégrade proprement (message d'erreur) sur les navigateurs non supportés
- **Style** : CSS inline (`style={{...}}`) partout, quelques classes utilitaires dans `src/index.css` pour les animations et le responsive mobile
- **Déploiement** : Vercel, via `vercel.json` à la racine (build dans le sous-dossier `app/`)
- **Dépôt** : GitHub `Jeevana1996/NurseNote`, branche `main`

## 3. Parcours utilisateur, écran par écran

### Connexion (`LoginScreen`)
Formulaire factice (champs pré-remplis, non vérifiés) — cliquer sur "Se connecter" fait toujours passer à l'écran suivant. Met en avant deux statistiques d'accroche ("93 % des infirmiers prêts à l'adopter", "~2 min gagnées par transmission").

### Sélection du service (`ServiceScreen`)
Grille de 4 services hospitaliers. Seul **Cardiologie** est déverrouillé et cliquable ; Maternité, Pédiatrie et Urgences sont grisés avec un cadenas (juste pour le décor de la démo).

### Patients du jour (`PatientsScreen`)
Liste des **8 patients fictifs** du service de Cardiologie (chambre, nom, âge, motif, statut "À faire" / "Transmis au DPI"), avec barre de progression. Cliquer sur un patient ouvre l'écran de transmission.

### Transmission (`TransmissionScreen`) — écran central
- Fiche patient : motif d'admission, antécédents, traitements en cours, constantes (TA, FC, SpO₂, O₂, diurèse), examens en attente, surveillance, et un champ commentaire libre.
- **Dictée vocale réelle** (Web Speech API, langue `fr-FR`) :
  - Mot de réveil : **« Ok connect »**
  - Une fois activée, dire le nom d'une rubrique ("antécédents", "traitements", "constantes", "examens", "surveillance") bascule la dictée dans le champ correspondant.
  - Transcription affichée en direct dans le panneau latéral (empilé sous les champs sur mobile).
  - Un brouillon est auto-sauvegardé (horodaté) dès qu'un champ est rempli.
  - Relecture : un bandeau affiche un taux de confiance (96 % ou 99 %) et surligne en terracotta un terme médical à vérifier (simulé via une liste de termes "à faible confiance" par patient).
- Bouton "Envoyer au dossier patient" → lance la simulation d'envoi DPI.

### Simulation d'envoi DPI (`DpiModal` + `useDpiSend`)
Modale en 3 étapes animées (enregistrement local → envoi DPI → notification équipe). En cas de succès : référence DPI générée + horodatage, le patient passe au statut "Transmis au DPI". Une case "Simuler une erreur DPI (démo)" dans la sidebar permet de déclencher un échec volontaire (message "connexion perdue") avec deux choix : "Conserver le brouillon" ou "Réessayer" — pour démontrer qu'aucune donnée n'est perdue en cas de coupure réseau.

### Historique (`HistoryScreen`)
- Onglet "Ce mois-ci" : 5 transmissions passées fictives.
- Onglet "Sur l'année" : nombre de transmissions par mois sur 12 mois (données fictives).

### Mes collègues (`ColleaguesScreen`)
Consultation **en lecture seule** des transmissions de 3 collègues fictifs. Sélectionner un collègue affiche la liste de ses patients (statut Stable / À surveiller / Sortie prévue) ; cliquer sur une ligne déplie le détail.

### Assistant médicaments (`MedicationAssistantPanel`)
Panneau latéral accessible depuis la sidebar. Recherche/sélection parmi 4 médicaments fictifs : posologie usuelle, voie d'administration, effets indésirables, points de surveillance. Mention explicite : "Informations générées par IA à titre indicatif. À vérifier dans le Vidal / protocole du service."

### Navigation
- Sidebar fixe sur desktop, **menu hamburger avec tiroir coulissant** sur mobile (< 880 px de large).
- Logo "NurseNotes" → retour à l'écran de sélection des services.
- Bouton déconnexion → retour à l'écran de connexion.

## 4. Ce qui est réel vs. simulé

| Réel | Simulé / fictif |
|---|---|
| Reconnaissance vocale (Web Speech API du navigateur) | Authentification (accepte n'importe quoi) |
| Logique de remplissage des champs par mots-clés vocaux | Tous les patients, collègues, historique, médicaments |
| Navigation, état de l'app, responsive mobile | L'envoi au "DPI" (juste un délai + une référence générée) |
| | Persistance des données (tout est perdu au rechargement) |

## 5. Architecture des fichiers clés

```
app/src/
  App.tsx                  → machine d'état des écrans (login → service → app)
  screens/                 → un fichier par écran
  components/               → composants partagés (Sidebar, FieldCard, DpiModal, etc.)
  hooks/useDictation.ts     → logique de reconnaissance vocale
  hooks/useDpiSend.ts       → simulation d'envoi DPI
  data/*.ts                 → toutes les données fictives (patients, médicaments, collègues, historique, services)
  index.css                 → animations + media queries responsive (mobile < 880px)
vercel.json                 → config de build Vercel (monorepo, build dans app/)
```

## 6. Pistes de fonctionnalités supplémentaires (par ordre de priorité suggéré)

1. **Macrocibles / microcibles** — restructurer le modèle de transmission autour de la méthodologie "transmissions ciblées" (CIBLE / DONNÉES / INTERVENTIONS / RÉSULTATS) et du découpage MTVED (Maladie / Traitements / Vécu / Environnement / Développement) enseignée en IFSI, pour que l'app colle au vocabulaire métier réel des soignants. *(Déjà évoqué — en attente de votre confirmation pour l'implémenter.)*
2. **Persistance réelle** — aujourd'hui tout est perdu au rechargement (pas de backend, pas de base de données). Un usage réel demanderait au minimum un stockage (type Supabase/Firebase), voire une vraie intégration DPI.
3. **Authentification réelle**.
4. **Export PDF / impression** d'une transmission pour une relève papier.
5. **Recherche / filtre** sur l'écran Patients (par chambre, statut, motif).
6. **Notifications réelles** à l'équipe suivante (aujourd'hui juste une étape simulée dans la modale DPI).
7. **Mode sombre** pour les gardes de nuit.
8. **Historique lié aux vrais patients** de l'app (aujourd'hui ce sont des données globales déconnectées des 8 patients de démo).
