import React from "react";
import "./SettingsPage.css";

const SettingsPage = () => {
  return (
    <div className="settings-container mt-5">
      <div className="settings-header">
        <h1>Settings</h1>
      </div>
      <form className="settings-form">
        <div className="settings-section">
          <h2>Account Settings</h2>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" />
          </div>
        </div>

        <div className="settings-section">
          <h2>Password Settings</h2>
          <div className="form-group">
            <label htmlFor="current-password">Current Password</label>
            <input
              type="password"
              id="current-password"
              name="current-password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="new-password">New Password</label>
            <input type="password" id="new-password" name="new-password" />
          </div>
        </div>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default SettingsPage;
