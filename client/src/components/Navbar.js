import React from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function Navbar({ user, isAuth, setAuth, setAdmin }) {
  const logout = (e) => {
    e.preventDefault();
    try {
      localStorage.removeItem("token");
      setAuth(false);
      toast.success("Logout Succesful");
      setAdmin(false);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark fixed-top">
        <Link to={"/"} className="navbar-brand">
          Starfleet Database
        </Link>
        <button
          className="navbar-toggler navbar-toggler-right"
          type="button"
          data-toggle="collapse"
          data-target="#navb"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navb">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/personnel"} className="nav-link">
                Personnel
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/starships"} className="nav-link">
                Starships
              </Link>
            </li>
            <li className="nav-item">
              {isAuth ? (
                <button
                  onClick={logout}
                  className="btn btn-primary text-white font-weight-bold"
                  style={{ cursor: "pointer" }}
                >
                  Logout
                </button>
              ) : (
                <Link to={"/signin"} className="btn btn-dark text-white font-weight-bold">
                  Sign In
                </Link>
              )}
            </li>
            {!isAuth ? (
              <li className="nav-item">
                <Link to={"/signup"} className="btn btn-dark font-weight-bold">
                  Sign Up
                </Link>
              </li>
            ) : (
              " "
            )}
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
