# Streaks + Weekly Goal — Release QA Checklist

## Scope
- Events analytics attendus:
  - `streak_day_completed`
  - `weekly_goal_hit`
- Parcours critiques:
  - 7 jours consécutifs
  - jour manqué
  - suppression repas
  - backfill (ajout rétroactif)

## Préparation
- [ ] Migration DB appliquée:
  - `20260303080000_add_user_progress_and_weekly_target.sql`
  - `20260303112000_add_analytics_events.sql`
- [ ] Dataset test prêt (1 user QA)
- [ ] Timezone utilisateur définie (tester au moins `UTC` et un fuseau non-UTC)

## Scénarios fonctionnels

### 1) 7 jours consécutifs
- [ ] Créer 1+ meal par jour pendant 7 jours consécutifs
- [ ] Vérifier `current_streak = 7`
- [ ] Vérifier `best_streak >= 7`
- [ ] Vérifier `weekly_completed_days = 7` (ou valeur plafonnée selon cible)

### 2) Jour manqué
- [ ] Partir d’une séquence active
- [ ] Laisser un jour sans meal
- [ ] Vérifier reset/rupture du `current_streak`
- [ ] Vérifier que le `best_streak` reste inchangé

### 3) Suppression repas
- [ ] Supprimer un meal sur un jour qui validait la journée
- [ ] Vérifier recalcul des compteurs (`current_streak`, `weekly_completed_days`)
- [ ] Vérifier qu’aucun double comptage n’apparaît après retries

### 4) Backfill (ajout rétroactif)
- [ ] Ajouter un meal sur un jour passé manquant
- [ ] Vérifier recalcul cohérent du streak/best streak
- [ ] Vérifier impact hebdo selon la semaine ciblée

## Analytics
- [ ] Quand streak augmente, un event `streak_day_completed` est inséré
- [ ] Quand objectif hebdo atteint, un event `weekly_goal_hit` est inséré
- [ ] Rejouer la même action idempotente: pas de duplication abusive d’event
- [ ] Payload event cohérent (`current_streak`, `week_start_date`, `weekly_target`, etc.)

## UI
- [ ] `/today`: carte streak + weekly OK
- [ ] `/history`: résumé hebdo minimal OK
- [ ] États `loading`, `empty`, `error` visibles et propres

## Release gate
- [ ] `typecheck` passe
- [ ] `lint` passe
- [ ] `test` passe
- [ ] QA sign-off
