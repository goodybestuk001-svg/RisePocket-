# RisePocket- - Task & Rewards Platform

A complete, production-ready task and rewards platform built with **Laravel 12** and **React + TypeScript**.

## 🎯 Features

### Core Features
- ✅ **User Authentication** - Registration, Login, 2FA, Password Recovery
- ✅ **Activation Plans** - 6 Configurable packages (Starter to Platinum)
- ✅ **Daily Task System** - Auto-generated, submission, verification, approval
- ✅ **Secure Wallet** - Balance tracking, transaction history, multiple earning sources
- ✅ **Referral Program** - Unique codes, automatic ₦250 rewards per qualified referral
- ✅ **Affiliate Program** - Progress tracking, ₦20,000 reward at 100 qualifications
- ✅ **Withdrawals** - Request, approval, processing workflow
- ✅ **Real-time Notifications** - Task updates, rewards, withdrawals
- ✅ **Admin Dashboard** - Full management and analytics

### Security Features
- ✅ CSRF Protection
- ✅ SQL Injection Prevention
- ✅ XSS Protection
- ✅ Rate Limiting
- ✅ Role-Based Access Control (RBAC)
- ✅ Activity Logging & Audit Trails
- ✅ Secure Password Hashing
- ✅ JWT Authentication (Laravel Sanctum)

### Technology Stack
- **Backend**: Laravel 12, PHP 8.2+
- **Frontend**: React 18+, TypeScript, Tailwind CSS
- **Database**: MySQL 8.0+
- **Cache/Queue**: Redis
- **Authentication**: Laravel Sanctum
- **Payments**: Paystack Integration Ready
- **Deployment**: Docker, Nginx, Docker Compose
- **Testing**: PHPUnit, Pest, Vitest

## 📋 Project Structure

```
RisePocket-/
├── backend/                    # Laravel 12 Backend
│   ├── app/
│   │   ├── Models/            # Eloquent Models
│   │   ├── Http/
│   │   │   ├── Controllers/   # API Controllers
│   │   │   ├── Requests/      # Form Requests
│   │   │   └── Resources/     # API Resources
│   │   ├── Jobs/              # Queue Jobs
│   │   ├── Listeners/         # Event Listeners
│   │   └── Services/          # Business Logic
│   ├── database/
│   │   ├── migrations/        # Database Migrations
│   │   ├── factories/         # Model Factories
│   │   └── seeders/           # Database Seeders
│   ├── routes/                # API Routes
│   ├── tests/                 # Unit & Feature Tests
│   └── config/                # Configuration Files
├── frontend/                  # React + TypeScript Frontend
│   ├── src/
│   │   ├── pages/            # Page Components
│   │   ├── components/       # Reusable Components
│   │   ├── hooks/            # Custom Hooks
│   │   ├── services/         # API Services
│   │   ├── stores/           # Zustand State Management
│   │   ├── styles/           # Global Styles
│   │   └── types/            # TypeScript Definitions
│   └── public/               # Static Assets
├── docker/                   # Docker Configuration
│   ├── Dockerfile            # App Container
│   └── nginx.conf            # Nginx Configuration
├── docs/                     # Documentation
│   ├── API.md               # API Documentation
│   ├── INSTALLATION.md      # Installation Guide
│   └── DEPLOYMENT.md        # Deployment Guide
└── docker-compose.yml       # Docker Compose Configuration
```

## 🚀 Quick Start

### Prerequisites
- PHP 8.2+
- Composer
- MySQL 8.0+
- Redis
- Node.js 18+
- Docker & Docker Compose (optional)

### Installation

#### 1. Clone Repository
```bash
git clone https://github.com/goodybestuk001-svg/RisePocket-.git
cd RisePocket-
```

#### 2. Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate

# Configure database in .env
DB_DATABASE=risepocket
DB_USERNAME=root
DB_PASSWORD=your_password

# Run migrations and seeders
php artisan migrate --seed

# Generate storage link
php artisan storage:link

# Start development server
php artisan serve
php artisan queue:work
```

#### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Create environment file
echo "VITE_API_URL=http://localhost:8000" > .env.local

# Start development server
npm run dev
```

