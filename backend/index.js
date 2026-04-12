import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import booksRouter from './routes/books.js';
import membersRouter from './routes/members.js';
import borrowsRouter from './routes/borrows.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type'] }));
app.use(express.json());

app.use('/api/books', booksRouter);
app.use('/api/members', membersRouter);
app.use('/api/borrows', borrowsRouter);

app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log('Server running on port ' + PORT));