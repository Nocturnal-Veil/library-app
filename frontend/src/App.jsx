import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Books from './pages/Books.jsx'
import Members from './pages/Members.jsx'
import Borrows from './pages/Borrows.jsx'
import Dashboard from './pages/Dashboard.jsx'

function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <h1>Libra</h1>
            <span>Management System</span>
          </div>
          <nav className="sidebar-nav">
            <NavLink to="/" end className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">◈</span> Dashboard
            </NavLink>
            <NavLink to="/books" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">◧</span> Books
            </NavLink>
            <NavLink to="/members" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">◉</span> Members
            </NavLink>
            <NavLink to="/borrows" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">◎</span> Borrow Records
            </NavLink>
          </nav>
        </aside>
        <main className="main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/books" element={<Books />} />
            <Route path="/members" element={<Members />} />
            <Route path="/borrows" element={<Borrows />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
