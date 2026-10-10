import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import SearchPage from './pages/SearchPage';
import MyListPage from './pages/MyListPage';
import DetailsPage from './pages/DetailsPage';
import ProfilesPage from './pages/ProfilesPage';
import PlayerPage from './pages/PlayerPage';
import AuthPage from './pages/AuthPage';
import SubscriptionPage from './pages/SubscriptionPage';

export default function App() {
    const location = useLocation();
    const session = useSelector((state) => state.auth);
    const focusedRoute = ['/login', '/register', '/profiles'].includes(location.pathname) || location.pathname.startsWith('/watch/');

    if (session?.token && !session.selectedProfileId && !['/profiles', '/login', '/register'].includes(location.pathname)) return <Navigate to="/profiles" replace />;

    return (
        <div className="app-shell">
            <Navbar />

            <Routes>
                <Route path="/" element={<HomePage />} />

                <Route
                    path="/movies"
                    element={<BrowsePage type="Movie" />}
                />

                <Route
                    path="/series"
                    element={<BrowsePage type="Series" />}
                />

                <Route
                    path="/search"
                    element={<SearchPage />}
                />

                <Route
                    path="/my-list"
                    element={<MyListPage />}
                />

                <Route
                    path="/details/:id"
                    element={<DetailsPage />}
                />

                <Route
                    path="/profiles"
                    element={<ProfilesPage />}
                />

                <Route
                    path="/watch/:id"
                    element={<PlayerPage />}
                />
                <Route path="/login" element={<AuthPage />} />
                <Route path="/register" element={<AuthPage mode="register" />} />
                <Route path="/subscription" element={<SubscriptionPage />} />
            </Routes>
            {!focusedRoute && <Footer />}
        </div>
    );
}
