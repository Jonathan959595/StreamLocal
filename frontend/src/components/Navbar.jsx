import { NavLink, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const links = [['/', 'Home'], ['/movies', 'Movies'], ['/series', 'Series'], ['/my-list', 'My List']];
export default function Navbar() {
  const [solid, setSolid] = useState(false); const [open, setOpen] = useState(false);
  useEffect(() => { const update = () => setSolid(scrollY > 32); addEventListener('scroll', update); return () => removeEventListener('scroll', update); }, []);
  return <header className={`navbar ${solid ? 'navbar-solid' : ''}`}>
    <Link to="/" className="brand">Stream<span>Local</span></Link>
    <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle navigation">☰</button>
    <nav className={open ? 'nav-open' : ''}>{links.map(([to, name]) => <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)}>{name}</NavLink>)}</nav>
    <Link className="nav-search" to="/search" aria-label="Search">⌕</Link>
    <Link className="avatar" to="/profiles" aria-label="Choose profile">J</Link>
  </header>;
}
