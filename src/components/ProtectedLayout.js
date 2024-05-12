import {Outlet, useNavigate} from "react-router-dom";

import {useEffect} from "react";
import {useAuth} from "./AuthProvider";
import {Header} from "./Header";

export const ProtectedLayout = () => {
    const {user} = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (!user) return navigate('/login');
    }, [navigate, user]);
    return (
        <div>
            <Header/>
            <Outlet />
        </div>
    );
};
