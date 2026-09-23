import { Link } from 'react-router-dom';

const supportLinks = [
  ['#help-center', 'Help Center'],
  ['#faq', 'FAQ'],
  ['#contact', 'Contact'],
  ['#about', 'About'],
];

const socialLinks = [
  ['#social-x', 'X'],
  ['#social-instagram', 'ig'],
  ['#social-youtube', 'yt'],
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand-block">
          <Link to="/" className="footer-brand">Stream<span>Local</span></Link>
          <p>Your local streaming experience.</p>
          <div className="footer-socials" aria-label="Social media links">
            {socialLinks.map(([href, label]) => <a key={href} href={href} aria-label={`StreamLocal on ${label}`}>{label}</a>)}
          </div>
        </div>

        <nav className="footer-column" aria-label="Explore">
          <h2>Explore</h2>
          <Link to="/">Home</Link>
          <Link to="/movies">Movies</Link>
          <Link to="/series">Series</Link>
          <Link to="/my-list">My List</Link>
        </nav>

        <nav className="footer-column" aria-label="Support and information">
          <h2>Support</h2>
          {supportLinks.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </nav>

        <nav className="footer-column" aria-label="Account">
          <h2>Account</h2>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/subscription">Subscription</Link>
        </nav>
      </div>

      <div className="footer-bottom">
        <span>© 2026 StreamLocal. All rights reserved.</span>
        <div className="footer-legal">
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
          <a href="#cookies">Cookies</a>
        </div>
      </div>
    </footer>
  );
}
