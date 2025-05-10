import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in (on page refresh)
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('/api/validate-token', {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => {
                setUser(res.data.user);
            }).catch(() => {
                localStorage.removeItem('token');
            });
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        const res = await axios.post('/api/login', { username, password });
        localStorage.setItem('token', res.data.token);
        setUser({ username, role: res.data.role });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};