const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// MySQL database connection configuration
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',  // replace with your root password
    database: 'myDatabase'  // replace with your database name
});

// Connect to the MySQL server
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to the MySQL server.');
});

app.use(express.json()); // This middleware is required to parse JSON bodies from the request

// GET endpoint for fetching all products
app.get('/products', (req, res) => {
    const sql = 'SELECT * FROM products';
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
});

// POST endpoint for adding a new product
app.post('/products', (req, res) => {
    const sql = 'INSERT INTO products SET ?';
    const product = req.body;
    db.query(sql, product, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
});

// other endpoints...

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});