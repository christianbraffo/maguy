# Maguy – contexte projet

Site e-commerce d'une cave de boissons glacées à Abidjan (Côte d'Ivoire). Next.js 16 (App Router) + Tailwind CSS 4. Lire `node_modules/next/dist/docs/` avant d'utiliser une API Next (`params` est une Promise, `proxy` remplace `middleware`).

## Règles décidées avec l'utilisateur
- Répondre en français. Plan validé avant tout gros chantier.
- Pas de paiement en ligne : paiement à la livraison ou au retrait.
- Stack fixe : Next.js + Tailwind. Stockage JSON dans `data/` (pas de base externe).
- Design marketing fort : fond `#0b1220`, glacier `#22d3ee`, orange `#ff6b1a`, polices Anton + Poppins, héro parallax « T'AS SOIF ? ». Modèles d'inspiration dans `_refs/`.
- `cacheComponents` reste désactivé dans `next.config.ts`.

## Structure
- `app/` pages client (`/`, `/boissons`, `/boissons/[id]`, `/commande`, `/commande/confirmation/[id]`), admin (`/admin`, route group `(panel)`), `actions.ts` (commande), `admin/actions.ts`.
- `lib/` : `db.ts` (JSON + verrou), `auth.ts` (cookie HMAC), `cart.tsx`, `shop.ts`, `types.ts`.
- `components/` : Hero, ProductCard, CartDrawer, Header, etc.
- `data/` : `products.json`, `orders.json`, `settings.json`, `uploads/`.
- Admin : `/admin`, mot de passe dans `.env.local` (`ADMIN_PASSWORD`, défaut `maguy2026`, à changer).

## État (2026-10-17)
Tout le site client + admin est fait et testé en e2e. Données = exemples (WhatsApp bidon `2250700000000`).
Photos : Bock/Castel/Heineken/Coca/Guinness détourées dans `public/products/` (crédits CC dans le footer) ; autres produits = visuel SVG généré. `npm run build` OK, e2e PASS.
Reste : données réelles de l'utilisateur (WhatsApp, quartiers/frais, horaires, produits/prix, photos PNG détourées) et changer le mot de passe admin.
Hébergement : JSON = VPS/`npm start` seulement, pas Vercel.

La mémoire détaillée est aussi dans `~/.claude/projects/-Users-macbookairm1-Desktop-dossier-sans-titre-3/memory/`.
