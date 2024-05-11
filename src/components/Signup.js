import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {isEmpty} from "lodash/fp";
import {useMutation} from "@tanstack/react-query";
import {registerUserRequest} from "../apiRequests";

export const Signup = () => {
    const [name, setName] = useState('');
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [isPassSameAsConfirmPass, setIsPassSameAsConfirmPass] = useState(true);
    useEffect(() => {
        setIsPassSameAsConfirmPass(isEmpty(confirmPass) || (!isEmpty(confirmPass) && password === confirmPass));
    }, [confirmPass, password]);

    const navigate = useNavigate();

    const {mutate, isPending, isSuccess, isError, error} = useMutation({
        mutationFn: registerUserRequest,
        onSuccess: () => navigateToLogin()
    });

    function navigateToLogin() {
        setTimeout(() => navigate('/login'), 2000);
    }

    function shouldDisableSubmit() {
        return [name, username, email, password, confirmPass].some((attr) => isEmpty(attr)) || !isPassSameAsConfirmPass || isPending || isSuccess;
    }

    function registerUser(e) {
        e.preventDefault();
        mutate({name, username, email, password});
    }

    function showRegisterSuccessElement() {
        return <div
            className="alert alert-success d-flex align-items-center mb-0 mt-3"
            role="alert">
            <svg className="bi flex-shrink-0 me-2" width="24" height="24"
                 role="img" aria-label="Success:">
                <use xlinkHref="#check-circle-fill"/>
            </svg>
            <div>
                Registration Successful.
            </div>
        </div>
    }

    function showRegisterFailedElement() {
        return <div className="alert alert-danger d-flex align-items-center mb-0 mt-3" role="alert">
            <svg className="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:">
                <use xlinkHref="#exclamation-triangle-fill"/>
            </svg>
            <div>
                Registration Failed. {getFailedReason(error)}
            </div>
        </div>
    }

    function getFailedReason(error) {
        if (error?.response?.data.includes('duplicate key error')) {
            return 'An account with this email address already exists!';
        }
        return '';
    }

    function creatingAccount() {
        return <div
            className="d-flex justify-content-center align-items-center mb-0 mt-1"
            role="alert">
                                                        <span className="spinner-border spinner-border-sm"
                                                              role="status"></span>
            <span className="p-2">Creating your account...</span>
        </div>
    }

    return (
        <>
            <section className="vh-100 gradient-custom bg-body-tertiary">
                <div className="container py-2 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                            <div className="card bg-white text-black" style={{borderRadius: "1rem"}}>
                                <div className="card-body p-5 text-center">
                                    <div className="mt-md-4 pb-3">
                                        <h2 className="fw-bold mb-2 text-decoration-underline ">Sign Up</h2>
                                        <form className="needs-validation" id="form" onSubmit={registerUser}>
                                        <div data-mdb-input-init="" className="form-outline form-white mb-4">
                                                <label htmlFor="name"
                                                       className="float-start fw-bold mb-1">Full Name</label>
                                                <input required type="text" id="name" value={name}
                                                       onChange={(e) => setName(e.target.value)}
                                                       className="form-control form-control-lg"/>
                                            </div>

                                            <div data-mdb-input-init="" className="form-outline form-white mb-4">
                                                <label htmlFor="username"
                                                       className="float-start fw-bold mb-1">Username</label>
                                                <input required type="text" id="username" value={username}
                                                       onChange={(e) => setUserName(e.target.value)}
                                                       className="form-control form-control-lg"/>
                                            </div>

                                            <div data-mdb-input-init="" className="form-outline form-white mb-4">
                                                <label htmlFor="email"
                                                       className="float-start fw-bold mb-1">Email</label>
                                                <input required type="email" id="email" value={email}
                                                       onChange={(e) => setEmail(e.target.value)}
                                                       className="form-control form-control-lg"/>
                                            </div>

                                            <div data-mdb-input-init="" className="form-outline form-white mb-4">
                                                <label htmlFor="password"
                                                       className="float-start fw-bold mb-1">Password</label>
                                                <input required type="password" id="password" value={password}
                                                       onChange={(e) => setPass(e.target.value)}
                                                       className="form-control form-control-lg"/>
                                            </div>

                                            <div data-mdb-input-init="" className="form-outline form-white mb-4">
                                                <label htmlFor="confirmPass" className="float-start fw-bold mb-1">Confirm
                                                    Password</label>
                                                <div className="input-group">

                                                    <input required type="password" id="confirmPass" value={confirmPass}
                                                           onChange={(e) => setConfirmPass(e.target.value)}
                                                           className={"form-control form-control-lg " + (!isPassSameAsConfirmPass ? 'is-invalid' : '')}/>


                                                    {!isPassSameAsConfirmPass && (
                                                        <small className="float-start invalid-feedback mb-3">Passwords
                                                            do
                                                            not
                                                            match!</small>)}
                                                </div>
                                            </div>

                                            <button data-mdb-button-init="" data-mdb-ripple-init=""
                                                    disabled={shouldDisableSubmit()}
                                                    className="btn btn-primary btn-lg px-5" type="submit">
                                                Register
                                            </button>

                                            <svg xmlns="http://www.w3.org/2000/svg" style={{display: 'none'}}>
                                                <symbol id="check-circle-fill" fill="currentColor"
                                                        viewBox="0 0 16 16">
                                                    <path
                                                        d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                                                </symbol>
                                                <symbol id="info-fill" fill="currentColor" viewBox="0 0 16 16">
                                                    <path
                                                        d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                                                </symbol>
                                                <symbol id="exclamation-triangle-fill" fill="currentColor"
                                                        viewBox="0 0 16 16">
                                                    <path
                                                        d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                                                </symbol>
                                            </svg>

                                            {
                                                isPending && creatingAccount()
                                            }
                                            {
                                                isSuccess && showRegisterSuccessElement()
                                            }
                                            {
                                                isError && showRegisterFailedElement()
                                            }
                                        </form>


                                    </div>

                                    <div>
                                        <p className="mb-0">Already have an account?
                                            <Link to="/login" className="text-black-50 fw-bold mx-1">Log In</Link>
                                        </p>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
