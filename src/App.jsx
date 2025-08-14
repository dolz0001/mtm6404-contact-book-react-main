// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import ContactList from './components/ContactList';
import ContactDetails from './components/ContactDetails';
import ContactForm from './components/ContactForm';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ContactList />} />
          <Route path="/contact/:id" element={<ContactDetails />} />
          <Route path="/new" element={<ContactForm />} />
          <Route path="/edit/:id" element={<ContactForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;