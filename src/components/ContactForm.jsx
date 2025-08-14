// src/components/ContactForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { doc, getDoc, addDoc, updateDoc, collection } from 'firebase/firestore';
import { db } from '../db';
import './ContactForm.css';

function ContactForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    province: '',
    postal: '',
    company: '',
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      fetchContact();
    }
  }, [id]);

  const fetchContact = async () => {
    try {
      const docRef = doc(db, 'contacts', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setFormData(docSnap.data());
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching contact:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      if (isEdit) {
        await updateDoc(doc(db, 'contacts', id), formData);
        navigate(`/contact/${id}`);
      } else {
        const docRef = await addDoc(collection(db, 'contacts'), formData);
        navigate(`/contact/${docRef.id}`);
      }
    } catch (error) {
      console.error('Error saving contact:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="contact-form-container">
      <div className="form-header">
        <Link to="/" className="back-link">← Contacts</Link>
      </div>
      
      <h1>{isEdit ? 'Edit Contact' : 'New Contact'}</h1>
      
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-row">
          <div className="form-group">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className={errors.firstName ? 'error' : ''}
            />
            {errors.firstName && <span className="error-message">{errors.firstName}</span>}
          </div>
          
          <div className="form-group">
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className={errors.lastName ? 'error' : ''}
            />
            {errors.lastName && <span className="error-message">{errors.lastName}</span>}
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="form-group full-width">
          <input
            type="text"
            name="street"
            placeholder="Street"
            value={formData.street}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-row three-col">
          <div className="form-group">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <input
              type="text"
              name="province"
              placeholder="Province/State"
              value={formData.province}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <input
              type="text"
              name="postal"
              placeholder="Postal/Zip"
              value={formData.postal}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group full-width">
          <input
            type="text"
            name="company"
            placeholder="Company"
            value={formData.company}
            onChange={handleChange}
          />
        </div>

        <div className="form-group full-width">
          <textarea
            name="notes"
            placeholder="Notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
          />
        </div>
        
        <div className="form-buttons">
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Saving...' : (isEdit ? 'Update Contact' : 'Add Contact')}
          </button>
          <Link to={isEdit ? `/contact/${id}` : '/'} className="cancel-button">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default ContactForm;