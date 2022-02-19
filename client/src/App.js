import { StrictMode, useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import Navbar from "./components/Navbar";
import SignIn from "./components/SignIn";
// import SignUp from "./components/SignUp";
import Landing from "./components/Landing";
import PersonnelList from "./components/personnel/PersonnelList";
import Officer from "./components/personnel/OfficerProfile";
import StarshipList from "./components/starships/StarshipList";
import Starship from "./components/starships/Starship";

import SignInUpService from "./services/signInUp";

toast.configure();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminRole, setAdminRole] = useState(false);
  const [name, setName] = useState(null);
  const [userId, setUserId] = useState(null);
  const [modalClass, setModalClass] = useState("main-modal-body modal-open");

  // ---- Get Name and Admin Privileges ---- \\
  useEffect(() => {
    async function getProfile() {
      SignInUpService.userInfo()
        .then((response) => {
          if (!response.data.error) {
            setName(response.data.name);
            setAdminRole(response.data.admin);
            setAuth(true);
          } else {
            setAuth(false);
            setAdminRole(false);
            setName(null);
            setUserId(null);
          }
        })
        .catch((err) => {
          setAuth(false);
          setAdminRole(false);
          setName(null);
          setUserId(null);
        });
    }
    getProfile();
  }, [isAuthenticated]);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  const logout = (e) => {
    e.preventDefault();
    try {
      localStorage.removeItem("token");
      setAuth(false);
      toast.success("Logout Successful");
      setAdminRole(false);
      setName("");
    } catch (err) {
      toast.success(err.message);
      console.log(err.message);
    }
  };

  return (
    <StrictMode>
      <Router basename="/">
        <div className="container p-0">
          <div className="topbar">
            <div className="title-wrapper">
              <Link to={"/"} className="topbar-title">
                Starfleet Database at Sector 709
              </Link>
            </div>
          </div>
          <Navbar
            isAuth={isAuthenticated}
            logout={logout}
            setAdmin={setAdminRole}
            setAuth={setIsAuthenticated}
          />
          <main className="main_body">
            <div className="content_wrapper">
              <div className="content_container align-content-center">
                <Switch>
                  <Route
                    exact
                    path={["/"]}
                    render={(props) => (
                      <Landing
                        {...props}
                        isAuth={isAuthenticated}
                        setAuth={setAuth}
                        admin={adminRole}
                        setAdmin={setAdminRole}
                        userName={name}
                        setName={setName}
                      />
                    )}
                  />
                  <Route
                    exact
                    path={["/personnel"]}
                    render={(props) => (
                      <PersonnelList
                        {...props}
                        isAuth={isAuthenticated}
                        userId={userId}
                        admin={adminRole}
                        modalClass={modalClass}
                        setModalClass={setModalClass}
                      />
                    )}
                  />
                  <Route
                    exact
                    path="/personnel/:id"
                    render={(props) => (
                      <Officer
                        {...props}
                        isAuth={isAuthenticated}
                        admin={adminRole}
                        modalClass={modalClass}
                        setModalClass={setModalClass}
                      />
                    )}
                  />
                  <Route
                    exact
                    path={["/starships"]}
                    render={(props) => (
                      <StarshipList
                        {...props}
                        isAuth={isAuthenticated}
                        userId={userId}
                        admin={adminRole}
                        modalClass={modalClass}
                        setModalClass={setModalClass}
                      />
                    )}
                  />
                  <Route
                    path="/starships/:id"
                    render={(props) => (
                      <Starship
                        {...props}
                        isAuth={isAuthenticated}
                        admin={adminRole}
                        userId={userId}
                        modalClass={modalClass}
                        setModalClass={setModalClass}
                      />
                    )}
                  />
                  <Route
                    path="/signin"
                    render={(props) => (
                      <SignIn
                        {...props}
                        setAuth={setAuth}
                        setAdmin={setAdminRole}
                        setUserId={setUserId}
                      />
                    )}
                  />
                  {/* <Route path="/signup" render={(props) => <SignUp {...props} />} /> */}
                </Switch>
              </div>
            </div>
          </main>
          <ToastContainer
            position="bottom-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover={false}
          />
        </div>
      </Router>
    </StrictMode>
  );
}

export default App;
