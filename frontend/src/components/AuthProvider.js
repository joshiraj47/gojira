import {createContext, useContext, useMemo} from "react";
import {useLocalStorage} from "./UseLocalStorage";
import {useNavigate} from "react-router-dom";
import {getUserProfile} from "../apiRequests";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useLocalStorage("user", null);
    const navigate = useNavigate();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const login = async () => {
        const userData = await getUserProfile();
        setUser(userData.data);
        setTimeout(() => navigate('/'), 1000)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const logout = () => {
        setUser(null);
        navigate('/login');
        return Promise.resolve();
    }

    const value = useMemo(() => ({
        user,
        login,
        logout
    }), [login, logout, user]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
