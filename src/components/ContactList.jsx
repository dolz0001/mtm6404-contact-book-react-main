// src/components/ContactList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../db';
import './ContactList.css';

function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    const filtered = contacts.filter(contact => {
      const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    });
    setFilteredContacts(filtered);
  }, [searchTerm, contacts]);

  const fetchContacts = async () => {
    try {
      const q = query(collection(db, 'contacts'), orderBy('lastName'))
      const querySnapshot = await getDocs(q);
      const contactsData = [];
      querySnapshot.forEach((doc) => {
        contactsData.push({ id: doc.id, ...doc.data() });
      });
      setContacts(contactsData);
      setFilteredContacts(contactsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading contacts...</div>;
  }

  return (
    <div className="contact-list-container">
      <div className="header">
        <h1>Contacts</h1>
        <Link to="/new" className="add-button">+</Link>
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="contacts-list">
        {filteredContacts.length === 0 ? (
          <div className="no-contacts">No contacts found</div>
        ) : (
          filteredContacts.map(contact => (
            <Link 
              to={`/contact/${contact.id}`} 
              key={contact.id} 
              className="contact-item"
            >
              {contact.lastName} {contact.firstName}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default ContactList;