import React from 'react';
import './Header.css'; // We'll create this CSS file later

function Header() {
  return (
    <header className="app-header">
      <nav>
        <ul>
          <li><a href="/">Dashboard</a></li>
          <li><a href="/helper-admin">Helper Admin</a></li>
          <li><a href="/chat-monitor">Chat Monitor</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
