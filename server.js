const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'notes_app'
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// API endpoints
app.get('/api/notes', (req, res) => {
    connection.query('SELECT * FROM notes', (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error retrieving notes' });
            return;
        }
        res.json(results);
    });
});

app.post('/api/notes', (req, res) => {
    const { title, content } = req.body;
    connection.query('INSERT INTO notes (title, content) VALUES (?, ?)', [title, content], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error adding note' });
            return;
        }
        res.json({ id: result.insertId, title, content });
    });
});

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM notes WHERE id = ?', [id], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error deleting note' });
            return;
        }
        res.json({ message: 'Note deleted successfully' });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
