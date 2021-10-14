// import { useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function Navbar({ isAuth, setAuth, setAdmin, setName }) {
  // const history = useHistory();
  // const [btnText, setBtnText] = useState("menu");
  // const [isStarshipSearchActive, setIsStarshipSearchActive] = useState(false);
  // const [isPersonnelSearchActive, setIsPersonnelSearchActive] = useState(false);

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
          {/* <hgroup className="p-2">
            <Link to={"/"} className="navbar-brand">
              <h2 className="text-right">Starfleet Database at Sector 709</h2>
            </Link>
          </hgroup> */}

          {/* <div className="menu-btn_wrapper">
            <button id="menu-btn" className="material-icons" onClick={toggleNav}>
              {btnText}
            </button>
          </div> */}

          {/* <nav id="main_nav" className={isActive ? "active" : null}> */}
          <nav id="main_nav" className="active">
            <ul>
              <li>
                <span>
                  {" "}
                  <Link to={"/personnel"} className="nav-link">
                    Personnel
                  </Link>
                </span>
              </li>
              <li>
                <span>
                  {" "}
                  <Link to={"/starships"} className="nav-link">
                    Starships
                  </Link>
                </span>
              </li>
              <li>
                <span>
                  {isAuth ? (
                    <Link
                      to={"/"}
                      onClick={logout}
                      className="nav-link"
                      style={{ cursor: "pointer" }}
                    >
                      Logout
                    </Link>
                  ) : (
                    <Link to={"/signin"} className="nav-link">
                      Sign In
                    </Link>
                  )}
                </span>
              </li>
              {/* {!isAuth ? (
                <li className="nav-item">
                  <Link to={"/signup"} className="nav-link">
                    Sign Up
                  </Link>
                </li>
              ) : (
                " "
              )} */}
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}

export default Navbar;
