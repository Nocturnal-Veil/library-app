import { useEffect, useState } from 'react'
import axios from 'axios'

const API = 'http://13.51.167.24:5000/api/books'
const empty = { title: '', author: '', genre: '', quantity: 1, published_year: '' }

export default function Books() {
  const [books, setBooks] = useState([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState(null)
  const [toast, setToast] = useState(null)

  const load = () => axios.get(API).then(r => setBooks(r.data))
  useEffect(() => { load() }, [])

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const openAdd = () => { setForm(empty); setEditing(null); setModal(true) }
  const openEdit = (b) => { setForm(b); setEditing(b.id); setModal(true) }
  const closeModal = () => setModal(false)

  const save = async () => {
    try {
      if (editing) {
        await axios.put(`${API}/${editing}`, form)
        showToast('Book updated')
      } else {
        await axios.post(API, form)
        showToast('Book added')
      }
      load(); closeModal()
    } catch (e) {
      showToast(e.response?.data?.error || 'Error', 'error')
    }
  }

  const del = async (id) => {
    if (!confirm('Delete this book?')) return
    await axios.delete(`${API}/${id}`)
    showToast('Book deleted'); load()
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Books</h2>
          <p className="page-subtitle">{books.length} books in collection</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Book</button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th><th>Title</th><th>Author</th><th>Genre</th><th>Year</th><th>Qty</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.length === 0 && (
              <tr><td colSpan="7"><div className="empty-state">No books yet. Add one!</div></td></tr>
            )}
            {books.map(b => (
              <tr key={b.id}>
                <td style={{color:'var(--text-muted)'}}>{b.id}</td>
                <td><strong>{b.title}</strong></td>
                <td>{b.author}</td>
                <td>{b.genre || '—'}</td>
                <td>{b.published_year || '—'}</td>
                <td>
                  <span style={{color: b.quantity > 0 ? 'var(--green)' : 'var(--red)'}}>
                    {b.quantity}
                  </span>
                </td>
                <td>
                  <div className="actions-cell">
                    <button className="btn btn-edit" onClick={() => openEdit(b)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => del(b.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editing ? 'Edit Book' : 'Add New Book'}</h2>
            {[['title','Title'],['author','Author'],['genre','Genre'],['published_year','Published Year']].map(([k,l]) => (
              <div className="form-group" key={k}>
                <label>{l}</label>
                <input value={form[k] || ''} onChange={e => setForm({...form, [k]: e.target.value})} />
              </div>
            ))}
            <div className="form-group">
              <label>Quantity</label>
              <input type="number" min="0" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} />
            </div>
            <div className="modal-actions">
              <button className="btn btn-cancel" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={save}>Save</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  )
}
