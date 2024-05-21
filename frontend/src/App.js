import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.min.css';
import 'bootstrap-icons/bootstrap-icons.svg';
import 'font-awesome/css/font-awesome.min.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Login} from "./components/Login";
import {Signup} from "./components/Signup";
import {Root} from "./components/Root";
import axios from "axios";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {AuthProvider} from "./components/AuthProvider";
import {ProtectedLayout} from "./components/ProtectedLayout";
import {Profile} from "./components/Profile";
import {ToastContainer} from "react-toastify";
import {LandingPage} from "./components/LandingPage";
import {CreateProject} from "./components/CreateProject";
import {Dashboard} from "./components/Dashboard";

axios.defaults.baseURL = 'https://gojira-backend.onrender.com';
axios.defaults.withCredentials = true;

const queryClient = new QueryClient();

function App() {
  return (
      <QueryClientProvider client={queryClient}>
          <ToastContainer autoClose={4000} hideProgressBar={true}/>
          <BrowserRouter>
              <AuthProvider>
                  <Routes>
                      <Route path="/" element={<Root/>}>
                          <Route path="" element={<ProtectedLayout/>}>
                              <Route path="" element={<LandingPage/>}>
                                  <Route path="" element={<Dashboard/>}/>
                                  <Route path="create-project" element={<CreateProject/>}/>
                              </Route>
                              <Route path="profile" element={<Profile/>} />
                          </Route>
                          <Route path="login" element={<Login/>} />
                          <Route path="register" element={<Signup/>} />
                      </Route>
                  </Routes>
              </AuthProvider>
          </BrowserRouter>
      </QueryClientProvider>
  );
}

export default App;
