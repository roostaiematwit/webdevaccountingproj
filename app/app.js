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

db.run('CREATE TABLE IF NOT EXISTS clients (username TEXT PRIMARY KEY, name TEXT, email TEXT, address TEXT, password TEXT, monthrent DOUBLE)', (err) => {
  if (err) {
    return console.error(err.message);
  }
});

db.run('CREATE TABLE IF NOT EXISTS maintenance (ticID INT PRIMARY KEY, username TEXT , date DATE, description TEXT, emergency BOOLEAN)', (err) => {
  if (err) {
    return console.error(err.message);
  }
});

db.run('CREATE TABLE IF NOT EXISTS payments (paymentID INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, amount DOUBLE, date DATE)', (err) => {
  if (err) {
    return console.error(err.message);
  }
});

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

app.post('/makePayment', (req, res) => {
  const { username, amount, date } = req.body;
 
    db.run(`INSERT INTO payments (username, amount, date) VALUES (?, ?, ?)`, [username, amount, date], (err) => {
      if (err) {
        return console.error(err.message);
      }
      res.redirect('/payments.html');
      db.run(`UPDATE clients SET monthrent = (monthrent - ?) WHERE username = ?`, [amount, username]), (err) => {
        if (err) {
          return console.error(err.message);
        }
      }
    });
});

app.post('/addClient', (req, res) => {
  const { username, name, email, address, password } = req.body;
 
    db.run(`INSERT INTO clients (username, name, email, address, password, monthrent) VALUES (?, ?, ?, ?, ?, ?)`, [username, name, email, address, password, 1000.00], (err) => {
      if (err) {
        return console.error(err.message);
      }
      res.redirect('/');
    });
});

app.get('/getRent', (req, res) => {
  const { username } = req.body;
 
    db.run('SELECT monthrent FROM clients WHERE username = ?', [username], (err,row) => {
      if (err) {
        return console.error(err.message);
      }
      res.send(row);
    });
});


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

// the row variable is used to represent each row of data that is returned by the database query. 
//The row variable is typically an object that contains the columns of the row and their associated values.
app.get('/clients', (req, res) => {
    db.all('SELECT username, name, email, address FROM clients', [], (err, rows) => {
      if (err) {
        return console.error(err.message);
      }
      res.send(rows);
    });
  });

app.get('/maintenance', (req, res) => {
  const {username} = req.query;
  db.all('SELECT ticID, username, date, description, emergency FROM maintenance WHERE username = ?', [username], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.send(rows);
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
