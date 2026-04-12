import { useEffect, useState } from 'react'
import axios from 'axios'

const API = 'http://13.51.167.24:5000/api/members'
const empty = { name: '', email: '', phone: '', address: '' }

export default function Members() {
  const [members, setMembers] = useState([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState(null)
  const [toast, setToast] = useState(null)

  const load = () => axios.get(API).then(r => setMembers(r.data))
  useEffect(() => { load() }, [])

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const openAdd = () => { setForm(empty); setEditing(null); setModal(true) }
  const openEdit = (m) => { setForm(m); setEditing(m.id); setModal(true) }
  const closeModal = () => setModal(false)

  const save = async () => {
    try {
      if (editing) {
        await axios.put(`${API}/${editing}`, form)
        showToast('Member updated')
      } else {
        await axios.post(API, form)
        showToast('Member added')
      }
      load(); closeModal()
    } catch (e) {
      showToast(e.response?.data?.error || 'Error', 'error')
    }
  }

  const del = async (id) => {
    if (!confirm('Delete this member?')) return
    await axios.delete(`${API}/${id}`)
    showToast('Member deleted'); load()
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Members</h2>
          <p className="page-subtitle">{members.length} registered members</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Member</button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Address</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {members.length === 0 && (
              <tr><td colSpan="6"><div className="empty-state">No members yet.</div></td></tr>
            )}
            {members.map(m => (
              <tr key={m.id}>
                <td style={{color:'var(--text-muted)'}}>{m.id}</td>
                <td><strong>{m.name}</strong></td>
                <td>{m.email}</td>
                <td>{m.phone || '—'}</td>
                <td>{m.address || '—'}</td>
                <td>
                  <div className="actions-cell">
                    <button className="btn btn-edit" onClick={() => openEdit(m)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => del(m.id)}>Delete</button>
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
            <h2>{editing ? 'Edit Member' : 'Add New Member'}</h2>
            {[['name','Full Name'],['email','Email'],['phone','Phone'],['address','Address']].map(([k,l]) => (
              <div className="form-group" key={k}>
                <label>{l}</label>
                <input value={form[k] || ''} onChange={e => setForm({...form,[k]:e.target.value})} />
              </div>
            ))}
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
