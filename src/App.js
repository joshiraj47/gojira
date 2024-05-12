import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/bootstrap-icons.svg';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Login} from "./components/Login";
import {Signup} from "./components/Signup";
import {Root} from "./components/Root";
import axios from "axios";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {AuthProvider} from "./components/AuthProvider";
import {ProtectedLayout} from "./components/ProtectedLayout";
import {Profile} from "./components/Profile";

axios.defaults.baseURL = 'http://192.168.0.102:4000';
axios.defaults.withCredentials = true;

const queryClient = new QueryClient();

function App() {
  return (
      <QueryClientProvider client={queryClient}>
          <BrowserRouter>
              <AuthProvider>
                  <Routes>
                      <Route path="/" element={<Root/>}>
                          <Route path="" element={<ProtectedLayout/>}>
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
