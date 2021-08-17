import React from "react";
import { Link } from "react-router-dom";

function Navbar({ user, logout }) {
  return (
    <>
      <nav className="navbar navbar-expand navbar-dark bg-dark nav-justified">
        <a href="/personnel" className="navbar-brand">
          Starfleet Database
        </a>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/personnel"} className="nav-link">
              Personnel
            </Link>
          </li>
          <li className="nav-item">
            {user ? (
              <button onClick={logout} className="nav-link" style={{ cursor: "pointer" }}>
                Logout {user.name}
              </button>
            ) : (
              <Link to={"/login"} className="nav-link">
                Sign In
              </Link>
            )}
          </li>
        </div>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/register"} className="nav-link">
              Sign Up
            </Link>
          </li>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
