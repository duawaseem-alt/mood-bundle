import React from "react";
import './navbar.css';
// import { FaUserCircle } from 'react-icons/fa'; // ✅ Make sure this import is here
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">MoodBundle</div>

      <ul className="navbar-links">
<li><Link to="/home">Dashboard</Link></li>
<li><Link to="/logmoods"> Moods</Link></li>
<li><Link to="/playlist">Playlist</Link></li>
<li><Link to="/yourcycle">Schedule</Link></li>
<li><Link to="/graph">Graph</Link></li>
<li><Link to="/upgrade">Upgrade</Link></li>    
        
              </ul>

      <div className="navbar-profile">
        {/* <FaUserCircle size={28} /> */}
      </div>
    </nav>
  );
};

export default Navbar;
