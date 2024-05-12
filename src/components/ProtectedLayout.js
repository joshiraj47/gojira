import {Outlet, useNavigate} from "react-router-dom";
import {Navbar} from "./protected/Navbar";
import {useAuth} from "./AuthProvider";
import {useEffect} from "react";

export const ProtectedLayout = () => {
    const {user} = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (!user) return navigate('/login');
    }, [navigate, user]);
    return (
        <div>
            <Navbar/>
            <Outlet />
        </div>
    );
};
