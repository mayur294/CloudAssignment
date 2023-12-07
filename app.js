const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

// Configure MySQL connection
const db = mysql.createConnection({
      host: 'database-2.crus4vmhm48u.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'password',
  database: 'database_1'
});


db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Set up the view engine
app.set('view engine', 'ejs');

// Set up static files (CSS)
app.use(express.static('public'));

// Routes
// Update the SELECT query in the '/' route in app.js
app.get('/', (req, res) => {
  // Fetch tasks with date and time from the database
  db.query('SELECT id, task, DATE_FORMAT(created_at, "%Y-%m-%d %H:%i:%s") as created_at FROM tasks', (err, results) => {
    if (err) throw err;
    res.render('index', { tasks: results });
  });
});


app.post('/add', (req, res) => {
  const task = req.body.task;
  // Insert new task into the database
  db.query('INSERT INTO tasks (task) VALUES (?)', [task], (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});
// Add this route after the existing routes in app.js
app.post('/delete/:id', (req, res) => {
  const taskId = req.params.id;
  // Delete task from the database
  db.query('DELETE FROM tasks WHERE id = ?', [taskId], (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
