# FixMate – Smart Home Appliance Repair Platform

FixMate is a full-stack home appliance and smart device repair booking platform that connects customers with professional technicians. Customers can explore repair services, book appointments, track repair requests, and make secure online payments. Technicians can manage services and repair requests, while administrators manage users, services, bookings, and transactions.

## 👤 Admin Credentials

Use the following credentials to access the Admin Dashboard:

- **Email:** [Add admin email]
- **Password:** [Add admin password]

## 🚀 Key Features

### Public Features
- Responsive and user-friendly interface.
- Browse approved and available repair services.
- Search services by title and category.
- Filter services by category and service mode.
- Sort services by price and newest first.
- View detailed service information.
- User registration and login.
- Google authentication.

### Customer Features
- Customer dashboard with booking statistics.
- Book appliance repair services.
- View and manage personal bookings.
- Cancel pending booking requests.
- Track repair request status.
- Pay for completed repair services using Stripe.
- View payment history.
- Update personal profile information.

### Technician Features
- Technician dashboard.
- Add, update, and delete repair services.
- Upload service images using ImgBB.
- Manage service availability.
- View and manage customer booking requests.
- Accept or reject repair requests.
- Update repair progress.
- Set the final repair amount.

### Admin Features
- Admin dashboard with platform statistics.
- Manage users and user roles.
- Approve or reject repair services.
- Manage and monitor all bookings.
- View payment transactions.
- Monitor platform revenue.

### Security & Payment
- BetterAuth authentication.
- Role-based dashboard access.
- Protected routes and API communication.
- JWT-based authorization.
- Stripe Checkout integration.
- Secure payment workflow.

## 🛠️ Technologies Used

### Frontend
- Next.js (App Router)
- React
- JavaScript
- Tailwind CSS
- BetterAuth
- Stripe
- Lucide React
- React Hot Toast / Toast notifications

### Backend & Database
- Node.js
- Express.js
- MongoDB
- JWT
- Stripe
- ImgBB API

## 📦 Installation & Setup

### 1. Clone the repository

```bash
git clone YOUR_FRONTEND_REPOSITORY_URL
```

### 2. Navigate to the project directory

```bash
cd fixmate-client
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env.local` file in the project root and configure the required environment variables.

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Add any other authentication or public environment variables required by your project configuration.

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Create a production build

```bash
npm run build
```

## 👥 User Roles

FixMate supports three types of users:

| Role | Responsibilities |
|---|---|
| Customer | Browse services, book repairs, track requests, and make payments |
| Technician | Manage repair services and customer requests |
| Admin | Manage users, service approvals, bookings, and transactions |

## 💳 Payment Integration

FixMate uses Stripe Checkout for secure online payments. Customers can make payments after their repair service has been completed.

For testing, Stripe provides the following test card:

- **Card Number:** 4242 4242 4242 4242
- **Expiry Date:** Any future date
- **CVC:** Any 3 digits
- **ZIP:** Any valid ZIP code

## 📱 Responsive Design

The application is designed to work across desktop, tablet, and mobile devices.

## 📄 License

This project was developed as part of an academic assignment.