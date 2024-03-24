import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { submitContactForm } from '../api/api';
import '../styles/Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [error, setError] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [serverResponse, setServerResponse] = useState(null);
  const [serverError, setServerError] = useState(null);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError({ ...error, [name]: '' });
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setServerResponse(null);
      setServerError(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [serverResponse, serverError]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!validateForm()) {
        return;
      }

      const response = await submitContactForm(formData);

      setServerResponse(response.data.message);

      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

    } catch (error) {
      setServerError('Server error please try again later');
    }
  }

  const validateForm = () => {
    let valid = true;

    if (formData.name.trim() === '') {
      setError(prevState => ({ ...prevState, name: 'Please fill in a name' }));
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email.trim() === '' || !emailRegex.test(formData.email)) {
      setError(prevState => ({ ...prevState, email: 'Please fill in a valid email' }));
      valid = false;
    }

    if (formData.subject.trim() === '') {
      setError(prevState => ({ ...prevState, subject: 'Please fill in a relevant subject' }));
      valid = false;
    }

    if (formData.message.trim() === '') {
      setError(prevState => ({ ...prevState, message: 'Please fill in a message' }));
      valid = false;
    }
    return valid;
  }

  return (
    <>
      <Header />
      <main>
        <div className='address'>
          <div>
            <p><strong>Email: certdolj@yahoo.cpm</strong></p>
            <p><em>Address: Str. Unirea, Nr. 99</em></p>
          </div>
          <div className="vertical-line"></div>
          <div>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11408.732097350328!2d24.00037946197736!3d44.36783163723129!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4752d2ed046cd65d%3A0xe5da357489a529fc!2sDC1A%2069%2C%20C%C3%A2mpeni%20207450!5e0!3m2!1sen!2sro!4v1710283577144!5m2!1sen!2sro" title='Centrul de Tineret Campeni' allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </div>

        <div className='contact-form'>
          <h2>Get in touch with us:</h2>
          <form>
            <label htmlFor=''>Name</label>
            <input type='text' id='name' name='name' value={formData.name} onChange={handleChange} placeholder='Your name' />
            {error.name && <span>{error.name}</span>}

            <label htmlFor='email'>Your Email:</label>
            <input type='email' id='email' name='email' value={formData.email} onChange={handleChange} placeholder='your email' />
            {error.email && <span>{error.email}</span>}

            <label htmlFor='subject'>Subject:</label>
            <input type='text' id='subject' name='subject' value={formData.subject} onChange={handleChange} placeholder='Give a meaningful title' />
            {error.subject && <span>{error.subject}</span>}

            <label htmlFor='message'>Message</label>
            <textarea id='message' name='message' value={formData.message} onChange={handleChange} placeholder='Your message...'></textarea>
            {error.message && <span>{error.message}</span>}

            <div>
              {serverResponse && <p>{serverResponse}</p>}
              {serverError && <p>{serverError}</p>}
            </div>

            <button type='submit' onClick={handleSubmit}>Submit</button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default Contact;