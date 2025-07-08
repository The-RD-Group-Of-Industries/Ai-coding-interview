import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaChartLine, FaUserTie, FaUsers, FaFileAlt } from 'react-icons/fa';
import { RiUserLine } from 'react-icons/ri';

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-brand">
          AI Interview Admin
        </div>
        
        <div className="sidebar-menu">
          <ul className="nav flex-column">
            <li className="nav-item">
              <a 
                href="/" 
                className="nav-link active"
              >
                <FaChartLine className="nav-icon" />
                <span>Dashboard</span>
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="/interviews" 
                className="nav-link"
              >
                <FaUserTie className="nav-icon" />
                <span>Interviews</span>
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="/submissions" 
                className="nav-link"
              >
                <FaFileAlt className="nav-icon" />
                <span>Submissions</span>
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="/users" 
                className="nav-link"
              >
                <FaUsers className="nav-icon" />
                <span>Users</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Topbar */}
      <div className="topbar">
        <div className="user-menu">
          <div className="user-info">
            <div className="user-icon">
              <RiUserLine />
            </div>
            <span className="user-name">{user?.name || 'Admin'}</span>
          </div>
          <button 
            className="logout-btn"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}