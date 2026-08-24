# 🚀 Guide de Déploiement - Job Board

Ce document explique comment déployer votre Job Board sur Vercel avec Supabase comme base de données.

## ✅ Prérequis

1. Un compte [Supabase](https://supabase.com) avec une base de données PostgreSQL créée
2. Un compte [Vercel](https://vercel.com)
3. Un compte GitHub avec le code du projet pushé
4. (Optionnel) Un nom de domaine personnalisé

---

## 📋 Étape 1: Configuration de Supabase

### 1.1 Récupérer l'URL de connexion

Dans votre tableau de bord Supabase :

1. Allez dans **Settings** → **Database**
2. Cliquez sur **Connection Pooler** (ou **Connection String**)
3. Copiez l'URL de connexion en mode **Transaction** (port 6543)

L'URL doit ressembler à :
```
postgresql://postgres.xxx:YOUR_PASSWORD@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

⚠️ **Important** : 
- Utilisez le port **6543** (Pooler) et non 5432 (Direct)
- Ajoutez `?pgbouncer=true&connection_limit=1` à la fin si ce n'est pas déjà fait
- Si votre mot de passe contient des caractères spéciaux (`@`, `#`, etc.), encodez-les en URL (%40 pour @, %23 pour #)

### 1.2 Appliquer les migrations et seed

**Option A: Via le script automatique (Recommandé)**

Ouvrez un terminal sur votre machine locale :

```bash
# Clonez le repo si ce n'est pas déjà fait
git clone <votre-repo>
cd job-board

# Installez les dépendances
npm install

# Définissez la variable d'environnement
export DATABASE_URL="votre-url-supabase-ici"

# Exécutez le script de setup
./scripts/setup-supabase.sh
```

**Option B: Manuellement**

```bash
# Générer Prisma Client
npx prisma generate

# Appliquer les migrations
npx prisma migrate deploy

# Seeder la base de données
npx prisma db seed
```

**Option C: Via SQL direct (Si les autres échouent)**

1. Allez dans Supabase → **SQL Editor**
2. Copiez le contenu de `prisma/manual-seed.sql`
3. Exécutez-le dans l'éditeur SQL

---

## 📋 Étape 2: Déploiement sur Vercel

### 2.1 Pousser le code sur GitHub

```bash
git add .
git commit -m "Prep for Vercel deployment with Supabase"
git push origin main
```

### 2.2 Créer le projet sur Vercel

1. Connectez-vous à [Vercel](https://vercel.com)
2. Cliquez sur **Add New Project**
3. Sélectionnez votre repository GitHub
4. Avant de déployer, cliquez sur **Environment Variables**

### 2.3 Ajouter les variables d'environnement

Ajoutez les variables suivantes :

| Variable | Valeur |
|----------|--------|
| `DATABASE_URL` | Votre URL Supabase (port 6543) |
| `ADMIN_SECRET` | `f7d877e47fd78c0a5ddba88a65eccbde4f8e892c4fdddb4927bf14a3250a484a` |
| `ADMIN_PASSWORD_HASH` | `194d2b6aec89bd2a9efd03835c5137d7:51763c2c4513d5d509f53bfeb56430aaee44d5c8e764c8c4ccdf6437bef8a7a191860a6d5388dc3223c54f4f0841ddb4c6802076ba0c2e7d12a0832d689c0f98` |
| `NEXT_PUBLIC_SITE_URL` | `https://votre-projet.vercel.app` (sera mis à jour après déploiement) |
| `OPENROUTER_API_KEY` | (Optionnel) Votre clé API OpenRouter pour l'import AI |

### 2.4 Déployer

Cliquez sur **Deploy** et attendez la fin du processus (~2-3 minutes).

---

## 📋 Étape 3: Vérification

Après le déploiement :

1. **Testez le site public** : `https://votre-projet.vercel.app`
   - Vérifiez que les emplois s'affichent
   - Testez la recherche et les filtres
   - Vérifiez les pages de détails

2. **Testez l'admin** : `https://votre-projet.vercel.app/admin`
   - Connectez-vous avec :
     - Email : `admin@jobboard.tn`
     - Mot de passe : `admin123`
   - Créez/modifiez un emploi test

3. **Vérifiez les logs** :
   - Allez dans Vercel → Votre projet → **Deployment** → **View Logs**
   - Cherchez d'éventuelles erreurs

---

## 📋 Étape 4: Nom de domaine personnalisé (Optionnel)

### 4.1 Acheter un domaine

Achetez votre domaine chez un registrar (Namecheap, GoDaddy, Google Domains, etc.)

### 4.2 Configurer DNS

Dans les paramètres DNS de votre registrar, ajoutez :

| Type | Nom | Valeur |
|------|-----|--------|
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

### 4.3 Ajouter le domaine sur Vercel

1. Allez dans Vercel → Votre projet → **Settings** → **Domains**
2. Ajoutez votre domaine (ex: `monjobboard.tn`)
3. Ajoutez également `www.monjobboard.tn`
4. Attendez la validation DNS (peut prendre jusqu'à 48h, souvent ~5min)

### 4.4 Mettre à jour SITE_URL

Dans Vercel → **Settings** → **Environment Variables** :
- Mettez à jour `NEXT_PUBLIC_SITE_URL` avec votre nouveau domaine
- Redéployez le projet

---

## 🔧 Dépannage

### Erreur: "Can't connect to database"

- Vérifiez que `DATABASE_URL` utilise le port **6543** (pas 5432)
- Vérifiez que `?pgbouncer=true` est présent dans l'URL
- Vérifiez que le mot de passe est correctement encodé

### Erreur: "Relation 'Job' does not exist"

Les migrations n'ont pas été appliquées. Exécutez :
```bash
npx prisma migrate deploy
```

### Build failed sur Vercel

- Vérifiez les logs de build dans Vercel
- Assurez-vous que toutes les variables d'environnement sont définies
- Essayez un redeploy manuel

---

## 🎉 C'est terminé !

Votre Job Board est maintenant en ligne et accessible au public.

**Prochaines étapes recommandées :**
- Configurer Google Analytics
- Soumettre le sitemap à Google Search Console
- Activer les sauvegardes automatiques sur Supabase
- Configurer des alertes de monitoring

Bon lancement ! 🚀
