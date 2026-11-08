# KartShop - MERN E-Commerce

## Setup
Needs Node 18+ and MongoDB (local, or an Atlas connection string).

### Backend
    cd server
    npm install
    cp .env.example .env     # edit JWT_SECRET and MONGO_URI
    npm run seed             # 12 sample products + admin (admin@shop.com / admin123)
    npm run dev              # http://localhost:5000

### Frontend
    cd client
    npm install
    npm run dev              # http://localhost:5173

## Features
- Register / login with JWT (bcrypt password hashing, 7 day token)
- Product listing with search (debounced), category filter, pagination
- Product detail page, cart (persisted in localStorage), checkout, order history
- Order prices and stock are verified on the server, never trusted from the client
- helmet, CORS, rate limiting on auth routes, input validation, regex-escaped search
- Admin-only POST /api/products (bonus)

## API
POST /api/auth/register, POST /api/auth/login, GET /api/auth/me
GET /api/products?search=&category=&page=, GET /api/products/:id, POST /api/products (admin)
POST /api/orders (auth), GET /api/orders/mine (auth)
