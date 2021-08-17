import { useState } from "react";
import { Switch, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Provider } from "react-redux";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import Personnel from "./components/personnel";
import PersonnelList from "./components/personnel-list";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import store from "./store";

toast.configure();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

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
      <Provider store={store}>
        <Navbar user={user} logout={logout} />
        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/personnel"]} component={PersonnelList} />
            <Route path="/personnel/:id" render={(props) => <Personnel {...props} user={user} />} />
            <Route path="/signin" render={(props) => <SignIn {...props} setAuth={setAuth} />} />
            <Route path="/signup" render={(props) => <SignUp {...props} login={login} />} />
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
      </Provider>
    </>
  );
}

export default App;
