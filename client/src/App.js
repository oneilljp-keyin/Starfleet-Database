import { useState } from "react";
import { Switch, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Provider } from "react-redux";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import Navbar from "./components/Navbar";
import Officer from "./components/officer";
import PersonnelList from "./components/personnel-list";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import store from "./store";

toast.configure();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminRole, setAdminRole] = useState(false);
  const [name, setName] = useState(null);
  const [userId, setUserId] = useState(null);

  console.log(adminRole, name, userId);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  return (
    <>
      <Provider store={store}>
        <Navbar isAuth={isAuthenticated} setAuth={setAuth} setAdmin={setAdminRole} />
        <div className="nav-buffer"></div>
        <div className="container mt-3">
          <Switch>
            <Route
              exact
              path={["/", "/personnel"]}
              render={(props) => (
                <PersonnelList
                  {...props}
                  isAuth={isAuthenticated}
                  setName={setName}
                  setAdmin={setAdminRole}
                  userId={userId}
                />
              )}
            />
            <Route path="/personnel/:id" render={(props) => <Officer {...props} />} />
            <Route
              path="/signin"
              render={(props) => <SignIn {...props} setAuth={setAuth} setUserId={setUserId} />}
            />
            <Route path="/signup" render={(props) => <SignUp {...props} />} />
          </Switch>
        </div>
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
      </Provider>
    </>
  );
}

export default App;
