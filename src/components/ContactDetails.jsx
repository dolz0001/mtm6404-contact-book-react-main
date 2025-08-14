// src/components/ContactDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../db';
import './ContactDetails.css';

function ContactDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchContact();
  }, [id]);

  const fetchContact = async () => {
    try {
      const docRef = doc(db, 'contacts', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setContact({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.log('No such document!');
        navigate('/');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contact:', error);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'contacts', id));
      navigate('/');
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading contact details...</div>;
  }

  if (!contact) {
    return <div className="error">Contact not found</div>;
  }

  return (
    <div className="contact-details-container">
      <div className="details-header">
        <Link to="/" className="back-link">← Contacts</Link>
        <Link to={`/edit/${id}`} className="edit-link">Edit</Link>
      </div>
      
      <h1>{contact.lastName} {contact.firstName}</h1>
      
      <div className="contact-info">
        {contact.email && (
          <div className="info-group">
            <label>Email</label>
            <a href={`mailto:${contact.email}`} className="email-link">
              {contact.email}
            </a>
          </div>
        )}
        
        {contact.phone && (
          <div className="info-group">
            <label>Phone</label>
            <p>{contact.phone}</p>
          </div>
        )}
        
        {(contact.street || contact.city || contact.province || contact.postal) && (
          <div className="info-group">
            <label>Address</label>
            {contact.street && <p>{contact.street}</p>}
            {(contact.city || contact.province || contact.postal) && (
              <p>
                {contact.city && `${contact.city}`}
                {contact.city && contact.province && ', '}
                {contact.province && `${contact.province}`}
                {(contact.city || contact.province) && contact.postal && ' '}
                {contact.postal && `${contact.postal}`}
              </p>
            )}
          </div>
        )}

        {contact.company && (
          <div className="info-group">
            <label>Company</label>
            <p>{contact.company}</p>
          </div>
        )}

        {contact.notes && (
          <div className="info-group">
            <label>Notes</label>
            <p>{contact.notes}</p>
          </div>
        )}
      </div>

      <button onClick={() => setShowDeleteConfirm(true)} className="delete-button">
        Delete Contact
      </button>

      {showDeleteConfirm && (
        <div className="delete-confirm">
          <p>Are you sure you want to delete this contact?</p>
          <div className="confirm-buttons">
            <button onClick={handleDelete} className="confirm-yes">Yes, Delete</button>
            <button onClick={() => setShowDeleteConfirm(false)} className="confirm-no">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContactDetails;