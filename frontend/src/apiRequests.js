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

const searchProject = async ({searchTerm}) => {
    return await axios.post('/searchProject', {searchTerm});
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

const getAllProjects = async ({pageNum, limit}) => {
    return await axios.get(`/projects?page=${pageNum}&pageSize=${limit}`);
}

const getAllProjectsWithJustNameAndId = async () => {
    return await axios.get('/projects-with-name-and-id');
}

const getProject = async ({projectId}) => {
    return await axios.post('/project-by-id', {projectId});
}

const updateIssue = async ({issueId, payload}) => {
    return await axios.put(`/update-issue/${issueId}`, {payload});
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

const createIssue = async ({...payload}) => {
    const createIssue = axios.post('/create-issue', {...payload});
    return await toast.promise(
        createIssue,
        {
            error: 'Failed to create issue. Please try again.',
            success: 'Issue created successfully',
        },
        {pauseOnHover: false}
    )
}

const getIssueComments = async ({issueId}) => {
    return await axios.post(`/get-comments/${issueId}`);
}

const addIssueComment = async ({issueId, description}) => {
    const addIssueComment = axios.post(`/add-comment`, {issueId, description});
    return await toast.promise(
        addIssueComment,
        {
            error: 'Failed to add comment. Please try again.',
            success: 'Comment added successfully',
        },
        {pauseOnHover: false}
    );
}

const updateIssueComment = async ({commentId, description}) => {
    const updateIssueComment = axios.put(`/update-comment/${commentId}`, {description});
    return await toast.promise(
        updateIssueComment,
        {
            error: 'Failed to update comment. Please try again.',
            success: 'Comment updated successfully',
        },
        {pauseOnHover: false}
    );
}

const deleteIssueComment = async ({commentId}) => {
    const deleteIssueComment =  axios.put(`/delete-comment/${commentId}`);
    return await toast.promise(
        deleteIssueComment,
        {
            error: 'Failed to delete comment. Please try again.',
            success: 'Comment deleted successfully',
        },
        {pauseOnHover: false}
    )
}
const deleteIssue = async ({issueId}) => {
    const deleteIssue =  axios.put(`/delete-issue/${issueId}`);
    return await toast.promise(
        deleteIssue,
        {
            error: 'Failed to delete issue. Please try again.',
            success: 'Issue deleted successfully',
        },
        {pauseOnHover: false}
    )
}

axios.interceptors.response.use(
    response => {
        // Any status code within the range of 2xx causes this function to trigger
        if (response?.data === 'No token found'){
            localStorage.removeItem('user');
            window.location.href = '/login';
            return Promise.resolve();
        }
        return response;
    },
);

export {
    loginUserRequest,
    registerUserRequest,
    getUserProfile,
    getAllAvatars,
    getUserAvatar,
    updateUserAvatar,
    createProject,
    updateIssue,
    getAllProjects,
    getAllProjectsWithJustNameAndId,
    getProject,
    searchUsers,
    searchProject,
    addMemberToProject,
    deleteProject,
    getAllIssuesByProjectId,
    createIssue,
    deleteIssue,
    getIssueComments,
    addIssueComment,
    updateIssueComment,
    deleteIssueComment
};
