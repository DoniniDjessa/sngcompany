# SNG Company

Site vitrine + espace de gestion de SNG Company : location de véhicules, transport & logistique,
location d'équipements, lavage de véhicules et élevage. Next.js 16 · React 19 · CSS (sans framework).

## Lancer

```bash
npm install
npm run dev        # http://localhost:3000
```

- Site public : `/`, `/services/[slug]`, `/devis`
- Gestion : `/gestion` (comptes Supabase listés dans la table `sng-staff`)

## Mise en place (une fois)

Le projet Supabase est partagé avec d'autres applications : toutes les tables SNG sont préfixées `sng-`.

1. Supabase › SQL Editor : coller et exécuter `supabase/schema.sql` (ré-exécutable sans risque).
2. Créer le premier administrateur :
   `npm run staff:create -- admin@exemple.ci "MotDePasse" "Nom Prénom"`
   (les autres membres s'ajoutent ensuite dans Gestion › Paramètres › Équipe).
3. Autoriser l'upload navigateur vers R2 depuis le domaine de production :
   `npm run r2:cors -- https://www.domaine-de-production.ci`

## Organisation

| Dossier | Rôle |
| --- | --- |
| `src/lib/site.ts` | Identité de l'entreprise (nom, téléphones, e-mail, horaires, lien SNG Elite Cars) |
| `src/lib/services.ts` | Les 5 activités : textes, offres, FAQ (une entrée = une page `/services/...`) |
| `src/lib/gestion/resources.tsx` | Les modules de gestion décrits en données : colonnes, filtres, formulaires, KPI |
| `src/lib/store.ts` | Lecture / écriture des tables `sng-*` (cache partagé entre les pages) |
| `src/lib/server/` | Côté serveur uniquement : client Supabase service role, signature R2 |
| `src/app/api/storage` | Upload (URL signée) et lecture des fichiers R2 : `photos/` publiques, `documents/` réservés à l'équipe |
| `src/app/(site)` | Pages publiques (style APEM-CI) |
| `src/app/gestion` | Backoffice (mise en page IMO, couleurs APEM-CI) — styles dans `gestion.css` |

Ajouter un module de gestion = une table `sng-…` dans `schema.sql`, une entrée dans `TABLES` (`store.ts`)
et dans `RESOURCES` (`resources.tsx`), une ligne dans `nav.ts`.

## Sécurité

- Le site public ne lit aucune table : le formulaire de devis appelle la fonction `sng_submit_demande()`.
- Le backoffice n'est accessible qu'aux comptes présents dans `sng-staff` (RLS sur toutes les tables).
- `SUPABASE_SERVICE_ROLE_KEY` et les clés R2 ne servent que dans `src/lib/server` (jamais `NEXT_PUBLIC_`).

## Reste à valider

Tarifs indicatifs et chiffres clés (`services.ts`, page d'accueil) et l'URL `carsSiteUrl`.
