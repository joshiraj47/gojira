import axios from "axios";

const loginUserRequest = async ({email, password}) => {
    return await axios.post('/login', {
        email,
        password
    });
}

const registerUserRequest = async ({name, username, email, password}) => {
    return await axios.post('/registerUser', {
        name,
        username,
        email,
        password
    });
}

export {loginUserRequest, registerUserRequest};
