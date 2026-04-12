import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Dashboard() {
  const [stats, setStats] = useState({ books: 0, members: 0, borrows: 0, active: 0 })

  useEffect(() => {
    Promise.all([
      axios.get('http://13.51.167.24:5000/api/books'),
      axios.get('http://13.51.167.24:5000/api/members'),
      axios.get('http://13.51.167.24:5000/api/borrows'),
    ]).then(([b, m, br]) => {
      const active = br.data.filter(r => r.status === 'borrowed').length
      setStats({ books: b.data.length, members: m.data.length, borrows: br.data.length, active })
    }).catch(() => {})
  }, [])

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Dashboard</h2>
          <p className="page-subtitle">Overview of your library</p>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Total Books</div>
          <div className="stat-value">{stats.books}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Members</div>
          <div className="stat-value">{stats.members}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Borrows</div>
          <div className="stat-value">{stats.active}</div>
        </div>
      </div>

      <div className="table-wrap" style={{padding: '32px', textAlign: 'center', color: 'var(--text-muted)'}}>
        <p style={{fontFamily: 'Playfair Display, serif', fontSize: '18px', color: 'var(--gold)', marginBottom: '8px'}}>
          Welcome to Libra
        </p>
        <p style={{fontSize: '14px'}}>Use the sidebar to manage books, members, and borrow records.</p>
      </div>
    </div>
  )
}
