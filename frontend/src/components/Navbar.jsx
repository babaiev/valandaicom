import { NavLink, Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ onSubscribeClick }) => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src="/logo.png" alt="VAL3R11 Logo" className="navbar-icon" />
          <span className="brand-text">
            <span className="logo-orange">VAL</span><span className="highlight">3R11</span>
          </span>
        </Link>
      </div>
      <ul className="navbar-links">
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/portfolio" className={({ isActive }) => (isActive ? 'active' : '')}>
            Portfolio
          </NavLink>
        </li>
        <li>
          <NavLink to="/newsfeed" className={({ isActive }) => (isActive ? 'active' : '')}>
            Newsfeed
          </NavLink>
        </li>
        <li>
          <NavLink to="/blog" className={({ isActive }) => (isActive ? 'active' : '')}>
            Blog
          </NavLink>
        </li>
        <li>
          <button className="subscribe-btn-nav" onClick={onSubscribeClick}>Subscribe</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
