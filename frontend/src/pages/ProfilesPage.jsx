import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authService } from '../services/api';
import { setSelectedProfile, updateUser } from '../redux/store';

export default function ProfilesPage() {
  const session = useSelector((state) => state.auth);
  const [profiles, setProfiles] = useState(session?.user?.profiles || []);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [kids, setKids] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session?.token) {
      navigate('/login');
    }
  }, [session, navigate]);

  useEffect(() => {
    if (session?.user?.profiles) {
      setProfiles(session.user.profiles);
    }
  }, [session?.user?.profiles]);

  const select = (profile) => {
    dispatch(setSelectedProfile(profile.profileId));
    navigate('/');
  };

  const addProfile = async (event) => {
    event.preventDefault();
    if (!name.trim()) {
      setError('Please enter a profile name.');
      return;
    }
    setError('');
    try {
      const response = await authService.createProfile({
        name: name.trim(),
        isKids: kids,
        avatar: kids ? '★' : name.trim().charAt(0).toUpperCase(),
      });
      const updatedProfiles = response.data.profiles;
      setProfiles(updatedProfiles);
      dispatch(updateUser({ ...session.user, profiles: updatedProfiles }));
      setAdding(false);
      setName('');
      setKids(false);
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to create profile.');
    }
  };

  if (!session?.token) {
    return null;
  }

  return (
    <main className="profiles">
      <p className="eyebrow">StreamLocal</p>
      <h1>Who’s watching?</h1>
      <p className="profile-subtitle">Choose a profile to start watching.</p>

      <div className="profile-list">
        {profiles.map((profile) => {
          const isSelected = profile.profileId === session.selectedProfileId;
          return (
            <button
              type="button"
              className={`profile-tile ${profile.isKids ? 'kids' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => select(profile)}
              key={profile.profileId}
            >
              <b>{profile.avatar || (profile.isKids ? '★' : profile.name.charAt(0).toUpperCase())}</b>
              <span>{profile.name}</span>
            </button>
          );
        })}

        {profiles.length < 4 && (
          <button className="profile-tile add" onClick={() => setAdding(true)}>
            <b>+</b>
            <span>Add Profile</span>
          </button>
        )}
      </div>

      {adding && (
        <form className="profile-create" onSubmit={addProfile}>
          <label>
            Profile name
            <input autoFocus value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label>
            <input type="checkbox" checked={kids} onChange={(e) => setKids(e.target.checked)} />
            Kids profile
          </label>
          {error && <p className="form-message error">{error}</p>}
          <button className="button button-main">Create profile</button>
          <button type="button" className="button button-quiet" onClick={() => { setAdding(false); setError(''); }}>
            Cancel
          </button>
        </form>
      )}
    </main>
  );
}
