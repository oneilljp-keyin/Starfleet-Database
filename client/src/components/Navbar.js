// import { useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function Navbar({ isAuth, setAuth, setAdmin, setName }) {
  const logout = (e) => {
    e.preventDefault();
    try {
      localStorage.removeItem("token");
      setAuth(false);
      toast.success("Logout Successful");
      setAdmin(false);
      setName("");
    } catch (err) {
      toast.success(err.message);
      console.log(err.message);
    }
  };

  return (
    <>
      <header id="main_header" className="header">
        <div className="header_inner">
          <nav>
            {/* <ul>
              <li>
                <span> */}
            <Link to={"/personnel"} className="lcars_btn purple_btn all_round header_btn">
              Personnel
            </Link>
            {/* </span>
              </li>
              <li>
                <span> */}
            <Link to={"/starships"} className="lcars_btn purple_btn all_round header_btn">
              Starships
            </Link>
            {/* </span>
              </li>
              <li>
                <span> */}
            {isAuth ? (
              <Link to={"/"} onClick={logout} className="lcars_btn purple_btn all_round header_btn">
                Logout
              </Link>
            ) : (
              <Link to={"/signin"} className="lcars_btn purple_btn all_round header_btn">
                Sign In
              </Link>
            )}
            {/* </span>
              </li>
            </ul> */}
          </nav>
        </div>
      </header>
    </>
  );
}

export default Navbar;
