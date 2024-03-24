import React, { useState, useContext } from 'react';
import { AuthContext } from '../authContext';
import { useNavigate } from 'react-router-dom';

function AuthenticationForm() {
    const { login, serverResponse, serverError } = useContext(AuthContext);
    const navigate = useNavigate();

    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState({
        email: '',
        password: '',
        general: ''
    });



    const handleChange = async (e) => {
        const { name, value } = e.target;
        setCredentials({
            ...credentials,
            [name]: value
        });
        setError({ ...error, [name]: '' })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!validateForm()) {
                return;
            }

            await login(credentials);
            navigate("/control-panel/dashboard");

            setCredentials({
                email: '',
                password: ''
            });

        } catch (error) {
        }
    };

    const validateForm = () => {
        let valid = true;

        if (credentials.email.trim() === '') {
            setError(prevState => ({ ...prevState, email: 'Email is required' }));
            valid = false;
        }

        if (credentials.password.trim() === '') {
            setError(prevState => ({ ...prevState, password: 'Password is required' }));
            valid = false;
        }

        return valid;
    }

    return (
        <form>
            <label htmlFor='email'>Email</label>
            <input type='text' id='email' name='email' value={credentials.email} onChange={handleChange} required placeholder='Email' />
            {error.email && <span>{error.email}</span>}

            <label htmlFor='password'>Password</label>
            <input type='password' id='password' name='password' value={credentials.password} onChange={handleChange} required placeholder='Password' />
            {error.email && <span>{error.email}</span>}

            {error.general && <div>{error.general}</div>}

            <div>
                {serverResponse && <p>{serverResponse}</p>}
                {serverError && <p>{serverError}</p>}
            </div>

            <button type='submit' onClick={handleSubmit}>Login</button>
        </form>
    )
}

export default AuthenticationForm;