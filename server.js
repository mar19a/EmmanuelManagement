const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// MySQL database connection configuration
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',  
    database: 'convince_store'  
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to the MySQL server.');
});

app.use(express.json());

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
    const { name, quantity, price, expiration_date } = req.body;
    const sql = 'INSERT INTO products (name, quantity, price, expiration_date) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, quantity, price, expiration_date], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json({ id: result.insertId, ...req.body });
        }
    });
});

// PUT endpoint for updating a product
app.put('/products/:id', (req, res) => {
    const { name, quantity, price, expiration_date } = req.body;
    const sql = 'UPDATE products SET name = ?, quantity = ?, price = ?, expiration_date = ? WHERE id = ?';
    db.query(sql, [name, quantity, price, expiration_date, req.params.id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json({ id: req.params.id, ...req.body });
        }
    });
});

// DELETE endpoint for deleting a product
app.delete('/products/:id', (req, res) => {
    const sql = 'DELETE FROM products WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.sendStatus(204);
        }
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});