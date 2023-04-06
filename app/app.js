const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = new sqlite3.Database('mydb.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the mydb.db SQLite database.');
});


// CREATE TABLES

db.run('CREATE TABLE IF NOT EXISTS clients (username TEXT PRIMARY KEY, name TEXT, email TEXT, address TEXT, password TEXT, monthrent DECIMAL(7, 2))', (err) => {
  if (err) {
    return console.error(err.message);
  }
});

db.run('CREATE TABLE IF NOT EXISTS maintenance (ticID INT PRIMARY KEY, username TEXT , date DATE, description TEXT, emergency BOOLEAN)', (err) => {
  if (err) {
    return console.error(err.message);
  }
});

db.run('CREATE TABLE IF NOT EXISTS payments (paymentID INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, amount DECIMAL(7, 2), date DATE)', (err) => {
  if (err) {
    return console.error(err.message);
  }
});

// GIVE APP ACCESS TO DIRECTORIES

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});


// 
app.post('/makePayment', (req, res) => {
  const { username, amount, date } = req.body;
  console.log(username + "paid", amount + "on", date);

  db.serialize(() => {
    // Check if the user exists and retrieve their current rent balance
    db.get(`SELECT monthrent FROM clients WHERE username = ?`, [username], (err, row) => {
      if (err) {
        return console.error(err.message);
      }
      if (!row) {
        console.log("User not found.");
        res.status(400).send("User not found");
      } else {
        // Compare the submitted amount with the rent balance
        if (parseFloat(amount) > parseFloat(row.monthrent)) {
          res.status(400).send("Payment amount is greater than the rent balance.");
        } else {
          // Run the queries in a transaction
          db.run('BEGIN TRANSACTION');

          // Insert the payment
          db.run(`INSERT INTO payments (username, amount, date) VALUES (?, ROUND(?,2), ?)`, [username, amount, date], (err) => {
            if (err) {
              db.run('ROLLBACK');
              return console.error(err.message);
            }
          });

          // Update the user's rent balance
          db.run(`UPDATE clients SET monthrent = ROUND(monthrent - ?, 2) WHERE username = ?`, [amount, username], (err) => {
            if (err) {
              db.run('ROLLBACK');
              return console.error(err.message);
            }
          });

          db.run('COMMIT', (err) => {
            if (err) {
              db.run('ROLLBACK');
              return console.error(err.message);
            }
            res.redirect('/payments.html');
          });
        }
      }
    });
  });
});



// Add client to database
app.post('/addClient', (req, res) => {
  const { username, name, email, address, password } = req.body;
 
    db.run(`INSERT INTO clients (username, name, email, address, password, monthrent) VALUES (?, ?, ?, ?, ?, ?)`, [username, name, email, address, password, 1000.00], (err) => {
      if (err) {
        return console.error(err.message);
      }
      res.redirect('/');
    });
});


// Add a maintenance ticket to the database
app.post('/addMaintenance', (req, res) => {
  const { username, date, description, emergency } = req.body;
  db.serialize(() => {
    db.run("BEGIN TRANSACTION");
    db.get("SELECT MAX(ticID) as maxID FROM maintenance", [], (err, row) => { 
      if (err) {
        return console.error(err.message);
      }

      const nextID = row.maxID ? row.maxID + 1 : 1; // Change here: use correct property name

      db.run(`INSERT INTO maintenance (ticID, username, date, description, emergency) VALUES (?,?,?,?,?)`, [nextID, username, date, description, emergency], (err) => {
        if (err) {
          return console.error(err.message);
        }
        res.redirect('/maintenance.html');
      });
    });
    db.run("COMMIT");
  });
});

// Grab user infromation from database
app.get('/clients', (req, res) => {
    db.all('SELECT username, name, email, address FROM clients', [], (err, rows) => {
      if (err) {
        return console.error(err.message);
      }
      res.send(rows);
    });
  });

  // Grab ticket information from database
app.get('/maintenance', (req, res) => {
  const {username} = req.query;
  db.all('SELECT ticID, username, date, description, emergency FROM maintenance WHERE username = ?', [username], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.send(rows);
  });
});

// Grab rent price from database
app.get('/getRent', (req, res) => {
  const { username } = req.query;
  db.get('SELECT monthrent FROM clients WHERE username = ?', [username], (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    if (row) {
      res.status(200).json({ message: 'Retrieving rent successful', monthrent: row.monthrent });
    } else {
      res.status(404).json({ error: 'No rent found' });
    }
  });
});



app.get('/payments', (req, res) => {
  const {username} = req.query;
  db.all('SELECT amount, date FROM payments WHERE username = ?', [username], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.send(rows);
  });
});

// Checks if user is in database
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM clients where username = ? and password = ?', [username, password], (err, row)=>{
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    if (!row) {
      res.status(401).json({ error: 'Incorrect username or password' });
      return;
    }
    if (row.password != password) {
      res.status(401).json({ error: 'Incorrect username or password' });
      return;
    }
    
    res.status(200).json({ message: 'Login successful', username: row.username, name: row.name, email: row.email, address: row.address, monthrent: row.monthrent });
  })
});
  
app.listen(5050, () => {
  console.log('Server is running on http://localhost:5050');
});
