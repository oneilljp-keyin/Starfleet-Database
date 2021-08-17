import { useState } from "react";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
// import PropTypes from "prop-types";
// import { connect } from "react-redux";
// import { loginUser } from "../actions/authActions";

const PORT = 8000;

function Login({ setAuth, setUserId }) {
  const history = useHistory();

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
    try {
      const body = { email, password };
      const response = await fetch(`http://localhost:${PORT}/api/users/login`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();

      console.log(parseRes);

      if (parseRes.token) {
        localStorage.setItem("token", parseRes.token);
        setAuth(true);
        setUserId(parseRes.user_id);
        toast.success("Login Successful");
        history.push("/");
      } else {
        setAuth(false);
        toast.dark(parseRes);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="submit-form">
      <div>
        <form className="text-center my-5 mx-5" onSubmit={onSubmitForm}>
          <label htmlFor="user">Username</label>
          <input
            type="text"
            className="form-control"
            id="email"
            name="email"
            placeholder="Email"
            required
            value={user.email}
            onChange={(e) => onChange(e)}
          />
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            placeholder="Password"
            required
            value={user.password}
            onChange={(e) => onChange(e)}
          />
          <button className="btn btn-success">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
