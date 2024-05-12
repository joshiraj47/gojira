import {Link} from "react-router-dom";
import {useState} from "react";
import {isEmpty} from "lodash/fp";
import {useMutation} from "@tanstack/react-query";
import {loginUserRequest} from "../apiRequests";
import {useAuth} from "./AuthProvider";

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPass] = useState('');
    const {login} = useAuth();

    const {mutate, isPending, isSuccess, isError} = useMutation({
        mutationFn: loginUserRequest,
        onSuccess: () => login()
    });
    function shouldDisableLogin() {
        return [email, password].some((attr) => isEmpty(attr)) || isPending || isSuccess;
    }
    function loginUser(e) {
        e.preventDefault();
        mutate({email, password});
    }
    function checkingLogin() {
        return <div
            className="d-flex justify-content-center align-items-center mb-0 mt-1"
            role="alert">
                                                        <span className="spinner-border spinner-border-sm"
                                                              role="status"></span>
            <span className="p-2">Checking login...</span>
        </div>
    }
    function showLoginFailedElement() {
        return <div className="alert alert-danger d-flex align-items-center mb-0 mt-3" role="alert">
            <svg className="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:">
                <use xlinkHref="#exclamation-triangle-fill"/>
            </svg>
            <div>
                Login Failed. Incorrect email or password!
            </div>
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
                                    <div className="mt-md-4 pb-4">
                                        <h2 className="fw-bold mb-2 text-decoration-underline text-uppercase">Gojira</h2>
                                        <p className="text-black-50 mb-5">Please enter your email and password!</p>

                                        <div data-mdb-input-init="" className="form-outline form-white mb-4">
                                            <input type="email" id="typeEmailX" placeholder="Email" value={email}
                                                   onChange={(e) => setEmail(e.target.value)}
                                                   className="form-control form-control-lg"/>
                                        </div>

                                        <div data-mdb-input-init="" className="form-outline form-white mb-4">
                                            <input type="password" id="typePasswordX" placeholder="Password" value={password}
                                                   onChange={(e) => setPass(e.target.value)}
                                                   className="form-control form-control-lg"/>
                                        </div>

                                        <p className="small mb-3 pb-lg-2">
                                            <a className="text-black-50 text-secondary-emphasis" href="/">Forgot password?</a>
                                        </p>

                                        <button data-mdb-button-init="" data-mdb-ripple-init=""
                                                disabled={shouldDisableLogin()}
                                                onClick={loginUser}
                                                className="btn btn-primary btn-lg px-5" type="submit">
                                            Log In
                                        </button>

                                        {
                                            isPending && checkingLogin()
                                        }
                                        {
                                            isError && showLoginFailedElement()
                                        }
                                    </div>

                                    <div>
                                        <p className="mb-0">Don't have an account?
                                            <Link to="/register" className="text-black-50 fw-bold mx-1">Sign Up</Link>
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
