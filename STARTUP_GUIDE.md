# AgroSmart Startup Guide 🚀

The AgroSmart platform is now a full-stack application consisting of three distinct services that need to run simultaneously. Follow the instructions below to start all services locally.

---

## 1. Start the Machine Learning Service (Python)
This service runs the Random Forest AI model and exposes the prediction API on port 5000.

1. Open a new terminal.
2. Navigate to the `ml-service` directory (make sure you are inside the inner project folder):
   ```bash
   cd AgroSmart-Crop-Recommendation-main/ml-service
   ```
   *(If you are already inside the inner folder, just run `cd ml-service`)*
3. Start the FastAPI server using Uvicorn:
   ```bash
   python -m uvicorn app:app --host 0.0.0.0 --port 5000
   ```
*(Leave this terminal running)*

---

## 2. Start the Backend API (Node.js)
This service handles authentication, databases, and serves as the bridge between the frontend and the ML service. It runs on port 4000.

1. Open a **second** new terminal.
2. Navigate to the `backend` directory:
   ```bash
   cd AgroSmart-Crop-Recommendation-main/backend
   ```
   *(If you are already inside the inner folder, just run `cd backend`)*
3. Start the Express server:
   ```bash
   node server.js
   ```
*(Leave this terminal running)*

> **Note:** The backend uses a local mock database (`data.json`) automatically, so no extra database installation is required!

---

## 3. Start the Frontend UI (React)
This is the user interface you interact with in your browser. It runs on port 3000.

1. Open a **third** new terminal.
2. Navigate to the **inner root** directory of the project (where `package.json` and `vite.config.ts` are located):
   ```bash
   cd AgroSmart-Crop-Recommendation-main
   ```
   *(If you are already inside the inner folder, skip this step)*
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
*(Leave this terminal running)*

---

## 🎉 Access the Application
Once all three terminals are running, open your web browser and go to:
👉 **http://localhost:3000**

### Test Accounts
You can log in to the dashboards using these seeded test accounts:

**Admin Account:**
* Email: `admin@agrosmart.ai`
* Password: `Admin@123`

**Farmer Account:**
* Email: `farmer@agrosmart.ai`
* Password: `Farmer@123`
admin@agrosmart.ai