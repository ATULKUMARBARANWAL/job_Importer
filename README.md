# Job Importer using Redis & BullMQ

A backend system for importing jobs from an external XML feed, processing them asynchronously with Redis and BullMQ, and storing results in MongoDB.
It includes an admin dashboard that shows import history and real-time updates.

---

## 🚀 Overview

This project fetches job data from an external XML feed on a schedule or via manual trigger.
Jobs are processed in the background using BullMQ workers and stored safely in MongoDB using upsert logic.
Each import run is tracked as a batch and can be monitored from an admin UI in real time.

---

## ✨ Features

- Cron-based job fetching
- External XML job feed integration
- Background processing using BullMQ
- Concurrent job workers
- MongoDB storage with upsert logic
- Batch-level import history
- Admin dashboard for monitoring
- Real-time updates using Socket.IO
- Retry-safe and fault-tolerant design

---

## 🧰 Tech Stack

| Layer | Technology |
|------|-----------|
Backend API | Node.js, Express |
Queue System | Redis, BullMQ |
Scheduler | node-cron |
Database | MongoDB, Mongoose |
Frontend | Next.js |
Real-Time | Socket.IO |
Parsing | xml2js |
HTTP Client | axios |

---

## 📐 Architecture Flow

```
Cron / Manual Trigger
        ↓
Fetch XML Feed
        ↓
Create Import Batch
        ↓
Push Jobs to BullMQ
        ↓
Worker Processes Jobs
        ↓
MongoDB (Jobs + ImportLogs)
        ↓
Socket.IO Events
        ↓
Admin Dashboard (Real-Time)
```

---

## ▶️ Running the Project

### Start Redis
```bash
redis-server
```

### Install dependencies and start backend
```bash
cd server
npm install
npx nodemon index.js
```

### Start Admin UI
```bash
cd client
npm install
npm run dev
```

---

## 📄 License

MIT
