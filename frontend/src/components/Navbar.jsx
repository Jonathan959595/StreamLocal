import { NavLink, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authService } from '../services/api';
import { clearSession } from '../redux/store';

const links = [['/', 'Home'], ['/movies', 'Movies'], ['/series', 'Series'], ['/my-list', 'My List']];
export default function Navbar() {
  const [solid, setSolid] = useState(false); const [open, setOpen] = useState(false); const [accountOpen, setAccountOpen] = useState(false);
  const dispatch = useDispatch(); const session = useSelector((state) => state.auth);
  useEffect(() => { const update = () => setSolid(scrollY > 32); addEventListener('scroll', update); return () => removeEventListener('scroll', update); }, []);
  const signOut = async () => { try { await authService.logout(); } catch {} finally { dispatch(clearSession()); setAccountOpen(false); } };
  return <header className={`navbar ${solid ? 'navbar-solid' : ''}`}>
    <Link to="/" className="brand">Stream<span>Local</span></Link>
    <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open}>☰</button>
    <nav className={open ? 'nav-open' : ''}>{links.map(([to, name]) => <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)}>{name}</NavLink>)}</nav>
    <Link className="nav-search" to="/search" aria-label="Search StreamLocal">⌕</Link>
    <div className="account-menu">
      <button className="avatar" type="button" onClick={() => setAccountOpen(!accountOpen)} aria-label="Open account menu" aria-expanded={accountOpen} aria-haspopup="menu">J</button>
      {accountOpen && <div className="account-dropdown" role="menu">
        {session ? <>
          <Link to="/profiles" role="menuitem" onClick={() => setAccountOpen(false)}>Profiles</Link>
          <Link to="/my-list" role="menuitem" onClick={() => setAccountOpen(false)}>My List</Link>
          <Link to="/subscription" role="menuitem" onClick={() => setAccountOpen(false)}>Subscription</Link>
          <button type="button" role="menuitem" onClick={signOut}>Sign Out</button>
        </> : <>
          <Link to="/login" role="menuitem" onClick={() => setAccountOpen(false)}>Sign In</Link>
          <Link to="/register" role="menuitem" onClick={() => setAccountOpen(false)}>Sign Up</Link>
        </>}
      </div>}
    </div>
  </header>;
}
