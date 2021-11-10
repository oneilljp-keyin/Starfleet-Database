import { useState } from "react";
import { Switch, Route } from "react-router-dom";
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

toast.configure();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [adminRole, setAdminRole] = useState(true);
  const [database, setDatabase] = useState("mongo");
  const [name, setName] = useState(null);
  const [userId, setUserId] = useState(null);

  // ---- Get Name and Admin Privileges ---- \\
  async function getProfile(userId) {
    try {
      const response = await fetch(`http://localhost:8000/api/users/${userId}`, {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseData = await response.json();

      setName(parseData.name);
      setAdminRole(parseData.admin);
    } catch (err) {
      console.error(err.message);
    }
  }

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  return (
    <div className="container p-0">
      <div className="topbar">
        <div className="title-wrapper">
          <span className="topbar-title">Starfleet Database at Sector 709</span>
        </div>
      </div>
      <Navbar
        isAuth={isAuthenticated}
        setAuth={setAuth}
        setAdmin={setAdminRole}
        setName={setName}
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
                    userId={userId}
                    admin={adminRole}
                    userName={name}
                  />
                )}
              />
              <Route
                exact
                path={["/personnel"]}
                render={(props) => (
                  // !isAuthenticated ? (
                  //   <Redirect to="/signin" />
                  // ) :
                  <PersonnelList
                    {...props}
                    isAuth={isAuthenticated}
                    userId={userId}
                    admin={adminRole}
                    setDatabase={setDatabase}
                    database={database}
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
                    userId={userId}
                    database={database}
                  />
                )}
              />
              <Route
                exact
                path={["/starships"]}
                render={(props) => (
                  // !isAuthenticated ? (
                  //   <Redirect to="/signin" />
                  // ) :
                  <StarshipList
                    {...props}
                    isAuth={isAuthenticated}
                    userId={userId}
                    admin={adminRole}
                    setDatabase={setDatabase}
                    database={database}
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
                    database={database}
                  />
                )}
              />
              <Route
                path="/signin"
                render={(props) => (
                  <SignIn
                    {...props}
                    setAuth={setAuth}
                    setUserId={setUserId}
                    getProfile={getProfile}
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
      {/* </Provider> */}
    </div>
  );
}

export default App;
