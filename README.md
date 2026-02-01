# Reconciliation App

A full-stack web application for reconciling financial transactions between Statement and Settlement files. This tool automates the process of matching records, identifying discrepancies, and generating reconciliation reports.

## 🚀 Live Demo

- **Frontend**: [https://reconciliations.netlify.app/](https://reconciliations.netlify.app/)
- **Backend API**: [https://reconciliation-app-y9sb.onrender.com](https://reconciliation-app-y9sb.onrender.com)

## ✨ Features

- **File Upload**: Support for uploading **Statement** and **Settlement** files (.csv, .xlsx).
- **Automated Reconciliation**: Triggers matching logic to identify:
  - **Matched Transactions**: Records present in both files.
  - **Discrepancies**: Variance in amounts between statement and settlement.
  - **Missing Records**: Transactions found in one source but not the other.
- **Interactive Dashboard**:
  - Summary cards showing counts for different reconciliation states.
  - Detailed transaction table with pagination.
  - Color-coded status chips for easy identification.
- **Responsive Design**: Built with Material UI for a modern and accessible interface.

## 🛠️ Tech Stack

### Frontend

- **React.js**: specialized with **Vite** for fast development.
- **Material UI (MUI)**: For polished and responsive UI components.
- **Axios**: For API requests.
- **React Router**: For client-side navigation.

### Backend

- **Node.js & Express.js**: RESTful API architecture.
- **MongoDB & Mongoose**: Database for storing transaction records.
- **Multer**: For handling file uploads (multipart/form-data).
- **XLSX**: For parsing Excel and CSV files.

## 📂 Project Structure

```bash
reconciliation-app/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── config/          # DB and Multer config
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic (parsing, reconciliation)
│   │   └── server.js        # Entry point
│   └── package.json
│
└── frontend/                # React Vite App
    ├── src/
    │   ├── api/             # API integration
    │   ├── components/      # Reusable UI components
    │   ├── pages/           # Application views
    │   └── App.jsx          # Main component with routing
    └── package.json
```

## ⚡ Installation & Local Setup

### Prerequisites

- Node.js (v14+ recommended)
- MongoDB (Local or Atlas URI)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd reconciliation-app
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create a .env file
echo "MONGO_URI=your_mongodb_connection_string" > .env
echo "PORT=5000" >> .env

# Start the server
npm run dev
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install

# Start the development server
npm run dev
```

The frontend will start at `http://localhost:5173` and the backend at `http://localhost:5000`.

## 📡 API Endpoints

- **POST** `/api/upload`: Upload Statement or Settlement files.
- **GET** `/api/transactions`: Fetch paginated transactions with filters.
- **POST** `/api/transactions/reconcile`: Trigger the reconciliation process.
- **GET** `/api/transactions/summary`: Get summary statistics for the dashboard.
