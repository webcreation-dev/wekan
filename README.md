# Wekan

Wekan est une application de mise en relation entre clients et prestataires de services à domicile au Bénin. Le parcours client couvre la connexion, le catalogue de services, la planification, le paiement, le suivi d'un prestataire, les rendez-vous et la messagerie. Une interface d'administration est aussi disponible à `/admin`.

## Lancer le projet

```bash
npm ci
cp .env.example .env.local
npm run dev
```

L'application est alors disponible sur `http://127.0.0.1:3000`.

## Vérifier une version de production

```bash
npm run build
npm run start
```

## Configuration

Par défaut, Wekan fonctionne en mode démo avec des données locales :

```env
NEXT_PUBLIC_USE_MOCK=true
```

Pour connecter une API réelle, renseigner l'URL et désactiver le mode démo :

```env
NEXT_PUBLIC_USE_MOCK=false
NEXT_PUBLIC_API_URL=https://api.example.com/v1
```

## État de déploiement

Le front peut être déployé dès maintenant comme démonstration interactive. Les réservations créées dans ce mode restent uniquement en mémoire pendant la session du navigateur.

Avant une mise en production destinée à de vrais utilisateurs, il faut intégrer :

- une API avec base de données pour les comptes, services, rendez-vous, messages et factures ;
- une authentification côté serveur avec des sessions ou jetons sécurisés ;
- un prestataire de paiement réel pour MTN MoMo, Flooz, Celtiis et les cartes ;
- une protection serveur de la route `/admin` (les identifiants de démonstration ne doivent jamais être utilisés en production) ;
- des services de cartographie et de notifications adaptés aux volumes réels.

## Hygiène Git

Le projet contient actuellement des dépendances et fichiers `.next` déjà suivis par Git. Le fichier `.gitignore` empêche d'en ajouter de nouveaux. Avant le premier commit de déploiement, il faudra retirer ces fichiers de l'index Git sans les supprimer du disque, puis valider un commit propre.
