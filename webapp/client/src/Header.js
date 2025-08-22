import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import './Header.css'; // We'll create this CSS file later

function Header() {
  return (
    <header className="app-header">
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/processes">Process Management</Link></li>
          <li><Link to="/helpers">Helper Admin</Link></li>
          <li><Link to="/chat">Chat</Link></li>
          <li><Link to="/users">User Management</Link></li> {/* New link for User Management */}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
