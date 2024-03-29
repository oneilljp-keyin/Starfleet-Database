import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import Navbar from "./components/Navbar";
// import SignIn from "./components/SignIn";
// import SignUp from "./components/SignUp";
import Landing from "./components/Landing";
// import PersonnelList from "./components/personnel/PersonnelList";
import Officer from "./components/personnel/OfficerProfile";
// import StarshipList from "./components/starships/StarshipList";
import Starship from "./components/starships/Starship";
import List from "./components/SearchList";
import Systems from "./components/systems/System";

import SignInUpService from "./services/signInUp";
import { BackToTopFunction } from "./components/hooks/HooksAndFunctions";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminRole, setAdminRole] = useState(false);
  const [name, setName] = useState(null);
  const [userId, setUserId] = useState(null);
  const [showButton, setShowButton] = useState(false);

  // ---- Get Name and Admin Privileges ---- \\
  useEffect(() => {
    let isMounted = true;
    async function getProfile() {
      SignInUpService.userInfo()
        .then((response) => {
          if (isMounted) {
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
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  // The back-to-top button is hidden at the beginning
  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 200) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    });
  }, []);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  const logout = (e) => {
    e.preventDefault();
    try {
      localStorage.removeItem("token");
      setAuth(false);
      toast.dark("Logout Successful");
      setAdminRole(false);
      setName("");
    } catch (err) {
      toast.error(err.message);
      console.error(err.message);
    }
  };

  return (
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
      <main className="main-body">
        <div className="content-wrapper">
          <div className="content-container align-content-center">
            <Routes>
              <Route
                path="/*"
                element={
                  <Landing
                    isAuth={isAuthenticated}
                    setAuth={setAuth}
                    admin={adminRole}
                    setAdmin={setAdminRole}
                    userName={name}
                    setName={setName}
                  />
                }
              />
              <Route path="/personnel" element={<List isAuth={isAuthenticated} listCategory="personnel" />} />
              <Route
                path="/personnel/:id"
                element={<Officer isAuth={isAuthenticated} admin={adminRole} listCategory="personnel" />}
              />
              <Route
                path="/starships"
                element={
                  <List isAuth={isAuthenticated} userId={userId} admin={adminRole} listCategory="starships" />
                }
              />
              <Route
                path="/starships/:id"
                element={<Starship isAuth={isAuthenticated} admin={adminRole} userId={userId} listCategory="starships" />}
              />
              <Route
                path="/systems"
                element={<List isAuth={isAuthenticated} userId={userId} admin={adminRole} listCategory="systems" />}
              />
              <Route
                path="/systems/:id"
                element={<Systems isAuth={isAuthenticated} admin={adminRole} userId={userId} listCategory="systems" />}
              />
              {/* <Route
                path="/signin"
                element={
                  <SignIn
                    setAuth={setAuth}
                    setAdmin={setAdminRole}
                    setUserId={setUserId}
                  />
                }
              /> */}
              {/* <Route path="/signup" element={<SignUp />} /> */}
            </Routes>
          </div>
        </div>
      </main>
      {showButton && <BackToTopFunction />}
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
  );
}

export default App;
