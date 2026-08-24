# ✅ Checklist de Déploiement - Job Board

## 📋 Ce qui a été fait automatiquement

- [x] Fichier `.env.local` mis à jour avec l'URL Supabase (port 6543)
- [x] Prisma Client généré (`npx prisma generate`)
- [x] Script de setup créé (`scripts/setup-supabase.sh`)
- [x] Fichier SQL seed manuel créé (`prisma/manual-seed.sql`)
- [x] Guide de déploiement complet (`README-DEPLOYMENT.md`)
- [x] Liste des variables Vercel (`VERCEL_ENV_VARS.txt`)

---

## 🔧 À faire MANUELLEMENT sur votre machine locale

### Étape 1: Appliquer les migrations sur Supabase

Ouvrez un terminal **sur votre ordinateur** et exécutez :

```bash
# Allez dans le dossier du projet
cd /chemin/vers/votre/projet

# Exportez la variable DATABASE_URL
export DATABASE_URL="postgresql://postgres.mkrtkssypeqjauftaxzt:12345678AAZZHK%40%40@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Option A: Utiliser le script automatique
./scripts/setup-supabase.sh

# OU Option B: Commandes manuelles
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
```

⚠️ **Si vous avez une erreur de connexion**, essayez le fichier SQL manuel :
1. Ouvrez Supabase Dashboard → SQL Editor
2. Copiez le contenu de `prisma/manual-seed.sql`
3. Exécutez-le dans l'éditeur

---

## 🚀 À faire sur GitHub

### Étape 2: Pousser le code

```bash
git add .
git commit -m "Prepare for Vercel deployment with Supabase integration"
git push origin main
```

---

## 🌐 À faire sur Vercel

### Étape 3: Créer/configurer le projet Vercel

1. Allez sur https://vercel.com
2. Cliquez sur **Add New Project**
3. Sélectionnez votre repository GitHub
4. **Avant de déployer**, cliquez sur **Environment Variables**
5. Ajoutez les variables suivantes :

| Variable | Valeur |
|----------|--------|
| `DATABASE_URL` | `postgresql://postgres.mkrtkssypeqjauftaxzt:12345678AAZZHK%40%40@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1` |
| `ADMIN_SECRET` | `f7d877e47fd78c0a5ddba88a65eccbde4f8e892c4fdddb4927bf14a3250a484a` |
| `ADMIN_PASSWORD_HASH` | `194d2b6aec89bd2a9efd03835c5137d7:51763c2c4513d5d509f53bfeb56430aaee44d5c8e764c8c4ccdf6437bef8a7a191860a6d5388dc3223c54f4f0841ddb4c6802076ba0c2e7d12a0832d689c0f98` |
| `NEXT_PUBLIC_SITE_URL` | (laissez vide pour l'instant, sera mis après déploiement) |

6. Cliquez sur **Deploy**

---

## ✅ Après le premier déploiement

### Étape 4: Vérifier et mettre à jour

1. Notez l'URL de votre projet (ex: `job-board-xyz.vercel.app`)
2. Retournez dans **Environment Variables** sur Vercel
3. Mettez à jour `NEXT_PUBLIC_SITE_URL` avec cette URL
4. Cliquez sur **Redeploy** pour appliquer le changement

### Étape 5: Tester

- Site public : `https://votre-projet.vercel.app`
- Admin panel : `https://votre-projet.vercel.app/admin`
  - Email : `admin@jobboard.tn`
  - Password : `admin123`

---

## 🎁 Bonus: Nom de domaine personnalisé

### Acheter un domaine
- Namecheap, GoDaddy, Google Domains, etc.

### Configurer DNS chez votre registrar
```
Type: A    Name: @    Value: 76.76.21.21
Type: CNAME Name: www Value: cname.vercel-dns.com
```

### Ajouter le domaine sur Vercel
1. Vercel → Votre projet → Settings → Domains
2. Ajoutez `votredomaine.com` et `www.votredomaine.com`
3. Attendez la validation DNS

### Mettre à jour SITE_URL
- Vercel → Settings → Environment Variables
- Changez `NEXT_PUBLIC_SITE_URL` vers `https://votredomaine.com`
- Redeploy

---

## 🆘 En cas de problème

| Problème | Solution |
|----------|----------|
| Erreur de connexion DB | Vérifiez que le port est 6543 et que `?pgbouncer=true` est présent |
| Tables vides | Exécutez `npx prisma migrate deploy` puis `npx prisma db seed` |
| Build failed | Vérifiez les logs Vercel et les variables d'environnement |
| Page blanche | Vérifiez la console navigateur et les logs Vercel |

---

## 📞 Besoin d'aide ?

1. Consultez `README-DEPLOYMENT.md` pour plus de détails
2. Vérifiez les logs Vercel : Deployment → View Logs
3. Testez en local avec la même DATABASE_URL

**Bon déploiement ! 🚀**
