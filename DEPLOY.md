# Panduan Deploy Fintjam

## Stack
- **Backend**: Node.js + Express + PostgreSQL → Railway
- **Frontend**: Static HTML → Railway (atau Netlify/Vercel)
- **Gmail**: Google OAuth2 via Google Cloud Console

---

## Langkah 1 — Google Cloud Console (Gmail API)

1. Buka https://console.cloud.google.com
2. Buat project baru → nama: "Fintjam"
3. Menu: **APIs & Services → Enable APIs** → cari "Gmail API" → Enable
4. Menu: **APIs & Services → OAuth consent screen**
   - User Type: External
   - App name: Fintjam
   - Tambahkan email kamu sebagai Test user
5. Menu: **APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID**
   - Application type: Web application
   - Authorized redirect URIs: `https://YOUR-BACKEND.railway.app/api/gmail/callback`
   - Simpan **Client ID** dan **Client Secret**

---

## Langkah 2 — Deploy Backend ke Railway

1. Buka https://railway.app → Login dengan GitHub
2. **New Project → Deploy from GitHub repo** → pilih repo VIBECODEAI
3. Pilih folder `backend` sebagai root directory
4. Railway akan detect Node.js otomatis
5. Tambahkan **PostgreSQL** plugin: klik "+ New" → Database → PostgreSQL
6. Set **Environment Variables** di Railway:

```
DATABASE_URL        = (otomatis dari PostgreSQL plugin)
SESSION_SECRET      = (random string panjang, contoh: buat di https://randomkeygen.com)
GOOGLE_CLIENT_ID    = (dari langkah 1)
GOOGLE_CLIENT_SECRET= (dari langkah 1)
GOOGLE_REDIRECT_URI = https://YOUR-BACKEND.railway.app/api/gmail/callback
FRONTEND_URL        = https://YOUR-FRONTEND.railway.app
NODE_ENV            = production
```

7. Deploy → catat URL backend (contoh: `https://fintjam-backend.railway.app`)

---

## Langkah 3 — Deploy Frontend ke Railway

1. Di Railway project yang sama → **New Service → GitHub Repo**
2. Pilih folder `frontend` sebagai root
3. Set start command: `npx serve . -p $PORT`
   Atau pakai Nginx static: tambahkan file `frontend/nixpacks.toml`:
   ```toml
   [phases.build]
   cmds = []
   [start]
   cmd = "npx serve -s . -l $PORT"
   ```
4. Set Environment Variable:
   ```
   PORT = 3000
   ```
5. Deploy → catat URL frontend

---

## Langkah 4 — Update API URL di Frontend

Edit `frontend/assets/js/api.js` baris pertama:
```js
// Ganti '' dengan URL backend Railway kamu
const API_BASE = window.FINTJAM_API_URL || 'https://fintjam-backend.railway.app';
```

Atau set di setiap HTML file:
```html
<script>window.FINTJAM_API_URL = 'https://fintjam-backend.railway.app';</script>
```

---

## Langkah 5 — Update Google OAuth Redirect URI

Kembali ke Google Cloud Console → Credentials → edit OAuth Client:
- Tambahkan redirect URI: `https://YOUR-BACKEND.railway.app/api/gmail/callback`
- Tambahkan authorized origin: `https://YOUR-FRONTEND.railway.app`

---

## Selesai!

Akses frontend URL → daftar akun → atur limit → hubungkan Gmail di Settings → Sync!

### Catatan Gmail Sync
- Klik **Hubungkan Gmail** di halaman Setelan
- Login dengan akun Google yang menerima email notifikasi Krom Bank
- Klik **Sync Sekarang** untuk import transaksi 30 hari terakhir
- Transaksi dari Gmail akan ditandai badge "Gmail" di halaman Riwayat
- Sync bisa dilakukan kapan saja secara manual