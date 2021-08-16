import { useState } from "react";
import { Switch, Route, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import Personnel from "./components/personnel";
import PersonnelList from "./components/personnel-list";
import Login from "./components/login";

function App() {
  const [user, setUser] = useState(null);

  async function login(user = null) {
    setUser(user);
    console.log(user);
  }

  async function logout() {
    setUser(null);
  }

  return (
    <>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <a href="/personnel" className="navbar-brand">
          Starfleet Database
        </a>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/personnel"} className="nav-link">
              Personnel
            </Link>
          </li>
          <li className="nav-item">
            {user ? (
              <button onClick={logout} className="nav-link" style={{ cursor: "pointer" }}>
                Logout {user.name}
              </button>
            ) : (
              <Link to={"/login"} className="nav-link">
                Login
              </Link>
            )}
          </li>
        </div>
      </nav>

      <div className="container mt-3">
        <Switch>
          <Route exact path={["/", "/personnel"]} component={PersonnelList} />
          <Route path="/personnel/:id" render={(props) => <Personnel {...props} user={user} />} />
          <Route path="/login" render={(props) => <Login {...props} login={login} />} />
        </Switch>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
      />
    </>
  );
}

export default App;
