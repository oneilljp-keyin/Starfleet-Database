import { useState } from "react";
import { toast } from "react-toastify";

const PORT = 8000;

const Login = (props) => {
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
      const response = await fetch(`http://localhost:${PORT}/api/auth/register_login`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();

      if (parseRes.token) {
        toast.success("Login Successful");
      } else {
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
};

export default Login;
