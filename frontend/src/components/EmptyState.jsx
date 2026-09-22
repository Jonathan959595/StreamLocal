import { Link } from 'react-router-dom';
export default function EmptyState({ title, message, action = 'Explore content' }) { return <div className="empty-state"><div>◌</div><h2>{title}</h2><p>{message}</p><Link className="button button-main" to="/">{action}</Link></div>; }
