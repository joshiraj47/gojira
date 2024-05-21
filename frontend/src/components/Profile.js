import './Profile.css';
import {useAuth} from "./AuthProvider";
import {useRef, useState} from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {useMutation, useQuery} from "@tanstack/react-query";
import {getAllAvatars, getUserAvatar, updateUserAvatar} from "../apiRequests";
import axios from "axios";
import {isEmpty} from "lodash/fp";
export const Profile = () => {
    const {user} = useAuth();
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const {data: userAvatarResponse, isFetched, refetch: refetchUserAvatar} = useQuery({queryKey: ["userAvatar"], queryFn: getUserAvatar,});
    const {data: response, isFetching, isSuccess, refetch} = useQuery({queryKey: ["defaultAvatars"], queryFn: getAllAvatars, enabled: false});
    const {mutate, isError} = useMutation({
        mutationFn: updateUserAvatar,
        onSuccess: () => {
            handleClose();
            refetchUserAvatar();
        }
    });

    const handleClose = () => setShowAvatarModal(false);
    const handleShow = () => {
        setShowAvatarModal(true);
        refetch();
    };

    const handleSelectImage = (e) => {
        mutate({avatarName:e.target.id});
    }
    const dateCreated = useRef(new Date(Number(user.dateCreated || 0)).toLocaleString());
    const lastLogin = useRef(new Date(Number(user.lastLogin || 0)).toLocaleString());

    function displayUserAvatar() {
        return <>
            {
                !isEmpty(userAvatarResponse?.data) &&
                <img alt="Select this Avatar"
                     src={`${axios.defaults.baseURL}/images/${userAvatarResponse?.data?.avatar}`}/>
            }
            {
                isFetched &&
                isEmpty(userAvatarResponse?.data) &&
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                     className="bi bi-person-circle jiraBlue text-white" viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                    <path fillRule="evenodd"
                          d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                </svg>
            }
        </>
    }
    return (
        <>
            <div className="header border-bottom">
                <div className="page-header-inner">
                    <div className="avatar-inner">
                        {displayUserAvatar()}
                    </div>
                    <div className="page-header-main">
                        <h1>{user?.name}</h1>
                    </div>
                </div>
            </div>
            <div className="p-lg-3">
                <div className="page-header-inner">
                    <div className="page-header-main d-flex justify-content-center">
                        <h2>Summary</h2>
                    </div>
                </div>


                <table className="table d-flex table-striped justify-content-center">
                    <tbody>
                    <tr>
                        <th scope="row">Avatar:</th>
                        <td>
                            <div className="avatar-inner cursor" onClick={handleShow}>
                                {displayUserAvatar()}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Full Name:</th>
                        <td>{user?.name}</td>
                    </tr>
                    <tr>
                        <th scope="row">Username:</th>
                        <td>{user?.username}</td>
                    </tr>
                    <tr>
                        <th scope="row">Email:</th>
                        <td>{user?.email}</td>
                    </tr>
                    <tr>
                        <th scope="row">Last Login:</th>
                        <td>{lastLogin.current.toString()}</td>
                    </tr>
                    <tr>
                        <th scope="row">Date Registered:</th>
                        <td>{dateCreated.current.toString()}</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <Modal show={showAvatarModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    Select a user avatar
                </Modal.Header>
                <Modal.Body>
                    <div className="form-body">
                        {
                            isFetching && <span>Fetching avatars...</span>
                        }
                        {
                            isSuccess &&
                            <ul className="jira-avatars" onClick={handleSelectImage}>
                                {
                                    response?.data?.files.map(file =>
                                        <li className="jira-avatar" key={file.id}>
                                            <button className="jira-icon-button" title="Select this Avatar" id={file.id}>
                                                <img alt="Select this Avatar" id={file.name} width="56" height="56"
                                                     src={`${axios.defaults.baseURL}/images/${file.name}`}/>
                                            </button>
                                        </li>
                                    )
                                }
                            </ul>
                        }
                    </div>
                    {
                        isError &&
                        <span className="flex-row align-self-center invalid-feedback">Failed to save avatar! Please try again.</span>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
