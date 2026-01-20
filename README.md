# Installation Guide - Vending Machine App

## Prerequisites

- **Node.js**: v18.0.0 or higher 
- **npm**: v9.0.0 or higher 

## Step-by-Step Installation

### Step 1: Navigate to Project Directory

```bash
cd /Users/agilsaputra/Desktop/vending-machine-app
```

### Step 2: Install All Dependencies

```bash
npm install
```

## Running the Application

### Using Two Terminals 

#### Terminal 1: Start json-server
```bash
npm run json-server
```

#### Terminal 2: Start Next.js Development Server
```bash
npm run dev
```


## 🌐 Accessing the Application

| URL | Description |
|-----|-------------|
| http://localhost:3000 | Main Vending Machine |
| http://localhost:3000/admin | Admin Panel (CRUD) |
| http://localhost:3000/history | Transaction History |
| http://localhost:3001/products | API: Products (json-server) |
| http://localhost:3001/transactions | API: Transactions (json-server) |

