import axios from "axios";
import {toast} from "react-toastify";

const loginUserRequest = async ({email, password}) => {
    const login = axios.post('/login', {
        email,
        password
    });
    return await toast.promise(
        login,
        {
            success: 'Login successful',
        },
        {pauseOnHover: false}
    )
}



const registerUserRequest = async ({name, username, email, password}) => {
    return await axios.post('/registerUser', {
        name,
        username,
        email,
        password
    });
}

const getUserProfile = async () => {
    return await axios.get('/userProfile');
}

const getAllAvatars = async () => {
    return await axios.get('/defaultAvatars');
}

const getUserAvatar = async () => {
    return await axios.get('/userAvatar');
}

const updateUserAvatar = async ({avatarName}) => {
    return await axios.put('/userAvatar/update', {
        avatarName
    });
}

export {
    loginUserRequest,
    registerUserRequest,
    getUserProfile,
    getAllAvatars,
    getUserAvatar,
    updateUserAvatar
};
