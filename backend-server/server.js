const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); 

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json()); 

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

app.post('/api/messages', (req, res) => {
    const { message, user } = req.body;
    const query = 'INSERT INTO messages (message, user, timestamp) VALUES (?, ?, NOW())';
    
    db.query(query, [message, user], (err, result) => {
        if (err) {
            console.error('Error saving message:', err);
            return res.status(500).send('Error saving message');
        }
        res.status(200).send('Message saved successfully');
    });
});

app.get('/api/messages', (req, res) => {
    const query = 'SELECT * FROM messages ORDER BY timestamp ASC';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching messages:', err);
            return res.status(500).send('Error fetching messages');
        }
        res.status(200).json(results);
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
