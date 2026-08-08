# Lolo And The Kid (LATK) Cafe — E-Commerce System

An online ordering and administrative management web application for **Lolo And The Kid (LATK) Cafe**. Features a customer ordering workflow (unli-rice food, steaks, fried items, specialty coffee, frappes, and matcha drinks) and an administrative panel for inventory, sales reports, and order fulfillment.

---

## 🚀 Prerequisites

Ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v18.x or higher)
* [Git](https://git-scm.com/)
* [MongoDB Community Server](https://www.mongodb.com/try/download/community) running locally on port `27017`, OR a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cloud URI.

---

## 🛠️ Local Setup Instructions

Follow these steps to set up and run the project locally on your machine:

### 1. Clone the Repository & Switch Branch

```bash
git clone https://github.com/Gian461/ITSRAQA.git
cd ITSRAQA
git checkout andre-working-branch
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory by copying `.env.example`:

```bash
# On Windows PowerShell:
Copy-Item .env.example .env

# On Bash/Linux/Mac:
cp .env.example .env
```

Ensure your `.env` contains:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/latk_cafe
JWT_SECRET=super_secret_latk_jwt_key_2026
```

### 4. Seed the Database

Populate MongoDB with default categories, menu products (food & drinks), and test accounts:

```bash
npm run seed
```

### 5. Start the Application

Run the server in development mode (with auto-reload using nodemon):

```bash
npm run dev
```

Or run standard production mode:

```bash
npm start
```

Open your browser and visit: **[http://localhost:5000](http://localhost:5000)**

---

## 🔑 Default Login Credentials (After Seeding)

| Role | Username | Password | Access URL |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` | `http://localhost:5000/admin/login.html` |
| **Customer** | `juandelacruz` | `customer123` | `http://localhost:5000/login.html` |

---

## 📁 Project Directory Structure

```
ITSRAQA/
├── admin/                 # Admin Dashboard frontend (Inventory, Orders, Reports, Accounts)
├── api/                   # Entry point for Vercel Serverless Functions
│   └── index.js
├── config/                # Mongoose database connection configuration
│   └── db.js
├── middleware/            # Auth & Admin route protection middleware
│   └── auth.js
├── models/                # MongoDB Mongoose Data Models
│   ├── Order.js
│   ├── Product.js
│   ├── StockLog.js
│   └── User.js
├── public/                # Customer frontend assets (HTML, CSS, client-side JS)
│   ├── css/
│   │   └── style.css
│   ├── img/
│   │   ├── logo.svg
│   │   └── cafe-bg.png
│   ├── js/
│   │   └── api.js
│   ├── about.html
│   ├── checkout.html
│   ├── contact.html
│   ├── home.html
│   ├── login.html
│   ├── menu.html
│   ├── order-confirmation.html
│   ├── order-status.html
│   └── register.html
├── routes/                # Express REST API endpoints
│   ├── admin.js           # Inventory CRUD, status updates, analytics reports
│   ├── auth.js            # User registration & login
│   ├── orders.js          # Checkout & customer order tracking
│   └── products.js        # Product catalog filtering
├── seed/                  # Database seeding script
│   └── seed.js
├── .env.example
├── .gitignore
├── package.json
├── server.js              # Express server entry point
└── vercel.json            # Vercel deployment configuration
```

---

## 🌐 Deploying to Vercel

This project includes a `vercel.json` and serverless wrapper (`api/index.js`). To deploy on Vercel:

1. Push your changes to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Set the Environment Variables in Vercel project settings:
   * `MONGO_URI`: Your MongoDB Atlas connection string.
   * `JWT_SECRET`: A secure random secret string.
4. Deploy!
