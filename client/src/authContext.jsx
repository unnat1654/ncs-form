import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        user: null,
        token: ""
    });

    //default axios
    axios.defaults.headers.common['Authorization'] = auth?.token;
    useEffect(() => {
        const data = localStorage.getItem('form-auth');
        if (data) {
            const parseData = JSON.parse(data);
            setAuth({
                ...auth,
                username: parseData.username,
                token: parseData.token
            });
        }
        //eslint-disable-next-line
    }, []);
    return (
        <AuthContext.Provider value={[auth, setAuth]}>
            {children}
        </AuthContext.Provider>
    )
}

//custom hook
export const useAuth = () => useContext(AuthContext);
