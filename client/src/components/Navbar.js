// import { useState } from "react";
// import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function Navbar() {
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
            {/* {
              isAuth ? (
                <Link
                  to={"/"}
                  onClick={logout}
                  className="lcars_btn purple_btn all_round header_btn"
                >
                  Logout
                </Link>
              ) : null
              // <Link to={"/signin"} className="lcars_btn purple_btn all_round header_btn">
              //   Sign In
              // </Link>
            } */}
          </nav>
        </div>
      </header>
    </>
  );
}

export default Navbar;
