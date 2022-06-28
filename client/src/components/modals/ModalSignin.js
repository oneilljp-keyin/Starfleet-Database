import React, { useState } from "react";
import ReactDOM from "react-dom";
import { toast } from "react-toastify";

import SignInUpService from "../../services/signInUp";
import { Loading } from "../hooks/HooksAndFunctions";

const SignInPopUp = (props) => {
  const initialUser = {
    email: "",
    password: "",
  };
  const [user, setUser] = useState(initialUser);

  const { email, password } = user;
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onSubmitForm = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const body = { email, password };
    SignInUpService.signIn(body)
      .then((response) => {
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          props.setAuth(true);
          toast.dark("Login Successful");
          setUser(initialUser);
          setIsLoading(false);
          props.hide();
        } else {
          localStorage.removeItem("token");
          props.setAuth(false);
          props.setAdmin(false);
          setIsLoading(false);
          toast.dark(response.data.message);
        }
      })
      .catch((err) => {
        console.error(err.message);
        toast.error(err.message);
      });
  };

  return props.isShowing && !props.isAuth
    ? ReactDOM.createPortal(
      <React.Fragment>
        <div className="modal-overlay" />
        <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
          <div className={props.modalClass}>
            <div className="modal-bg events-modal modal-content-wrapper login-modal">
              <div className="events-modal-container align-content-center">
                <h1 className="text-center">Sign-In</h1>
                <form className="text-center" onSubmit={onSubmitForm}>
                  <div className="row my-2 justify-content-center">
                    <input
                      type="text"
                      className="form-control m-2 input-size"
                      id="email"
                      name="email"
                      placeholder="Email"
                      required
                      value={user.email}
                      onChange={(e) => onChange(e)}
                    />
                    <input
                      type="password"
                      className="form-control m-2 input-size"
                      id="password"
                      name="password"
                      placeholder="Password"
                      required
                      value={user.password}
                      onChange={(e) => onChange(e)}
                    />
                  </div>
                  <button className="lcars-btn orange-btn left-round small-btn">Login</button>
                  <button
                    className="lcars-btn red-btn right-round small-btn"
                    onClick={props.hide}
                  >
                    Cancel
                  </button>
                  <br />
                  {isLoading ? <Loading /> : null}
                </form>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>,
      document.body
    )
    : null;
};
export default SignInPopUp;
