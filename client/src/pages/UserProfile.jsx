import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faEdit, 
  faSave, 
  faTimes,
  faLock
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import '../UserProfile.css'; // We'll create this CSS file next

const UserProfile = () => {
  const [user, setUser] = useState({
    id: '',
    username: '',
    email: '',
    mobile: '',
    userType: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempUser, setTempUser] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
        try {
          const storedData = JSON.parse(sessionStorage.getItem('userData'));
          if (!storedData?.isLoggedIn) {
            navigate('/login');
            return;
          }
      
          // Update this line to use port 3300
          const response = await axios.get(`http://localhost:3300/api/users/${storedData.userData.id}`, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
            }
          });
      
          setUser(response.data.user);
        } catch (err) {
          console.error('Error fetching user data:', err);
          setError('Failed to load user data');
        }
      };
    fetchUserData();
  }, [navigate]);

  const handleEdit = () => {
    setTempUser({ ...user });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    // Basic validation
    if (!tempUser.username || !tempUser.email) {
      setError('Username and email are required');
      return;
    }

    try {
      const response = await axios.put(
        `/api/users/${user.id}`,
        {
          username: tempUser.username,
          email: tempUser.email,
          mobile: tempUser.mobile
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
          }
        }
      );

      setUser(response.data.user);
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
      setError('');

      // Update session storage if needed
      const storedData = JSON.parse(sessionStorage.getItem('userData'));
      sessionStorage.setItem('userData', JSON.stringify({
        ...storedData,
        userData: response.data.user
      }));

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const renderField = (label, value, name, icon, type = 'text') => {
    return (
      <div className="profile-field">
        <div className="field-label">
          <FontAwesomeIcon icon={icon} className="field-icon" />
          <span>{label}</span>
        </div>
        {isEditing ? (
          <input
            type={type}
            name={name}
            value={tempUser[name] || ''}
            onChange={handleChange}
            className="edit-input"
          />
        ) : (
          <div className="field-value">{value || 'Not provided'}</div>
        )}
      </div>
    );
  };

  return (
    <div className="user-profile-container">
      <div className="profile-header">
        <h2>
          <FontAwesomeIcon icon={faUser} className="header-icon" />
          User Profile
        </h2>
        {user.userType === 'admin' && (
          <span className="admin-badge">Administrator</span>
        )}
        {user.userType === 'agent' && (
          <span className="agent-badge">Agent</span>
        )}
      </div>

      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <div className="profile-card">
        <div className="profile-section">
          {renderField('Username', user.username, 'username', faUser)}
          {renderField('Email', user.email, 'email', faEnvelope, 'email')}
          {renderField('Phone', user.mobile, 'mobile', faPhone, 'tel')}
          <div className="profile-field">
            <div className="field-label">
              <FontAwesomeIcon icon={faLock} className="field-icon" />
              <span>Account Type</span>
            </div>
            <div className="field-value">
              {user.userType?.charAt(0).toUpperCase() + user.userType?.slice(1)}
            </div>
          </div>
        </div>

        <div className="profile-actions">
          {isEditing ? (
            <>
              <button onClick={handleSave} className="btn save-btn">
                <FontAwesomeIcon icon={faSave} /> Save Changes
              </button>
              <button onClick={handleCancel} className="btn cancel-btn">
                <FontAwesomeIcon icon={faTimes} /> Cancel
              </button>
            </>
          ) : (
            <button onClick={handleEdit} className="btn edit-btn">
              <FontAwesomeIcon icon={faEdit} /> Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Additional sections can be added here */}
      <div className="profile-extra">
        <button 
          className="btn secondary-btn"
          onClick={() => navigate('/change-password')}
        >
          Change Password
        </button>
      </div>
    </div>
  );
};

export default UserProfile;