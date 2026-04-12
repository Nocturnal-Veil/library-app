import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get all members
router.get('/', (req, res) => {
  db.query('SELECT * FROM members ORDER BY id DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get single member
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM members WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Member not found' });
    res.json(results[0]);
  });
});

// Add member
router.post('/', (req, res) => {
  const { name, email, phone, address } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });
  db.query(
    'INSERT INTO members (name, email, phone, address) VALUES (?, ?, ?, ?)',
    [name, email, phone, address],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Email already exists' });
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: result.insertId, message: 'Member added successfully' });
    }
  );
});

// Update member
router.put('/:id', (req, res) => {
  const { name, email, phone, address } = req.body;
  db.query(
    'UPDATE members SET name=?, email=?, phone=?, address=? WHERE id=?',
    [name, email, phone, address, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Member updated successfully' });
    }
  );
});

// Delete member
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM members WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Member deleted successfully' });
  });
});

export default router;
