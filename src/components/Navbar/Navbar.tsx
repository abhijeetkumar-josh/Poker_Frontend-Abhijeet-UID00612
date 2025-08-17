import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../../store/store";
import { logout } from "../../store/authSlice";
import "./Navbar.css";

const Navbar = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="navbar">
      <div className="nav-left">
        <img
          src="src/assets/jtg_logo.png" 
          alt="Company Logo"
          className="nav-logo"
        />
        <span className="company-name">MyApp</span>
      </div>

      <ul className="nav-links">
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        <li>
          <button onClick={handleLogout} className="nav-button">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
