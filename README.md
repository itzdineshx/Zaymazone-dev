# Zaymazone

![Zaymazone Logo](public/logo.png)

Zaymazone is a **modern artisan e-commerce platform** connecting buyers with local artisans, empowering creators to showcase and sell their handcrafted products online.  
The project focuses on **cultural authenticity**, **user-friendly design**, and **seamless shopping and selling experiences**.

---

## 🌟 Features

### For Shoppers:
- Browse **handcrafted collections** (pottery, textiles, toys, etc.)
- **Filter & sort products** by category, price, material, and region
- **View artisan profiles** with bios, stories, and product galleries
- **Quick-view and hover previews** for products
- Smooth **cart and checkout** flow with COD, UPI, and Razorpay support

### For Artisans:
- **Easy seller onboarding** with ID/bank verification
- **Upload and manage products** from a personal dashboard
- Track **sales, orders, reviews, and payments**
- Personal **profile page** to share their story and products

### General:
- Fully **responsive design** for desktop and mobile
- **Search with filters & suggestions**
- **Social sharing** and SEO-friendly pages
- Optimized for **speed and accessibility (WCAG 2.1)**

---

## 🖼️ Branding

The logo represents **diversity and creativity** through three shapes:
- **Square** – stability and craftsmanship
- **Circle** – unity and community
- **Triangle** – growth and aspiration

Colors:  
- **Terracotta** – warmth and earthiness  
- **Forest Green** – trust and nature  
- **Beige** – simplicity and balance  

---

## 📂 Project Structure

```

Zaymazone/
│
├── public/               # Static assets (logo, images, favicon)
├── src/
│   ├── components/       # Reusable UI components (buttons, cards, etc.)
│   ├── pages/            # Page-level components (Home, Shop, Product, etc.)
│   ├── layouts/          # Shared layouts and navigation
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API calls and data handling
│   └── styles/           # Global and modular styles (CSS/SASS)
│
├── package.json
├── README.md
└── .gitignore

````

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Git

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/zaymazone.git

# Navigate into the project
cd zaymazone

# Install dependencies
npm install
# or
yarn install
````

### Running Locally

```bash
# Start the development server
npm start
# or
yarn start
```

Visit `http://localhost:3000` in your browser.

### Build for Production

```bash
npm run build
# or
yarn build
```

---

## 🛠️ Tech Stack

* **Frontend**: React, TypeScript (optional), Tailwind CSS / SCSS
* **State Management**: Redux Toolkit or Context API
* **Backend (Optional)**: Node.js + Express (or Firebase for serverless)
* **Database (Optional)**: MongoDB or PostgreSQL
* **Payments**: Razorpay, UPI, COD
* **Deployment**: Vercel / Netlify (frontend), Render / AWS (backend)

---

## 📌 Roadmap

1. **Phase 1**: UI & Frontend Development
2. **Phase 2**: Backend APIs (authentication, product, artisan management)
3. **Phase 3**: Payment gateway integration
4. **Phase 4**: Performance optimizations and SEO

---
## Security Hardening

Client-side measures added:
- HTTPS enforcement in production via `enforceHttpsInProduction()` in `src/lib/security.ts`.
- Input validation and sanitization using Zod schemas and `sanitizeObject()` for auth and forms.
- Basic client-side rate limiting for sensitive actions (`ClientRateLimiter`).
- Optional client-side request logging using `logEvent()` with `VITE_LOG_ENDPOINT`.
- Dev CORS tightened in `vite.config.ts` to localhost origins only.

Server-side requirements (implement on your API/backend):
- Rate limiting: Apply IP/user-based throttling (e.g., 5/min for auth) using Redis token bucket or sliding window.
- Input validation: Re-validate all inputs server-side with the same schemas.
- CORS: Restrict `Access-Control-Allow-Origin` to your production domains, disallow `*` with credentials.
- Password hashing: Use bcrypt (work factor 10-12) or Argon2. Never store plaintext passwords.
- HTTPS: Terminate TLS at CDN/load balancer and redirect HTTP→HTTPS.
- API keys: Store in a secrets manager, rotate at least quarterly. Support overlapping validity during rotation.
- Logging/monitoring: Centralize request logs (status, latency, user/IP), add alerting for spikes and auth failures.

Environment variables:
- `VITE_LOG_ENDPOINT` (optional) — endpoint that accepts JSON logs via Beacon.
- `VITE_API_URL` — backend API base URL (e.g., `http://localhost:4000`).

## Backend API (Express + MongoDB)

Run locally:
- Install deps: `npm install --prefix server`
- Create `server/.env` (see variables below)
- Start API: `npm run dev --prefix server` (default `http://localhost:4000`)

Env vars (`server/.env`):
- `PORT=4000`
- `MONGODB_URI=mongodb://127.0.0.1:27017/zaymazone`
- `JWT_SECRET=change-me`
- `CORS_ORIGIN=http://localhost:8080`

Endpoints:
- Auth: `POST /api/auth/signup`, `POST /api/auth/signin`
- Products: `GET /api/products`, `GET /api/products/:id`, `POST|PUT|DELETE` (auth required)
- Artisans: `GET /api/artisans`, `GET /api/artisans/:id`, `POST|PUT|DELETE` (auth required)
- Orders: `GET /api/orders/my-orders`, `GET /api/orders/:id`, `POST /api/orders`, `PATCH /api/orders/:id/cancel`
- Payments: `POST /api/payments/create-order`, `POST /api/payments/verify`, `GET /api/payments/order/:orderId/status`
- Images: `POST /api/images/upload` (auth required)
- Firebase Auth: `POST /api/firebase-auth/sync`, `PATCH /api/firebase-auth/profile`

Notes:
- Server applies Helmet, CORS, rate limiting, and logging.
- Ensure MongoDB is running locally or update `MONGODB_URI`.
- For production, set `VITE_API_URL=https://zaymazone-backend.onrender.com` in `.env`.

### Real-Time Dashboard Integration

The dashboard (`/dashboard`) now connects to the live backend API for real-time data:
- **Profile Management**: Edit name, phone, address, and upload avatar via `PATCH /api/firebase-auth/profile`.
- **Orders**: View orders with polling every 30s; cancel orders; initiate payments.
- **Payments**: "Pay Now" redirects to Zoho payment URL; payment status updates in real-time.
- **Order Details Modal**: Shows full order info with payment status polling every 10s.

Environment Variables:
- `VITE_API_URL=https://zaymazone-backend.onrender.com/` (production backend)

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch (`feature/new-feature`)
3. Commit changes and push
4. Submit a Pull Request
