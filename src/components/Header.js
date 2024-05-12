import {Link, useNavigate} from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import {useEffect, useState} from "react";
import {useAuth} from "./AuthProvider";
import './Header.scss';


export const Header = () => {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [doLogout, setDoLogout] = useState(false);
    const [navigateToProfile, setNavigateToProfile] = useState(false);
    const {logout} = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (doLogout) logout();
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
            <nav className="navbar navbar-dark jiraBlue p-0">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">GoJira</Link>
                    <Dropdown>
                        <Dropdown.Toggle className="jiraBlue text-white" style={{border: 'none'}} id="dropdown-basic">
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor"
                                 className="bi bi-person-circle" viewBox="0 0 16 16">
                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                                <path fillRule="evenodd"
                                      d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                            </svg>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={handleNavigateToProfile} href="/profile">Profile</Dropdown.Item>
                            <hr className="dropdown-divider"/>
                            <Dropdown.Item onClick={handleShow}>Logout</Dropdown.Item>
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
