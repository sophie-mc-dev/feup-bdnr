import { createContext, useState, useEffect } from "react";
import Loading from "../components/Loading";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get user data if it exists in local storage
        let storedUserData = JSON.parse(localStorage.getItem('user'));
        if (storedUserData) {
            setUser(storedUserData);
            setIsLoggedIn(true);
        } else {
            setUser(null);
            setIsLoggedIn(false);
        }
        setLoading(false);
    }, []);

    const login = async(userInfo) => {
        localStorage.setItem('user', JSON.stringify(userInfo));
        setIsLoggedIn(true);
        setUser(userInfo);
    }

    const logout = async () => {
        localStorage.removeItem('user');
        setUser(null);
        setIsLoggedIn(false);
    }

    const updateLikedEvents = async (newLikedEvents) => {
        const userInfo = JSON.parse(localStorage.getItem('user'));

        userInfo.liked_events = newLikedEvents;
        localStorage.setItem('user', JSON.stringify(userInfo));
        setUser(userInfo);
    }
    
    return (
        loading ? <Loading /> : (
            <UserContext.Provider value={{ 
                user, 
                setUser,  
                login,
                logout,
                updateLikedEvents,
                isLoggedIn,
            }}>
                {children}
            </UserContext.Provider>
        )
    );
}