import { NavLink, Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authService } from '../services/api';
import { clearSession, setSelectedProfile } from '../redux/store';

const links = [
  ['/', 'Home'],
  ['/movies', 'Movies'],
  ['/series', 'Series'],
  ['/my-list', 'My List'],
];

export default function Navbar() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const menuRef = useRef(null);

  const dispatch = useDispatch();
  const session = useSelector((state) => state.auth);
  const profiles = session?.user?.profiles || [];
  const profile =
    profiles.find((entry) => entry.profileId === session?.selectedProfileId) ||
    profiles[0];

  useEffect(() => {
    const update = () => setSolid(window.scrollY > 32);
    window.addEventListener('scroll', update);
    return () => window.removeEventListener('scroll', update);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    };
    if (accountOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [accountOpen]);

  const signOut = async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore logout errors
    } finally {
      dispatch(clearSession());
      setAccountOpen(false);
    }
  };

  const handleSwitchProfile = (profileId) => {
    dispatch(setSelectedProfile(profileId));
    setAccountOpen(false);
  };

  const avatarDisplay = profile
    ? profile.avatar || (profile.isKids ? '★' : profile.name?.charAt(0).toUpperCase())
    : '👤';

  return (
    <header className={`navbar ${solid ? 'navbar-solid' : ''}`}>
      <Link to="/" className="brand">
        Stream<span>Local</span>
      </Link>
      <button
        className="menu-button"
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation"
        aria-expanded={open}
      >
        ☰
      </button>
      <nav className={open ? 'nav-open' : ''}>
        {links.map(([to, name]) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={() => setOpen(false)}
          >
            {name}
          </NavLink>
        ))}
      </nav>
      <Link className="nav-search" to="/search" aria-label="Search StreamLocal">
        ⌕
      </Link>
      <div className="account-menu" ref={menuRef}>
        <button
          className={`avatar ${profile?.isKids ? 'kids' : ''} ${!session ? 'logged-out' : ''}`}
          type="button"
          onClick={() => setAccountOpen(!accountOpen)}
          aria-label="Open account menu"
          aria-expanded={accountOpen}
          aria-haspopup="menu"
        >
          {avatarDisplay}
        </button>
        {accountOpen && (
          <div className="account-dropdown" role="menu">
            {session ? (
              <>
                <div className="account-dropdown-header">
                  <span className={`account-dropdown-avatar ${profile?.isKids ? 'kids' : ''}`}>
                    {avatarDisplay}
                  </span>
                  <div className="account-dropdown-user">
                    <strong>{profile?.name || 'User'}</strong>
                    <small>{profile?.isKids ? 'Kids Profile' : session.user?.email || 'Active'}</small>
                  </div>
                </div>

                {profiles.length > 0 && (
                  <div className="account-dropdown-section">
                    <span className="account-dropdown-heading">Profiles</span>
                    {profiles.map((p) => {
                      const isSelected = p.profileId === session.selectedProfileId;
                      const icon = p.avatar || (p.isKids ? '★' : p.name?.charAt(0).toUpperCase());
                      return (
                        <button
                          key={p.profileId}
                          type="button"
                          className={`account-profile-item ${isSelected ? 'active' : ''}`}
                          onClick={() => handleSwitchProfile(p.profileId)}
                        >
                          <span className={`profile-mini-icon ${p.isKids ? 'kids' : ''}`}>
                            {icon}
                          </span>
                          <span className="profile-mini-name">{p.name}</span>
                          {isSelected && <span className="profile-mini-check">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="account-dropdown-divider" />
                <Link to="/profiles" role="menuitem" onClick={() => setAccountOpen(false)}>
                  Manage Profiles
                </Link>
                <Link to="/subscription" role="menuitem" onClick={() => setAccountOpen(false)}>
                  Subscription / View Plans
                </Link>
                <Link to="/my-list" role="menuitem" onClick={() => setAccountOpen(false)}>
                  My List
                </Link>
                <div className="account-dropdown-divider" />
                <button type="button" role="menuitem" className="signout-button" onClick={signOut}>
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" role="menuitem" onClick={() => setAccountOpen(false)}>
                  Sign In
                </Link>
                <Link to="/register" role="menuitem" onClick={() => setAccountOpen(false)}>
                  Create Account
                </Link>
                <Link to="/subscription" role="menuitem" onClick={() => setAccountOpen(false)}>
                  View Plans
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
