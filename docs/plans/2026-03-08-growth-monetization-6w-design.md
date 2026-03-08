# MacroTrackr — Design P1/P2 (6 semaines)

## Contexte
P0 est quasi finalisé (6/7), avec un dernier item restant: **Fast AI correction**.
Objectif validé: **croissance d’abord**, puis monétisation.
Horizon validé: **6 semaines**.

## Objectifs business
- Maximiser l’activation initiale et la rétention court terme avant d’intensifier la monétisation.
- Utiliser les 4 premières semaines pour créer un moteur de croissance fiable.
- Introduire ensuite une monétisation progressive qui ne casse pas l’adoption.

## Approches considérées

### Option A — Acquisition pure
Pousser ads/referral/SEO immédiatement.
- Avantages: volume rapide
- Inconvénients: risque de churn si l’activation n’est pas assez robuste

### Option B — Activation + rétention d’abord (**recommandée**)
Optimiser le “aha moment”, puis scaler l’acquisition.
- Avantages: meilleure conversion du trafic en usage réel
- Inconvénients: volume brut potentiellement plus lent au démarrage

### Option C — Mix équilibré
Petites optimisations produit et acquisition en parallèle.
- Avantages: stabilité
- Inconvénients: exécution plus diffuse, priorités moins nettes

## Décision
**Choix retenu: Option B.**

Rationale:
1. MacroTrackr a déjà une base P0 forte orientée usage/rétention.
2. Optimiser l’activation avant scale augmente le ROI de chaque canal acquisition.
3. La monétisation devient plus efficace avec une cohorte engagée.

## Architecture produit (6 semaines)

### P1 — Growth Engine (Semaines 1 à 4)
Objectif: améliorer activation, rétention, et boucle organique.

- **S1**
  - Finaliser Fast AI correction (fermeture P0)
  - Instrumentation funnel: visit → signup → first meal → D1/D7
  - Dashboard KPI hebdo

- **S2**
  - Onboarding v2 orienté “premier succès < 3 min”
  - Templates repas 1-tap basés profil
  - Nudges reminders améliorés (timing + wording)

- **S3**
  - Referral simple “invite 1 ami”
  - Share card progression (social/organic)
  - A/B test landing (headline + CTA)

- **S4**
  - Feedback in-app (NPS + motifs de churn)
  - Iterations reminders/onboarding pilotées data
  - SEO léger (use-cases pages + metadata)

### P2 — Monetization Prep (Semaines 5 à 6)
Objectif: lancer une monétisation progressive et mesurable.

- **S5**
  - Définir paywall soft
  - Packaging 2 offres: mensuel / annuel
  - Feature gating clair free vs pro

- **S6**
  - A/B test pricing (prix + copy)
  - Trial 7 jours (ou garantie)
  - Mesure conversion trial→paid + early paid churn

## Data flow / instrumentation
- Événements clés:
  - `signup_completed`
  - `first_meal_logged`
  - `day2_active`
  - `day7_active`
  - `referral_sent`, `referral_accepted`
  - `paywall_viewed`, `trial_started`, `trial_converted`, `subscription_started`
- Dashboard par cohorte hebdo (source acquisition, activation, D1/D7, conversion paid).

## Gestion des risques
- **Risque 1: acquisition trop tôt** → mitigation: gate d’acquisition forte après amélioration activation.
- **Risque 2: paywall trop agressif** → mitigation: paywall soft + A/B + trial.
- **Risque 3: dette analytics** → mitigation: instrumentation S1 prioritaire.

## KPIs cibles
### Fin P1
- +25–35% activation first meal
- +15–20% D7
- hausse du trafic organique/referral

### Fin P2
- 2–5% conversion free→paid (initiale)
- ARPU en hausse sans chute d’activation
- churn paid semaine 1 sous contrôle

## Scope non inclus
- Expansion internationale
- Programme SEO massif
- Plans enterprise/B2B

## Validation
Design validé en conversation avec Axel/Anakin Bumblebee (orientation croissance, horizon 6 semaines).