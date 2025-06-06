import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import { toast } from 'react-hot-toast';
import { data } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {

        const token = localStorage.getItem('token');
        if(token) {
            fetchUserProfile();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const response = await authService.getProfle();
            setUser(response.data.data.user);
            setIsAuthenticated(true);
        } catch(error) {
            console.error('Error fetching user profile:', error);
            localStorage.removeItem('token');
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const refreshTokenIfNeeded = async () => {
        try {
            const token = localStorage.getItem('token');
            if(!token) {
                console.log('No token available to refresh');
                return false;
            }

            await authService.getProfile();

            return true;
        } catch(error) {
            console.error('Token refresh needed:', error);

            const storedEmail = localStorage.getItem('userEmail');
            const storedPassword = localStorage.getItem('userPassword');

            if (storedEmail && storedPassword) {
                try {
                    const result = await login({
                        email: storedEmail,
                        password: storedPassword
                    });

                    return result.success;
                } catch (loginError) {
                    console.error('Auto login failed:', loginError);
                    logout();
                    return false;
                }
            } else {
                logout();
                return false;
            }
        }
    };

    const login = async (credentials) => {
        try {
            setLoading(true);
            const response = await authService.login(credentials);
            const { token, user } = response.data.data;

            localStorage.setItem('token', token);

            if(credentials.rememberMe) {
                localStorage.setItem('userEmail', credentials.email);
                localStorage.setItem('userPassword', credentials.password);
            }

            setUser(user);
            setIsAuthenticated(true);
            toast.success('Login successful');
            return { success: true };
        } catch(error) {
            toast.error(error.response?.data?.message || 'Login failed');
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed'
            };
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            setLoading(true);
            const response = await authService.register(userData);
            const { token, user } = response.data.data;

            localStorage.setItem('token', token);
            setUser(user);
            setIsAuthenticated(true);
            toast.success('Registration successful');
            return { success: true };
        } catch(error) {
            toast.error(error.response?.data?.message || 'Registration failed');
            return {
                error: error.response?.data?.message || 'Registration failed'
            };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
        toast.success('Logged out successfully');
    };

    const updateProfile = async (data) => {
        try {
            setLoading(true);
            const reponse = await authService.updateProfile(data);
            // setUser(response.data.data.user);
            toast.success('Profile updated successfully');
            return { success: true};
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed tp update profile');
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to update profile'
            };
        } finally {
            setLoading(false);
        }
    };

    const changePassword = async (data) => {
        try {
            setLoading(true);
            await authService.changePassword(data);
            toast.success('Password changed successfully');

        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to change password');
            return {
                error: error.response?.data?.message || 'Failed to change password'
            };
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider
           value={{
            user,
            loading,
            isAuthenticated,
            login,
            register,
            logout,
            updateProfile,
            changePassword,
            refreshTokenIfNeeded,
           }}
        >
            {children}

        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context;
}

export default AuthContext;
    