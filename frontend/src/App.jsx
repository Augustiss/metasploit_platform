import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import './styles/App.css';
import Login from './pages/Login.jsx';
import Profile from './pages/Profile.jsx';
import Theory from './pages/Theory/Theory.jsx';
import Chapter from "./pages/Theory/Chapter";


function App() {
  const createUser = async ({ username, email, password }) => {
    console.log('Creating user:', { username, email, password });
    return 'User created!';
  };

  const isAuthenticated = !!localStorage.getItem('token'); // Check for a valid token.

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/profile"
            element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
          />
          <Route path="/theory" element={<Theory />} />
          <Route path="/chapter/:chapterId" element={<Chapter />} />
          <Route path="/register" element={<Register onRegister={createUser} />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;