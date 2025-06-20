// file: src/pages/Profile.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // Create axios instance with default headers
        const axiosInstance = axios.create({
          headers: { Authorization: `Bearer ${token}` }
        });

        // Fetch user data and progress simultaneously
        const [userRes, progressRes] = await Promise.all([
          axiosInstance.get('http://161.35.18.245:8000/users/me'),
          axiosInstance.get('http://161.35.18.245:8000/progress/user-progress')
        ]);

        setUser(userRes.data);
        setProgress(progressRes.data);
        setIsLoading(false);

      } catch (err) {
        console.error('Profile fetch error:', err);
        
        // Clear token if it's invalid
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('username');
        }
        
        navigate('/login');
      }
    };

    fetchData();
  }, [navigate]);

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await axios({
        method: 'delete',
        url: 'http://161.35.18.245:8000/users/me',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('username');

      // Show success message before redirecting
      alert('Account deleted successfully');

      // Navigate to login page
      navigate('/login');
    } catch (err) {
      console.error('Delete account error:', err);
      alert(`Failed to delete account: ${err.response?.data?.detail || 'Unknown error'}`);
    }
};

  if (isLoading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        <h1>👤 {user?.username}</h1>
        <p>Email: {user?.email}</p>
        
        {/* Delete Account Button */}
        <button
          className="delete-account-btn"
          onClick={() => setShowConfirmDialog(true)}
          style={{
            backgroundColor: '#dc2626',
            marginTop: '20px'
          }}
        >
          Delete Account
        </button>
      </div>

      {/* Progress section remains the same */}
      <div className="progress-section">
        <h2>📚 Your Progress</h2>
        {progress.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          <div className="progress-list">
            {progress.map((entry) => {
              const isComplete = Boolean(entry.status);
              return (
                <div
                  key={entry.id}
                  className={`progress-item ${isComplete ? 'complete' : 'incomplete'}`}
                >
                  <h3>Task #{entry.task_id}</h3>
                  <p>
                    Status: {isComplete ? '✅ Complete' : '🕓 Incomplete'}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="confirm-dialog-overlay">
          <div className="confirm-dialog">
            <h2>Delete Account</h2>
            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
            <div className="confirm-dialog-buttons">
              <button
                onClick={() => handleDeleteAccount()}
                style={{ backgroundColor: '#dc2626' }}
              >
                Yes, Delete Account
              </button>
              <button
                onClick={() => setShowConfirmDialog(false)}
                style={{ backgroundColor: '#4b5563' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;