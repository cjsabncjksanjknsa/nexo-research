# Nexo Research by Kyledoops

Interactive yield and credit line calculator for Nexo — covering BTC, ETH and USDT across all Wealth Club tiers.

## Deploy to Vercel (5 minutes)

### Step 1 — Push to GitHub

1. Go to [github.com](https://github.com) and create a new repository called `nexo-research`
2. Make it **Public**
3. Run these commands in your terminal from this folder:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/nexo-research.git
git push -u origin main
```

### Step 2 — Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign up / log in with your GitHub account
2. Click **"Add New Project"**
3. Import your `nexo-research` repository
4. Vercel will auto-detect Vite — just click **"Deploy"**
5. Done. Your site is live at `nexo-research.vercel.app`

### Step 3 — Custom domain (optional)

If you want `nexo.kyledoops.com` or similar:

1. In Vercel, go to your project → **Settings** → **Domains**
2. Add your custom domain
3. Follow the DNS instructions (add a CNAME record pointing to `cname.vercel-dns.com`)
4. Takes ~5 minutes to go live

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)
