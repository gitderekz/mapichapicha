import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Photos from './pages/Photos';
import Upload from './pages/Upload';
import Users from './pages/Users';
import Register from './pages/Register';
import './App.css';
import './theme.css';
import SponsorRow from './components/SponsorRow';
import api from './api'; // Add this import

export const ThemeContext = React.createContext();

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [photos, setPhotos] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
      const fetchPhotos = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/photos/home`);
          setPhotos(response.data);
        } catch (error) {
          console.error('Error fetching photos:', error);
        }
      };

      // // Replace axios.get with api.get
      // const fetchPhotos = async () => {
      //   try {
      //     const response = await api.get('/photos/home');
      //     setPhotos(response.data);
      //   } catch (error) {
      //     console.error('Error fetching photos:', error);
      //   }
      // };
      fetchPhotos();
    }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Filter photos based on the search query
  const filteredPhotos = photos.filter((photo) =>
    photo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`app ${theme}`}>
        <Router>
          <Header onSearch={handleSearch} setIsSearching={setIsSearching} />
          <div className="main-content">
            <SponsorRow />
            <Routes>
              <Route path="/" element={<Home photos={filteredPhotos} />} />
              <Route path="/photos" element={<Photos filteredPhotos={isSearching?filteredPhotos:null} isSearching={isSearching} />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/users" element={<Users />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </div>
          <Footer />
        </Router>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;