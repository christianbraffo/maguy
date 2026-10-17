# Maguy – boutique de boissons glacées

Site e-commerce (Next.js + Tailwind CSS) pour la cave Maguy : catalogue, panier, commande (livraison ou retrait, paiement à la réception) et espace admin.

## Lancer

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production
```

## Espace admin

- URL : `/admin`
- Mot de passe par défaut : `maguy2026` → **à changer** dans `.env.local` (`ADMIN_PASSWORD`, et mets une longue valeur aléatoire dans `ADMIN_SECRET`).
- Tableau de bord, commandes (statuts, annulation = stock remis), produits (prix, formats, stocks, photo, visibilité), paramètres (WhatsApp, horaires, zones de livraison, frais, bandeau).

## Données

Stockées en JSON dans `data/` (`products.json`, `orders.json`, `settings.json`). Les photos envoyées depuis l'admin vont dans `data/uploads/`.
Sauvegarde = copier le dossier `data/`.
Ce stockage convient à un serveur classique (VPS, `npm start`). Il ne convient pas à un hébergement « serverless » (Vercel…) : il faudrait alors passer à une vraie base de données.

## Photos produits

Mets des PNG détourés (fond transparent) dans `public/products/` et renseigne le chemin dans l'admin, ou envoie-les directement via la fiche produit de l'admin.
Sans photo, un visuel bouteille/canette coloré est généré automatiquement.

## À personnaliser avant la mise en ligne

1. Numéro WhatsApp, téléphone, adresse, horaires, zones et frais : `/admin/parametres`.
2. Vrais produits, prix et stocks : `/admin/produits`.
3. Mot de passe admin : `.env.local`.
4. `SITE_URL` dans `.env.local` (pour le sitemap).
