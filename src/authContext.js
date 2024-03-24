import React, { createContext, useState, useEffect } from 'react';
import { getCredentials, setAuthToken, removeAuthToken } from './api/api';
import Cookies from 'universal-cookie';

export const AuthContext = createContext();
const cookies = new Cookies();

export const AuthProvider = ({ children }) => {

    const token = cookies.get('token');

    const [isLoggedIn, setIsLoggedIn] = useState(!!token);
    const [serverResponse, setServerResponse] = useState(null);
    const [serverError, setServerError] = useState(null);

    useEffect(() => {
        if (!token) {
            setIsLoggedIn(false);
        } else {
            setIsLoggedIn(true);
        }
    }, [token, isLoggedIn]);

    const login = async (credentials) => {
        try {
            const response = await getCredentials(credentials);

            if (response.status === 200) {
                setAuthToken(response.data.token);
                setIsLoggedIn(true);
                setServerResponse(response.data.message);
            }

        } catch (error) {
            setServerError('Server error please try again later');
        }
    }

    const logout = () => {
        removeAuthToken();
        setIsLoggedIn(false);
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, serverResponse, serverError }}>
            {children}
        </AuthContext.Provider>
    )
}