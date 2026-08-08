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

### 1. Clone the Repository

```bash
git clone https://github.com/Gian461/ITSRAQA.git
cd ITSRAQA
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
