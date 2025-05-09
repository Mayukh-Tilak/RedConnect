# 🩸 RedConnect - Blood Donation Management System

RedConnect is a full-stack web application designed to manage blood donation workflows, including donor management, hospital records, blood inventory tracking, appointment scheduling, and transfusion history. It's built for efficiency, real-time interaction, and ease of use by healthcare professionals.

---

## 🚀 Features

- **Donor Management**: Add, update, and delete donor records with validation checks (e.g., age limit).
- **Hospital Management**: Register hospitals and associate them with inventory and requests.
- **Blood Inventory**: Track blood type stocks, quantities, and expiration dates.
- **Blood Requests**: Handle and monitor blood request statuses and urgency.
- **Appointments**: Schedule and manage donation appointments.
- **Transfusions**: Record blood transfusions and update inventory accordingly.
- **Reports**: Generate shortage reports per hospital and blood type.
- **Automated Triggers**: Enforce business rules like donor age check and automatic update of last donation date.

---

## 🧱 Tech Stack

### 🔹 Frontend
- **HTML5**
- **CSS3**
- **Vanilla JavaScript (ES6)**

### 🔹 Backend
- **Node.js**
- **Express.js**

### 🔹 Database
- **MySQL**
  - `mysql2` Node.js library
  - Triggers and constraints

### 🔹 Other Tools
- **Postman** – API testing
- **Git & GitHub** – Version control

---

## 📁 Project Structure

```
redconnect/
├── index.html              # Main frontend HTML
├── css/
│   └── style.css           # Custom styling
├── js/
│   └── app.js              # Frontend JavaScript
├── server/
│   ├── index.js            # Express server setup
│   └── db.js               # MySQL connection
├── routes/
│   ├── donors.js
│   ├── hospitals.js
│   ├── appointments.js
│   └── ...                 # Other route handlers
├── package.json            # Node dependencies
└── README.md               # You're here!
```

---

## 🛠️ Installation

### Prerequisites

- Node.js and npm
- MySQL server running
- Git

### Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/redconnect.git
   cd redconnect
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure the MySQL database:**

   - Create the database:

     ```sql
     CREATE DATABASE redconnect;
     ```

   - Run the contents of `schema.sql` using MySQL Workbench or another SQL editor to set up tables and triggers.

     This includes:
     - Donors, Hospitals, BloodInventory, Requests, Appointments, etc.
     - Triggers for donor age validation and automatic update of last donation date.

   - *(Optional)* Run `seed.sql` to populate the database with sample data for testing (e.g., donors, hospitals, blood types).

4. **Update `db.js` with your local credentials:**

   ```js
   const db = mysql.createConnection({
     host: 'localhost',
     user: 'root',
     password: 'yourpassword',
     database: 'redconnect'
   });
   ```

---

## ▶️ Running the App

To start the backend server:

```bash
node server/index.js
```

The backend API will be available at:  
[http://localhost:3000](http://localhost:3000)

To access the frontend, open `index.html` directly in a browser or serve it with a static HTTP server.

---

## 🌐 API Overview

All endpoints are hosted at `http://localhost:3000`.

### Example Endpoints

#### Donors
- `GET /donors`
- `POST /donors`
- `PUT /donors/:id`
- `DELETE /donors/:id`

#### Other Resources
- `/hospitals`
- `/appointments`
- `/transfusions`
- `/bloodrequests`
- `/reports`
- `/inventory`

---

## 🔒 Validation & Constraints

- **Donor Age**: Must be between 18 and 65 years (enforced via trigger).
- **Blood Types**: Validated using `ENUM` or `CHECK` constraints.
- **Donation Date**: Automatically updates `LastDonationDate` on donation.

---

## 🧑‍💻 Author

**Your Name**  
GitHub: [@Mayukh-Tilak](https://github.com/Mayukh-Tilak/)

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 🙌 Contributions

Contributions are welcome!  
Fork the repository and submit a pull request.

