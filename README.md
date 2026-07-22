# Enterprise Intelligence System

> **A full-stack business intelligence platform** — combining a Python-based analytics backend with a modern Next.js frontend for data-driven decision making.

---

## 🚀 Overview

Enterprise Intelligence System is a comprehensive business intelligence solution that processes, analyzes, and visualizes enterprise data. Built with a split architecture for scalability and maintainability.

---

## 📦 Architecture

```
enterprise-intelligence-system/
├── backend/          # Python analytics engine
│   ├── main.py       # Application entry point
│   ├── server.py     # REST API server
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/         # Next.js web application
│   ├── src/
│   │   ├── app/      # Next.js app router pages
│   │   └── components/
│   ├── public/       # Static assets
│   ├── next.config.ts
│   └── package.json
└── docker-compose.yml  # Orchestrated deployment
```

---

## 💻 Tech Stack

| Component | Technology |
|-----------|------------|
| **Backend** | Python, Flask/FastAPI |
| **Frontend** | Next.js, TypeScript, Tailwind CSS |
| **Infrastructure** | Docker, Docker Compose |

---

## 🔧 Quick Start

### Using Docker (Recommended)
```bash
docker-compose up --build
```

### Manual Setup
```bash
# Backend
cd backend
pip install -r requirements.txt
python main.py

# Frontend
cd frontend
npm install
npm run dev
```

---

## 📄 License

MIT
