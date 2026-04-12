import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get all books
router.get('/', (req, res) => {
  db.query('SELECT * FROM books ORDER BY id DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get single book
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM books WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Book not found' });
    res.json(results[0]);
  });
});

// Add book
router.post('/', (req, res) => {
  const { title, author, genre, quantity, published_year } = req.body;
  if (!title || !author) return res.status(400).json({ error: 'Title and author are required' });
  db.query(
    'INSERT INTO books (title, author, genre, quantity, published_year) VALUES (?, ?, ?, ?, ?)',
    [title, author, genre, quantity || 1, published_year],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, message: 'Book added successfully' });
    }
  );
});

// Update book
router.put('/:id', (req, res) => {
  const { title, author, genre, quantity, published_year } = req.body;
  db.query(
    'UPDATE books SET title=?, author=?, genre=?, quantity=?, published_year=? WHERE id=?',
    [title, author, genre, quantity, published_year, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Book updated successfully' });
    }
  );
});

// Delete book
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM books WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Book deleted successfully' });
  });
});

export default router;
