import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchData = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.warn("No token in localStorage");
      return navigate('/login');
    }

    try {
      const [userRes, progressRes] = await Promise.all([
        axios.get('http://161.35.18.245:8000/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('http://161.35.18.245:8000/progress/user-progress', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setUser(userRes.data);
      setProgress(progressRes.data);
    } catch (err) {
      console.error("FETCH ERROR:", err);
      alert(`Error loading profile: ${err.response?.data?.detail || err.message}`);
      navigate('/login');
    }
  };

  fetchData();
}, [navigate]);


  if (!user) return <div className="profile-loading">Loading profile...</div>;

  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        <h1>👤 {user.username}</h1>
        <p>Email: {user.email}</p>
      </div>

      <div className="progress-section">
        <h2>📚 Your Progress</h2>
        {progress.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          <div className="progress-list">
            {progress.map((task) => (
              <div
                key={task.id}
                className={`progress-item ${
                  task.status === 1 ? 'complete' : 'incomplete'
                }`}
              >
                <h3>{task.task_name}</h3>
                <p>Status: {task.status === 1 ? '✅ Complete' : '🕓 Incomplete'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
