# Wekan

Wekan est une application de mise en relation entre clients et prestataires de services à domicile au Bénin. Le parcours client couvre la connexion, le catalogue de services, la planification, le paiement, le suivi d'un prestataire, les rendez-vous et la messagerie. Une interface d'administration est aussi disponible à `/admin`.

## Lancer le projet

```bash
npm ci                 # installe aussi le client Prisma
cp .env.example .env   # puis changer AGENT_PASSWORD
npm run db:migrate     # crée la base SQLite (prisma/dev.db)
npm run db:seed        # crée le compte agent (AGENT_PHONE / AGENT_PASSWORD)
npm run dev
```

L'application est alors disponible sur `http://localhost:3000`.

## Backend

Le backend est intégré à Next.js (`src/app/api`), avec Prisma et SQLite.

- **Comptes** : inscription et connexion par numéro + mot de passe (haché avec scrypt), session par cookie httpOnly.
- **Demandes** : une demande = une conversation. Les vocaux et messages saisis à la création deviennent les premiers messages.
- **Vocaux** : envoyés via `POST /api/voices`, stockés dans Vercel Blob (store privé) si `BLOB_STORE_ID` ou `BLOB_READ_WRITE_TOKEN` est défini, sinon dans `storage/voices`, lisibles uniquement par leur auteur, le client de la demande et les agents.
- **Lieux enregistrés** : par utilisateur.

### Routes

| Méthode | Route | Rôle |
|---|---|---|
| POST | `/api/auth/register`, `/api/auth/login`, `/api/auth/logout` | Comptes |
| GET | `/api/auth/me` | Session courante |
| GET / POST | `/api/requests` | Mes demandes / créer une demande |
| GET | `/api/requests/:id` | Une demande et sa conversation |
| POST | `/api/requests/:id/messages`, `/api/requests/:id/read` | Écrire, marquer comme lu |
| POST / GET | `/api/voices`, `/api/voices/:id` | Envoyer / écouter un vocal |
| GET / POST / DELETE | `/api/places`, `/api/places/:id` | Lieux enregistrés |
| POST | `/api/requests/:id/payments` | Payer une avance (ou le solde) : `{ amount, operator, msisdn }` |
| GET | `/api/payments/:id` | État d'un paiement (interrogé pendant la validation) |
| GET | `/api/agent/requests` | Agent : toutes les demandes (`?status=awaiting_call`) |
| PATCH | `/api/agent/requests/:id` | Agent : fixer date, heure, prix, prestataire, statut |
| POST | `/api/agent/requests/:id/messages`, `/api/agent/requests/:id/read` | Agent : répondre, marquer comme lu |

`npm run db:studio` ouvre une interface pour consulter la base.

## Avant la production

- Passer à PostgreSQL : `provider = "postgresql"` dans `prisma/schema.prisma` et `DATABASE_URL` vers la base, puis `npm run db:deploy`.
- Sur Vercel, créer un store Blob **privé** (Storage → Blob) et le relier au projet : `BLOB_STORE_ID` est alors ajouté automatiquement et les vocaux y sont stockés.
- Brancher l'interface `/admin` sur les routes agent (elle utilise encore des données de démonstration).
- Prestataire de paiement réel : implémenter `initiate` et `check` dans `src/lib/server/payment-provider.ts` (FedaPay, Kkiapay, MTN MoMo…) et définir `PAYMENT_PROVIDER`. En mode `simulation`, aucun argent ne bouge.

## Hygiène Git

Le projet contient actuellement des dépendances et fichiers `.next` déjà suivis par Git. Le fichier `.gitignore` empêche d'en ajouter de nouveaux. Avant le premier commit de déploiement, il faudra retirer ces fichiers de l'index Git sans les supprimer du disque, puis valider un commit propre.

## Déploiement sur Vercel

La base reste SQLite : en ligne, elle est hébergée chez [Turso](https://turso.tech).

Variables à définir dans Vercel (Settings → Environment Variables) :

| Variable | Valeur |
|---|---|
| `TURSO_DATABASE_URL` | `libsql://….turso.io` |
| `TURSO_AUTH_TOKEN` | jeton créé dans Turso |
| `AGENT_PHONE` / `AGENT_PASSWORD` | compte agent (créé ou mis à jour à chaque déploiement) |
| `PAYMENT_PROVIDER` | `simulation` |

Le store Vercel Blob (privé) relié au projet ajoute `BLOB_STORE_ID` pour les vocaux.

À chaque déploiement, `vercel-build` applique les migrations sur Turso (`prisma/turso-migrate.mjs`),
crée le compte agent, puis construit l'appli. Pour appliquer les migrations à la main :
`npm run db:turso` avec `TURSO_DATABASE_URL` et `TURSO_AUTH_TOKEN` dans `.env`.
