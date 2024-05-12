import './Profile.scss';
import {useAuth} from "./AuthProvider";
import {useRef} from "react";
export const Profile = () => {
    const {user} = useAuth();
    const dateCreated = useRef(new Date(Number(user.dateCreated || 0)).toLocaleString());
    const lastLogin = useRef(new Date(Number(user.lastLogin || 0)).toLocaleString());
    return (
        <>
            <div className="header border-bottom">
                <div className="page-header-inner">
                    <div className="avatar-inner">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                             className="bi bi-person-circle jiraBlue text-white" viewBox="0 0 16 16">
                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                            <path fillRule="evenodd"
                                  d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                        </svg>
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
                            <div className="avatar-inner ">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                     className="bi bi-person-circle jiraBlue text-white" viewBox="0 0 16 16">
                                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                                    <path fillRule="evenodd"
                                          d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                                </svg>
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
        </>
    )
}
