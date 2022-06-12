import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const PORT = 8000;

function Login({ setAuth, setUserId, getProfile }) {
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
    try {
      const body = { email, password };
      const response = await fetch(`http://localhost:${PORT}/api/users/login`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();

      if (parseRes.token) {
        localStorage.setItem("token", parseRes.token);
        setUserId(parseRes.user_id);
        setAuth(true);
        getProfile(parseRes.user_id);
        toast.dark("Login Successful");
        history.push("/");
      } else {
        setAuth(false);
        toast.dark(parseRes.message);
      }
    } catch (err) {
      console.error(err.message);
    }
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

export default Login;
