import { useState } from "react";
import { connect } from "react-redux";
import { Link, useHistory, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

import { registerUser } from "../actions/authActions";

function Register() {
  let history = useHistory();

  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const { name, email, password, password2 } = inputs;

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { name, email, password, password2 };
      // if (!email || !password || !name || !password2) {
      //   toast.warning("Fields Incomplete");
      //   return;
      // }

      // if (password !== password2) {
      //   toast.warning("Password fields do not match");
      //   return;
      // }

      console.log(body);

      const response = await fetch("http://localhost:8000/api/users/register", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(body),
      });

      console.log(response);

      const parseRes = await response.json();

      if (parseRes.message) {
        toast.success(parseRes.message);
        setTimeout(() => {
          history.push("/login");
        }, 3500);
      } else {
        toast.error(parseRes.message);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <h1 className="text-center">Register</h1>
      <form className="text-center my-3 mx-3" onSubmit={onSubmitForm}>
        <div className="row my-1">
          <input
            className="form-control my-2"
            type="text"
            name="name"
            placeholder="Name"
            value={name}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className="row my-1">
          <input
            className="form-control my-2"
            type="email"
            name="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className="row my-1 justify-content-between">
          <input
            className="col-6 form-control my-2"
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => onChange(e)}
          />
          <input
            className="col-6 form-control my-2"
            type="password"
            name="password2"
            placeholder="Re-Enter Password"
            value={password2}
            onChange={(e) => onChange(e)}
          />
        </div>
        <button className="btn btn-success px-5">Register</button>
      </form>
      <div className="text-center">
        <Link to="/" className="text-center">
          Login
        </Link>
      </div>
    </>
  );
}

// Register.propTypes = {
//   registerUser: PropTypes.func.isRequired,
//   auth: PropTypes.object.isRequired,
//   errors: PropTypes.object.isRequired,
// };

// const mapStateToProps = (state) => ({
//   auth: state.auth,
//   errors: state.errors,
// });

// export default connect(mapStateToProps, { registerUser })(withRouter(Register));
export default Register;
