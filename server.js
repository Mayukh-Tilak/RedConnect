const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL DB Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'redconnect'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL database.');
});

// Import and Use Routes
app.use('/donors', require('./routes/donors')(db));
app.use('/hospitals', require('./routes/hospitals')(db));
app.use('/appointments', require('./routes/appointments')(db));
app.use('/bloodrequests', require('./routes/bloodRequests')(db));
app.use('/bloodinventory', require('./routes/bloodInventory')(db));
app.use('/transfusions', require('./routes/transfusions')(db));
app.use('/reports', require('./routes/reports')(db));

// Root Route
app.get('/', (req, res) => {
  res.send('RedConnect API is running');
});

// Start Server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
