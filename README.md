# iNet Ventures - Site Inventory

Standalone site inventory management system for staff and admin users.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment
```bash
cp .env.example .env
# Edit .env with your actual credentials
```

### 3. Set Up Database
```bash
npm run db:generate
npm run db:push
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Main inventory page
│   ├── globals.css             # Global styles
│   └── api/
│       └── sites/              # API endpoints
├── components/
│   ├── ui/                     # Reusable UI components
│   └── site-inventory/         # Site inventory specific components
├── lib/
│   ├── db.ts                   # Database client
│   └── utils.ts                # Utility functions
├── prisma/
│   └── schema.prisma           # Database schema
└── scripts/
    └── import-csv.ts           # CSV import script
```

---

## 🔑 Features

- ✅ Site inventory management
- ✅ Contact tracking (multiple emails & contacts)
- ✅ Search and filtering
- ✅ SEO metrics (Ahrefs DR, Moz DA)
- ✅ iGaming acceptance tracking
- ✅ Notes and history
- ✅ CSV import/export
- ✅ Staff/Admin authentication

---

## 🗄️ Database

Uses **Neon PostgreSQL** database.

Connection string in `.env`:
```
DATABASE_URL="postgresql://..."
```

---

## 🔐 Authentication

Uses **Better Auth** with Supabase.

Only **staff** and **admin** users can access the inventory.

---

## 📦 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Point inventory.yourdomain.com to this project
```

---

## 🛠️ Development

### Database Commands

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Open Prisma Studio
npm run db:studio
```

### Import Data

```bash
# Import from CSV
npx tsx scripts/import-csv.ts
```

---

## 📝 Next Steps

I'm creating the remaining files now. You'll need:

1. ✅ Configuration files (DONE)
2. ✅ Database schema (DONE)
3. ⏳ App pages and layouts (IN PROGRESS)
4. ⏳ UI components (IN PROGRESS)
5. ⏳ API routes (IN PROGRESS)

Check back in a few minutes - I'm building everything! 🚀
