# OrderCraft – Manufacturing Order and Management System

OrderCraft is a modern, responsive enterprise SaaS-style dashboard built for manufacturing businesses to manage customer orders, shopfloor production activities, warehouse inventory materials, commercial clients, and operational intelligence reports.

Built as an academic and demonstration-grade frontend application with **React (Vite)**, **Tailwind CSS**, **Lucide Icons**, and **Recharts**.

---

## 🛠️ Technology Stack

* **Frontend Framework:** React 19 with Vite
* **Styling & Theme:** Tailwind CSS (Dark Navy Blue `#0f172a`, Industrial Orange `#f97316`, Off-White background `#f8fafc`)
* **Iconography:** Lucide React
* **Data Visualizations:** Recharts (Responsive Area, Bar, and Doughnut Charts)
* **Client-Side Routing:** React Router DOM (v7)
* **State Management:** React Context API with persistent browser `localStorage` and real-time toast feedback

---

## 🚀 Key Modules & Capabilities

### 1. 📊 Executive Manufacturing Dashboard
* **5 Real-time KPI Cards:** Total Orders, Pending Orders, Active Production Runs, Completed Orders, and Low Stock Alerts.
* **Monthly Trends Line/Area Chart:** Comparative visualization of actual orders vs. factory monthly targets.
* **Production Distribution Doughnut Chart:** Breakdown of floor batches across Scheduled, In Progress, Quality Check, and Completed.
* **Recent Orders Table:** Quick access to the latest customer purchase orders.
* **Shopfloor Feed:** Real-time event log of machining progress, QC clearance, and material receipts.
* **Critical Stock Alerts Card:** Real-time low stock indicator with **1-click quick restock (+25 units)** button.

### 2. 📦 Order Management Module
* Searchable and filterable data table with multi-criteria filters (Order Status, Priority Level, and Order Date).
* **Create New Order Modal:** Auto-generates unique Order IDs, links directly to registered commercial clients, calculates total values, and sets manufacturing specifications.
* **Order Lifecycle & Specification Modal:** Interactive 5-step lifecycle tracker (`Pending` → `Confirmed` → `In Production` → `Completed` → `Delivered`), printable order slip, and **1-click "Send to Production"** workflow.
* **Edit & Delete Orders:** Fully functional with safe confirmation dialogs.

### 3. ⚙️ Production & Workstation Floor
* Track machining cycles across CNC milling lines, laser cutting, automated robotic assembly, autoclaves, and anodizing stations.
* Assigned supervisors (`Elena Rostova`, `Marcus Chen`, `David Miller`, `Rachel Adams`).
* **Interactive Floor Progress Controls:** Direct quick-progress adjustment modal with slider (0% to 100%), "Start Production", and "Mark Complete" shortcuts.
* Schedule new production batches with machine station allocation and target deadlines.

### 4. 🗄️ Inventory & Material Control
* Complete catalog of raw metals (Titanium rods, 6061 Aluminum plates), fasteners, servomotors, hydraulic seals, and composites.
* **Safety Stock Ratio Indicators:** Real-time visual progress bars showing available quantity against minimum safety thresholds.
* Automatically calculated stock status: `In Stock`, `Low Stock`, and `Out of Stock`.
* **Quick Restock Modal:** Instant replenishment with preset increments (`+10`, `+25`, `+50`, `+100`).
* Add, edit, and delete SKU items with full form validation.

### 5. 👥 Customer Management Directory
* Commercial B2B client accounts directory with representative contact info, industry classification, and location.
* **Customer Profile Modal with Full Order History:** Displays all past and active purchase orders tied directly to the selected client.
* Register new commercial accounts and edit client records.

### 6. 📈 Reports & Analytics (With Real CSV Export)
* Monthly order volume and units machined comparison bar chart.
* Order fulfillment ratio doughnut chart.
* Warehouse stock valuation by material category.
* Top commercial accounts ranked by cumulative contract spend.
* **Client-Side CSV Export:** Generate and download genuine `.csv` files directly in your browser:
  * Orders Report (`OrderCraft_Orders_Report_*.csv`)
  * Production Floor Report (`OrderCraft_Production_Report_*.csv`)
  * Inventory Catalog Report (`OrderCraft_Inventory_Report_*.csv`)

### 7. ⚙️ System & Settings
* Factory profile settings (legal entity, plant address, timezone, tax ID).
* User profile preferences.
* Notification trigger toggles (low stock warnings, machine idle notices, quality holds).
* **LocalStorage Database Summary:** Displays live item counts stored in the browser.
* **"Reset Demo Data" Option:** 1-click restoration to baseline pristine demo records if you ever want a fresh presentation state.

---

## 💻 Installation & Running Locally

Follow these quick steps to run the application on your computer:

### 1. Prerequisites
Ensure you have **Node.js** (v18 or newer) installed.

### 2. Install Dependencies
Open your terminal in the project directory (`OrderCraft`) and run:
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
The terminal will display a local URL (typically `http://localhost:5173`). Open this URL in any modern web browser.

### 4. Build for Production (Optional)
To verify or create an optimized production build:
```bash
npm run build
```
To preview the production build locally:
```bash
npm run preview
```

---

## 🎓 Evaluator & Demo Presentation Guide

When presenting this project to an evaluator or teacher:

1. **Dashboard:** Highlight the real-time operational overview, interactive Recharts visualizations, and the 1-click restock button under "Critical Stock Alerts".
2. **Order Lifecycle:** Go to **Orders**, click **"Add New Order"** and create an order. Select that order to view its lifecycle progress steps, then click **"Send to Production"** to show seamless cross-module workflows.
3. **Shopfloor Monitoring:** Switch to **Production**, use the interactive **progress slider** on any batch to increase it to 100%, and notice how its status changes to `Completed`.
4. **Inventory Control:** Go to **Inventory**, show how stock safety levels are color-coded, and use the restock button to replenish a low-stock material.
5. **CSV Export:** Go to **Reports** and click **"Export CSV"** to demonstrate client-side file generation.
6. **Data Persistence & Reset:** Refresh the page to show that changes are saved in `localStorage`. Then open **Settings**, go to **"Demo Data Management"**, and click **"Restore Baseline Demo Data"** to demonstrate the reset feature.
