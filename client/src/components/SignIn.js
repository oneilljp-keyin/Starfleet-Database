import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

import SignInUpService from "../services/signInUp";

function Signin({ setAuth, setAdmin }) {
  const history = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const { email, password } = user;

  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    const body = { email, password };
    SignInUpService.signIn(body)
      .then((response) => {
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          setAuth(true);
          toast.dark("Login Successful");
          history.push("/");
        } else {
          localStorage.removeItem("token");
          setAuth(false);
          setAdmin(false);
          toast.dark(response.data.message);
        }
      })
      .catch((err) => {
        console.error(err.message);
        toast.error(err.message);
      });
  };

  return (
    <>
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
        <button className="btn btn-success px-5">Login</button>
      </form>
    </>
  );
}

export default Signin;
