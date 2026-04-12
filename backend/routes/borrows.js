import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get all borrows with book and member info
router.get('/', (req, res) => {
  const sql = `
    SELECT b.id, m.name as member_name, bk.title as book_title, 
           b.borrow_date, b.due_date, b.return_date, b.status
    FROM borrows b
    JOIN members m ON b.member_id = m.id
    JOIN books bk ON b.book_id = bk.id
    ORDER BY b.id DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Borrow a book
router.post('/', (req, res) => {
  const { member_id, book_id, due_date } = req.body;
  if (!member_id || !book_id || !due_date)
    return res.status(400).json({ error: 'member_id, book_id and due_date are required' });

  // Check book availability
  db.query('SELECT quantity FROM books WHERE id = ?', [book_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Book not found' });
    if (results[0].quantity < 1) return res.status(400).json({ error: 'Book not available' });

    db.query(
      'INSERT INTO borrows (member_id, book_id, borrow_date, due_date, status) VALUES (?, ?, CURDATE(), ?, "borrowed")',
      [member_id, book_id, due_date],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        db.query('UPDATE books SET quantity = quantity - 1 WHERE id = ?', [book_id]);
        res.status(201).json({ id: result.insertId, message: 'Book borrowed successfully' });
      }
    );
  });
});

// Return a book
router.put('/:id/return', (req, res) => {
  db.query('SELECT * FROM borrows WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Borrow record not found' });
    if (results[0].status === 'returned') return res.status(400).json({ error: 'Book already returned' });

    const book_id = results[0].book_id;
    db.query(
      'UPDATE borrows SET return_date = CURDATE(), status = "returned" WHERE id = ?',
      [req.params.id],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        db.query('UPDATE books SET quantity = quantity + 1 WHERE id = ?', [book_id]);
        res.json({ message: 'Book returned successfully' });
      }
    );
  });
});

// Delete borrow record
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM borrows WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Record deleted' });
  });
});

export default router;