#### 4. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Admin Panel: http://localhost:3000/admin

### Docker Deployment

```bash
# Build and start all services
docker-compose up -d

# Run migrations
docker-compose exec app php artisan migrate --seed

# View logs
docker-compose logs -f
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/register` - User Registration
- `POST /api/login` - User Login
- `POST /api/logout` - User Logout
- `GET /api/me` - Get Current User

### Task Endpoints
- `GET /api/tasks/today` - Get Today's Tasks
- `POST /api/tasks/{id}/submit` - Submit Task
- `GET /api/tasks/submissions` - Get Submissions

### Wallet Endpoints
- `GET /api/wallet/balance` - Get Wallet Balance
- `GET /api/wallet/transactions` - Get Transactions
- `GET /api/wallet/transactions/{type}` - Get Transactions by Type

### Referral Endpoints
- `GET /api/referrals/code` - Get Referral Code
- `GET /api/referrals` - Get Referrals List

### Affiliate Endpoints
- `GET /api/affiliates/info` - Get Affiliate Info
- `GET /api/affiliates/registrations` - Get Registrations

### Withdrawal Endpoints
- `POST /api/withdrawals` - Request Withdrawal
- `GET /api/withdrawals` - Get Withdrawals
- `GET /api/withdrawals/{id}` - Get Withdrawal Status

See `docs/API.md` for complete documentation.

## 🛠 Configuration

### Activation Plans
Edit plans from Admin Dashboard or database seeders:

```php
[
    'name' => 'Starter',
    'activation_fee' => 1000,
    'daily_tasks' => 1,
    'reward_per_task' => 300,
]
```

### System Settings
Key settings configurable via Admin Dashboard:
- Minimum withdrawal amount
- Referral reward amount
- Affiliate reward thresholds
- Task approval timeout
- Email templates

## 🧪 Testing

### Backend Tests
```bash
cd backend

# Run all tests
php artisan test

# Run specific test file
php artisan test tests/Feature/AuthTest.php

# Run with coverage
php artisan test --coverage
```

### Frontend Tests
```bash
cd frontend

# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## 📊 Database Schema

### Core Tables
- **users** - User accounts
- **activation_plans** - Subscription plans
- **wallets** - User wallet accounts
- **wallet_transactions** - Transaction history
- **daily_tasks** - Daily task assignments
- **task_submissions** - Task submissions & proofs
- **referrals** - Referral tracking
- **affiliates** - Affiliate accounts
- **affiliate_registrations** - Affiliate registration tracking
- **affiliate_rewards** - Affiliate reward history
- **withdrawals** - Withdrawal requests & history
- **notifications** - User notifications
- **settings** - System settings

## 🔐 Security

- **Authentication**: Laravel Sanctum JWT tokens
- **Authorization**: Spatie Permission RBAC
- **Validation**: Comprehensive input validation
- **Encryption**: Password hashing with bcrypt
- **HTTPS**: Full TLS/SSL support
- **Rate Limiting**: API throttling
- **CORS**: Secure cross-origin requests
- **Activity Logging**: Complete audit trail

## 📱 Responsive Design

- Mobile-first approach
- Desktop, tablet, mobile optimized
- Progressive Web App (PWA) ready
- Touch-friendly interface
- Fast load times

## 🚀 Deployment

### Production Checklist
- [ ] Set `APP_DEBUG=false` in `.env`
- [ ] Configure proper database backups
- [ ] Set up SSL certificates
- [ ] Configure email service
- [ ] Set up payment gateway credentials
- [ ] Configure Redis for caching
- [ ] Set up queue worker supervision
- [ ] Enable rate limiting
- [ ] Configure storage (S3 or local)
- [ ] Set up monitoring & logging

### Deployment Guides
See `docs/DEPLOYMENT.md` for:
- AWS Deployment
- Heroku Deployment
- DigitalOcean Deployment
- VPS Deployment with Docker

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Support

For issues and feature requests, please create an issue on GitHub.

## 👨‍💻 Developer

Built with ❤️ by the RisePocket- Team

---

**Ready to build wealth? Start with RisePocket-! 🚀**
