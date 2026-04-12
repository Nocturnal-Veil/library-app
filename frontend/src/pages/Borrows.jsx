import { useEffect, useState } from 'react'
import axios from 'axios'

const API = 'http://13.51.167.24:5000/api/borrows'

export default function Borrows() {
  const [borrows, setBorrows] = useState([])
  const [books, setBooks] = useState([])
  const [members, setMembers] = useState([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ member_id: '', book_id: '', due_date: '' })
  const [toast, setToast] = useState(null)

  const load = () => axios.get(API).then(r => setBorrows(r.data))
  useEffect(() => {
    load()
    axios.get('http://13.51.167.24:5000/api/books').then(r => setBooks(r.data))
    axios.get('http://13.51.167.24:5000/api/members').then(r => setMembers(r.data))
  }, [])

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const borrow = async () => {
    try {
      await axios.post(API, form)
      showToast('Book borrowed successfully')
      load(); setModal(false)
    } catch (e) {
      showToast(e.response?.data?.error || 'Error', 'error')
    }
  }

  const returnBook = async (id) => {
    try {
      await axios.put(`${API}/${id}/return`)
      showToast('Book returned successfully')
      load()
    } catch (e) {
      showToast(e.response?.data?.error || 'Error', 'error')
    }
  }

  const del = async (id) => {
    if (!confirm('Delete this record?')) return
    await axios.delete(`${API}/${id}`)
    showToast('Record deleted'); load()
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Borrow Records</h2>
          <p className="page-subtitle">{borrows.filter(b => b.status === 'borrowed').length} currently borrowed</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal(true)}>+ New Borrow</button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th><th>Member</th><th>Book</th><th>Borrowed</th>
              <th>Due</th><th>Returned</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {borrows.length === 0 && (
              <tr><td colSpan="8"><div className="empty-state">No borrow records yet.</div></td></tr>
            )}
            {borrows.map(b => (
              <tr key={b.id}>
                <td style={{color:'var(--text-muted)'}}>{b.id}</td>
                <td>{b.member_name}</td>
                <td>{b.book_title}</td>
                <td>{b.borrow_date?.split('T')[0]}</td>
                <td style={{color: b.status === 'borrowed' && b.due_date < today ? 'var(--red)' : 'inherit'}}>
                  {b.due_date?.split('T')[0]}
                </td>
                <td>{b.return_date ? b.return_date.split('T')[0] : '—'}</td>
                <td>
                  <span className={`badge badge-${b.status}`}>{b.status}</span>
                </td>
                <td>
                  <div className="actions-cell">
                    {b.status === 'borrowed' && (
                      <button className="btn btn-success" onClick={() => returnBook(b.id)}>Return</button>
                    )}
                    <button className="btn btn-danger" onClick={() => del(b.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>New Borrow</h2>
            <div className="form-group">
              <label>Member</label>
              <select value={form.member_id} onChange={e => setForm({...form, member_id: e.target.value})}>
                <option value="">Select member...</option>
                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Book</label>
              <select value={form.book_id} onChange={e => setForm({...form, book_id: e.target.value})}>
                <option value="">Select book...</option>
                {books.filter(b => b.quantity > 0).map(b => (
                  <option key={b.id} value={b.id}>{b.title} (qty: {b.quantity})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input type="date" min={today} value={form.due_date} onChange={e => setForm({...form, due_date: e.target.value})} />
            </div>
            <div className="modal-actions">
              <button className="btn btn-cancel" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={borrow}>Confirm Borrow</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  )
}
