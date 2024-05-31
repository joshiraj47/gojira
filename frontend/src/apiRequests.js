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

const searchUsers = async ({searchTerm, selectedProject}) => {
    return await axios.post('/searchUsers', {searchTerm, selectedProject});
}

const addMemberToProject = async ({userId, projectId}) => {
    const addMember = axios.post('/add-member-to-project', {userId, projectId});
    return await toast.promise(
        addMember,
        {
            success: 'Member added successfully',
            pending: 'Adding member...'
        },
        {pauseOnHover: false}
    );
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

const createProject = async ({ name, category, description, projectId }) => {
    if (projectId) {
        const updateProject = axios.put(`/update-project/${projectId}`, {
            name,
            category,
            description,
        });
        return await toast.promise(
            updateProject,
            {
                error: 'Failed to update project. Please try again.',
                success: 'Project updated successfully',
            },
            {pauseOnHover: false}
        )
    }
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

const getAllProjects = async () => {
    return await axios.get('/projects');
}

const getAllProjectsWithJustNameAndId = async () => {
    return await axios.get('/projects-with-name-and-id');
}

const getProject = async ({projectId}) => {
    return await axios.post('/project-by-id', {projectId});
}

const deleteProject = async ({projectId}) => {
    const deleteProject =  axios.put(`/delete-project/${projectId}`);
    return await toast.promise(
        deleteProject,
        {
            error: 'Failed to delete project. Please try again.',
            success: 'Project deleted successfully',
        },
        {pauseOnHover: false}
    )
}

const getAllIssuesByProjectId = async ({projectId}) => {
    return await axios.post(`/issues-by-project-id/${projectId}`);
}

export {
    loginUserRequest,
    registerUserRequest,
    getUserProfile,
    getAllAvatars,
    getUserAvatar,
    updateUserAvatar,
    createProject,
    getAllProjects,
    getAllProjectsWithJustNameAndId,
    getProject,
    searchUsers,
    addMemberToProject,
    deleteProject,
    getAllIssuesByProjectId
};
