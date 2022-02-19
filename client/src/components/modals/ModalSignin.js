import React, { useState } from "react";
import ReactDOM from "react-dom";
import { toast } from "react-toastify";

import SignInUpService from "../../services/signInUp";
import loading from "../../assets/loading.gif";

const SignInPopUp = ({ isShowing, hide, isAuth, modalClass, setAuth, setAdmin }) => {
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
          setAuth(true);
          toast.dark("Login Successful");
          setUser(initialUser);
          setIsLoading(false);
          hide();
        } else {
          localStorage.removeItem("token");
          setAuth(false);
          setAdmin(false);
          setIsLoading(false);
          toast.dark(response.data.message);
        }
      })
      .catch((err) => {
        console.error(err.message);
        toast.error(err.message);
      });
  };

  return !isShowing && !isAuth
    ? ReactDOM.createPortal(
        <React.Fragment>
          <div className="modal-overlay" />
          <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
            <div className={modalClass}>
              <div className="events-modal modal-content-wrapper">
                <div className="events-modal-container align-content-center">
                  <h1 className="text-center">Sign-In</h1>
                  <form className="text-center m-5" onSubmit={onSubmitForm}>
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
                    <button className="lcars_btn orange_btn left_round small_btn">Login</button>
                    <button className="lcars_btn red_btn right_round small_btn" onClick={hide}>
                      Cancel
                    </button>
                    <br />
                    {isLoading ? <img src={loading} className="loading" alt="loading..." /> : null}
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