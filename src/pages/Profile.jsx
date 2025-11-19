// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { 
  updateProfile, 
  updateEmail, 
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser
} from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  deleteDoc,
  doc 
} from 'firebase/firestore';
import { ref, deleteObject, listAll } from 'firebase/storage';
import { auth, db, storage } from '../services/firebase';
import '../styles/Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [stats, setStats] = useState({
    filesUploaded: 0,
    analysesPerformed: 0,
    chartsCreated: 0
  });

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    displayName: '',
    email: '',
    photoURL: ''
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Reauthentication state
  const [reauthenticateForm, setReauthenticateForm] = useState({
    password: '',
    show: false,
    action: '' // 'email', 'password', 'delete'
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (auth.currentUser) {
      const currentUser = auth.currentUser;
      setUser(currentUser);
      setProfileForm({
        displayName: currentUser.displayName || '',
        email: currentUser.email || '',
        photoURL: currentUser.photoURL || ''
      });
      fetchUserStats();
    }
  }, []);

  const fetchUserStats = async () => {
    try {
      // Mock stats for demonstration - in real app, you'd query Firestore
      setStats({
        filesUploaded: 12,
        analysesPerformed: 8,
        chartsCreated: 15
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const reauthenticate = async (password) => {
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const updates = {};
      
      if (profileForm.displayName !== user.displayName) {
        updates.displayName = profileForm.displayName;
      }
      
      if (profileForm.photoURL !== user.photoURL) {
        updates.photoURL = profileForm.photoURL;
      }

      if (Object.keys(updates).length > 0) {
        await updateProfile(user, updates);
        setUser({ ...user, ...updates });
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      }

      if (profileForm.email !== user.email) {
        setReauthenticateForm({
          show: true,
          password: '',
          action: 'email'
        });
        return;
      }

    } catch (error) {
      setMessage({ type: 'error', text: getErrorMessage(error.code) });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailUpdate = async () => {
    try {
      await updateEmail(user, profileForm.email);
      setUser({ ...user, email: profileForm.email });
      setReauthenticateForm({ show: false, password: '', action: '' });
      setMessage({ type: 'success', text: 'Email updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: getErrorMessage(error.code) });
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        throw new Error('passwords-do-not-match');
      }

      setReauthenticateForm({
        show: true,
        password: '',
        action: 'password'
      });
    } catch (error) {
      setMessage({ type: 'error', text: getErrorMessage(error.code) });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdateConfirm = async () => {
    try {
      await updatePassword(user, passwordForm.newPassword);
      setReauthenticateForm({ show: false, password: '', action: '' });
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setMessage({ type: 'success', text: 'Password updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: getErrorMessage(error.code) });
    }
  };

  const handleReauthenticate = async () => {
    setLoading(true);
    try {
      await reauthenticate(reauthenticateForm.password);
      
      switch (reauthenticateForm.action) {
        case 'email':
          await handleEmailUpdate();
          break;
        case 'password':
          await handlePasswordUpdateConfirm();
          break;
        case 'delete':
          await handleAccountDelete();
          break;
        default:
          break;
      }
    } catch (error) {
      setMessage({ type: 'error', text: getErrorMessage(error.code) });
    } finally {
      setLoading(false);
    }
  };

  const handleAccountDelete = async () => {
    try {
      // Delete user data from Firestore
      const filesQuery = query(
        collection(db, 'userFiles'),
        where('userId', '==', user.uid)
      );
      const filesSnapshot = await getDocs(filesQuery);
      const deletePromises = filesSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      // Delete user files from Storage
      const storageRef = ref(storage, `users/${user.uid}`);
      const fileList = await listAll(storageRef);
      const deleteFilePromises = fileList.items.map(item => deleteObject(item));
      await Promise.all(deleteFilePromises);

      // Delete user account
      await deleteUser(user);
      
      setMessage({ type: 'success', text: 'Account deleted successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: getErrorMessage(error.code) });
    }
  };

  const requestAccountDelete = () => {
    setReauthenticateForm({
      show: true,
      password: '',
      action: 'delete'
    });
  };

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/email-already-in-use':
        return 'This email is already in use.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/wrong-password':
        return 'Current password is incorrect.';
      case 'auth/requires-recent-login':
        return 'Please reauthenticate to perform this action.';
      case 'passwords-do-not-match':
        return 'New passwords do not match.';
      default:
        return 'An error occurred. Please try again.';
    }
  };

  if (!user) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="container">
        <div className="profile-header">
          <h1>User Profile</h1>
          <p>Manage your account settings and preferences</p>
        </div>

        <div className="profile-content">
          <div className="profile-sidebar">
            <div className="user-card">
              <div className="user-avatar-large">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} />
                ) : (
                  <div className="avatar-fallback-large">
                    {user.displayName ? user.displayName[0].toUpperCase() : user.email[0].toUpperCase()}
                  </div>
                )}
              </div>
              <div className="user-info">
                <h3>{user.displayName || 'User'}</h3>
                <p>{user.email}</p>
                <div className="member-since">
                  Member since {new Date(user.metadata.creationTime).toLocaleDateString()}
                </div>
              </div>
            </div>

            <nav className="profile-nav">
              <button 
                className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                📝 Profile Information
              </button>
              <button 
                className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                🔒 Security
              </button>
              <button 
                className={`nav-item ${activeTab === 'stats' ? 'active' : ''}`}
                onClick={() => setActiveTab('stats')}
              >
                📊 Usage Statistics
              </button>
              <button 
                className={`nav-item ${activeTab === 'danger' ? 'active' : ''}`}
                onClick={() => setActiveTab('danger')}
              >
                ⚠️ Danger Zone
              </button>
            </nav>
          </div>

          <div className="profile-main">
            {message.text && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="tab-content">
                <h2>Profile Information</h2>
                <form onSubmit={handleProfileUpdate} className="profile-form">
                  <div className="form-group">
                    <label htmlFor="displayName">Display Name</label>
                    <input
                      type="text"
                      id="displayName"
                      value={profileForm.displayName}
                      onChange={(e) => setProfileForm({...profileForm, displayName: e.target.value})}
                      placeholder="Enter your display name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="photoURL">Profile Photo URL</label>
                    <input
                      type="url"
                      id="photoURL"
                      value={profileForm.photoURL}
                      onChange={(e) => setProfileForm({...profileForm, photoURL: e.target.value})}
                      placeholder="https://example.com/photo.jpg"
                    />
                  </div>

                  <button type="submit" disabled={loading} className="save-btn">
                    {loading ? 'Updating...' : 'Update Profile'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="tab-content">
                <h2>Security Settings</h2>
                <form onSubmit={handlePasswordUpdate} className="security-form">
                  <div className="form-group">
                    <label htmlFor="currentPassword">Current Password</label>
                    <input
                      type="password"
                      id="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                      placeholder="Enter current password"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      placeholder="Enter new password"
                      minLength="6"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      placeholder="Confirm new password"
                      minLength="6"
                    />
                  </div>

                  <button type="submit" disabled={loading} className="save-btn">
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="tab-content">
                <h2>Usage Statistics</h2>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">📁</div>
                    <div className="stat-info">
                      <h3>{stats.filesUploaded}</h3>
                      <p>Files Uploaded</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">🤖</div>
                    <div className="stat-info">
                      <h3>{stats.analysesPerformed}</h3>
                      <p>AI Analyses</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">📈</div>
                    <div className="stat-info">
                      <h3>{stats.chartsCreated}</h3>
                      <p>Charts Created</p>
                    </div>
                  </div>
                </div>

                <div className="recent-activity">
                  <h3>Recent Activity</h3>
                  <div className="activity-list">
                    <div className="activity-item">
                      <span className="activity-icon">📊</span>
                      <div className="activity-details">
                        <p>Created sales analysis chart</p>
                        <span className="activity-time">2 hours ago</span>
                      </div>
                    </div>
                    <div className="activity-item">
                      <span className="activity-icon">🤖</span>
                      <div className="activity-details">
                        <p>Generated AI insights for customer data</p>
                        <span className="activity-time">1 day ago</span>
                      </div>
                    </div>
                    <div className="activity-item">
                      <span className="activity-icon">📁</span>
                      <div className="activity-details">
                        <p>Uploaded quarterly_report.xlsx</p>
                        <span className="activity-time">2 days ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'danger' && (
              <div className="tab-content">
                <h2>Danger Zone</h2>
                <div className="danger-zone">
                  <div className="danger-item">
                    <div className="danger-info">
                      <h4>Delete Account</h4>
                      <p>Permanently delete your account and all associated data. This action cannot be undone.</p>
                    </div>
                    <button 
                      onClick={requestAccountDelete}
                      className="delete-account-btn"
                    >
                      Delete Account
                    </button>
                  </div>
                  
                  <div className="danger-item">
                    <div className="danger-info">
                      <h4>Export Data</h4>
                      <p>Download all your data including uploaded files and analysis results.</p>
                    </div>
                    <button className="export-btn">
                      Export Data
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reauthentication Modal */}
      {reauthenticateForm.show && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Reauthentication Required</h3>
            <p>Please enter your current password to continue.</p>
            
            <div className="form-group">
              <input
                type="password"
                value={reauthenticateForm.password}
                onChange={(e) => setReauthenticateForm({...reauthenticateForm, password: e.target.value})}
                placeholder="Enter your current password"
              />
            </div>

            <div className="modal-actions">
              <button 
                onClick={() => setReauthenticateForm({ show: false, password: '', action: '' })}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button 
                onClick={handleReauthenticate}
                disabled={loading || !reauthenticateForm.password}
                className="confirm-btn"
              >
                {loading ? 'Verifying...' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;