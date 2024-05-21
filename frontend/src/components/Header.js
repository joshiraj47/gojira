import {Link, useNavigate} from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import {useEffect, useState} from "react";
import {useAuth} from "./AuthProvider";
import './Header.css';
import {toast} from "react-toastify";


export const Header = () => {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [doLogout, setDoLogout] = useState(false);
    const [navigateToProfile, setNavigateToProfile] = useState(false);
    const {logout} = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (doLogout) toast.promise(
            logout,
            {
                success: 'Logged out successfully',
            },
            {pauseOnHover: false}
        )
    }, [doLogout, logout]);
    useEffect(() => {
        if (navigateToProfile) navigate('/profile');
    }, [navigate, navigateToProfile]);
    const handleClose = () => setShowLogoutModal(false);
    const handleShow = () => setShowLogoutModal(true);
    const handleNavigateToProfile = (e) => {
        e.preventDefault();
        setNavigateToProfile(true);
    }
    const handleLogout = () => setDoLogout(true);
    return (
        <>
            <nav className="navbar navbar-dark jiraBlue my-header">
                <div className="container-fluid">
                    <Link className="navbar-brand fs-4" to="/">GoJira</Link>
                    <Dropdown>
                        <Dropdown.Toggle className="jiraBlue text-white" style={{border: 'none'}} id="dropdown-basic">
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor"
                                 className="bi bi-person-circle d-sm-inline" viewBox="0 0 16 16">
                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                                <path fillRule="evenodd"
                                      d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                            </svg>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={handleNavigateToProfile} href="/profile">
                                <div className="d-flex flex-row align-items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                                         className="bi bi-person" viewBox="0 0 16 16" style={{width: "20%"}}>
                                        <path
                                            d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                                    </svg>
                                    <span className="fs-6 fw-bolder ps-2">My Profile</span>
                                </div>
                            </Dropdown.Item>
                            <hr className="dropdown-divider"/>
                            <Dropdown.Item onClick={handleShow}>
                                <div className="d-flex flex-row align-items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                                         className="bi bi-box-arrow-right" viewBox="0 0 16 16" style={{width: "20%"}}>
                                        <path fillRule="evenodd"
                                              d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
                                        <path fillRule="evenodd"
                                              d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
                                    </svg>
                                    <span className="fs-6 fw-bolder ps-2">Log out</span>
                                </div>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </nav>
            <div className="gutterDiv bg-body-tertiary">&nbsp;</div>

            <Modal show={showLogoutModal} onHide={handleClose}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>Do you really want to logout?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleLogout}>
                        Logout
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
