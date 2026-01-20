# Job Importer using Redis & BullMQ

A scalable backend system that periodically imports jobs from an external XML feed, processes them asynchronously using Redis + BullMQ, stores jobs in MongoDB, and maintains a complete import history for admin monitoring.

---

## 🚀 Features

- ⏰ **Cron-based job fetching** (every minute / hour)
- 🌐 **External XML Job Feed Integration**
- 🔄 **Asynchronous processing using BullMQ**
- 🧵 **Concurrent job workers**
- 🗄 **MongoDB storage with upsert logic**
- 📊 **Batch-level import history tracking**
- 🧑‍💼 **Admin UI for import logs**
- ⚙️ **Fault-tolerant & retry-safe design**

---

## 🧰 Tech Stack

| Layer        | Technology |
|-------------|-----------|
Backend API  | Node.js, Express |
Queue System | Redis, BullMQ |
Scheduler    | node-cron |
Database     | MongoDB, Mongoose |
Frontend     | Next.js (Admin UI) |
Parsing      | xml2js |
HTTP Client  | axios |

---
📐 Architecture Details:  
See [docs/architecture.md](docs/architecture.md)

## 📁 Project Structure

