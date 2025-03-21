import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../App';
import ThemeToggle from './ThemeToggle';
import CategoryFilter from './CategoryFilter';
import { FaHome, FaUpload, FaUser, FaUsers } from 'react-icons/fa';
import AuthModal from './AuthModal'; // Import the new AuthModal component
import RegisterClientModal from './RegisterClientModal'; // Import the new RegisterClientModal component

const Header = ({ onSearch, setIsSearching }) => {
  const { theme } = useContext(ThemeContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); // State for AuthModal
  const [isRegisterClientModalOpen, setIsRegisterClientModalOpen] = useState(false); // State for AuthModal
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('accessToken');
  const userRole = localStorage.getItem('role');
  const currentUser = JSON.parse(localStorage.getItem('user'));
  // Ref for the dropdown container
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null); // <-- Create a ref for the input field

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query); // ✅ Update state
    setIsSearching(query.trim() !== '');
    onSearch(query); // Pass the search query to the parent component
  };

  const clearSearch = () => {
    setSearchQuery(''); // <-- Reset state properly
    setIsSearching(false); // Reset search state
    onSearch(''); // Notify parent component

    if (searchInputRef.current) {
      searchInputRef.current.value = ''; // <-- Ensure input field clears
    }
  };

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false); // Close the dropdown
      }
    };

    // Add event listener when the dropdown is open
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    clearSearch();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
    navigate('/');
    // navigate('/login');
  };

  const registerClient = () => {
    setIsRegisterClientModalOpen(true);
  };

  const goHome = () => {
    navigate('/');
  };

  const handleLinkClick = (e, destination) => {
    e.preventDefault(); // Prevent default Link navigation
    
    clearSearch(); // Clear the search input
    navigate(destination); // Manually navigate to the target link
  };

  return (
    <header className={`header ${theme}`}>
      <div className="header-top">
        <div className="search-bar">
          <Link
            onClick={(e) => handleLinkClick(e, '/')}
            className={`home-button ${theme}`}
          >
            <span>Home</span> <FaHome className="fa-home" />
          </Link>
          <input
            ref={searchInputRef} // <-- Attach ref to input
            type="text"
            placeholder="Search photos..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="header-icons">
          {isLoggedIn && userRole === 'publisher' && (
            <Link
              onClick={(e) => handleLinkClick(e, '/users')}
              className="users-icon"
            >
              <FaUsers className="fa-users" /> Users
            </Link>
          )}
          {isLoggedIn && userRole === 'publisher' && (
            <Link
              onClick={(e) => handleLinkClick(e, '/upload')}
              className="upload-icon"
            >
              <FaUpload className="fa-upload" /> Upload
            </Link>
          )}
          <ThemeToggle />
          <div
            className="user-icon"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            ref={dropdownRef} // Attach the ref to the dropdown container
          >
            {isLoggedIn?(
              // <FaUser className="fa-user" />
              <img src={currentUser?.avatar??`${process.env.REACT_APP_API_URL.replace('/api', '')}/uploads/1739646618439-ai-generated-7832244_1280.jpg`} alt={currentUser?.username} className="user-avatar" />
            ):(<FaUser className="fa-user" />)}
            {isLoggedIn?currentUser?.username:''}
            {/* {isDropdownOpen && (
              <div className="dropdown">
                {isLoggedIn ? (
                  <button onClick={handleLogout}>Logout</button>
                ) : (
                  <>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                  </>
                )}
              </div>
            )} */}
            {isDropdownOpen && (
              <div className="dropdown">
                {isLoggedIn ? (
                  userRole === 'publisher' ? (
                    <>
                      <button onClick={() => setIsRegisterClientModalOpen(true)}>Register Client</button>
                      <button onClick={handleLogout}>Logout</button>
                    </>
                  ) : (
                    <button onClick={handleLogout}>Logout</button>
                  )
                ) : (
                  <button onClick={() => setIsAuthModalOpen(true)}>Login/Register</button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <CategoryFilter clearSearch={clearSearch}/>
      {/* Auth Modal */}
      {isAuthModalOpen && (
        <AuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}
      {/* Register Client Modal */}
      {isRegisterClientModalOpen && (
        <RegisterClientModal onClose={() => setIsRegisterClientModalOpen(false)} />
      )}
    </header>
  );
};

export default Header;