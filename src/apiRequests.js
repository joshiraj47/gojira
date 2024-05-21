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

const createProject = async ({ name, category, description }) => {
    const createProject = axios.post('/create-project', {
        name,
        category,
        description,
    });
    return await toast.promise(
        createProject,
        {
            error: 'Failed to create project. Please try again.',
            success: 'Project created successfully',
        },
        {pauseOnHover: false}
    )
}

export {
    loginUserRequest,
    registerUserRequest,
    getUserProfile,
    getAllAvatars,
    getUserAvatar,
    updateUserAvatar,
    createProject
};
